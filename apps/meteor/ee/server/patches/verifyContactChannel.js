"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runVerifyContactChannel = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const license_1 = require("@rocket.chat/license");
const models_1 = require("@rocket.chat/models");
const QueueManager_1 = require("../../../app/livechat/server/lib/QueueManager");
const mergeContacts_1 = require("../../../app/livechat/server/lib/contacts/mergeContacts");
const verifyContactChannel_1 = require("../../../app/livechat/server/lib/contacts/verifyContactChannel");
const utils_1 = require("../../../server/database/utils");
const logger_1 = require("../../app/livechat-enterprise/server/lib/logger");
function _verifyContactChannel(params_1, room_1) {
    return __awaiter(this, arguments, void 0, function* (params, room, attempts = 2) {
        const { contactId, field, value, visitorId, roomId } = params;
        const session = utils_1.client.startSession();
        try {
            session.startTransaction();
            logger_1.contactLogger.debug({ msg: 'Start verifying contact channel', contactId, visitorId, roomId });
            yield models_1.LivechatContacts.updateContactChannel({
                visitorId,
                source: room.source,
            }, {
                verified: true,
                verifiedAt: new Date(),
                field,
                value: value.toLowerCase(),
            }, {}, { session });
            yield models_1.LivechatRooms.update({ _id: roomId }, { $set: { verified: true } }, { session });
            logger_1.contactLogger.debug({ msg: 'Merging contacts', contactId, visitorId, roomId });
            const mergeContactsResult = yield (0, mergeContacts_1.mergeContacts)(contactId, { visitorId, source: room.source }, session);
            yield session.commitTransaction();
            return mergeContactsResult;
        }
        catch (e) {
            yield session.abortTransaction();
            if ((0, utils_1.shouldRetryTransaction)(e) && attempts > 0) {
                logger_1.contactLogger.debug({ msg: 'Retrying to verify contact channel', contactId, visitorId, roomId });
                return _verifyContactChannel(params, room, attempts - 1);
            }
            logger_1.contactLogger.error({ msg: 'Error verifying contact channel', contactId, visitorId, roomId, error: e });
            throw new Error('error-verifying-contact-channel');
        }
        finally {
            yield session.endSession();
        }
    });
}
const runVerifyContactChannel = (_next, params) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomId, contactId, visitorId } = params;
    const room = yield models_1.LivechatRooms.findOneById(roomId);
    if (!room) {
        throw new Error('error-invalid-room');
    }
    const result = yield _verifyContactChannel(params, room);
    logger_1.contactLogger.debug({ msg: 'Finding inquiry', roomId });
    // Note: we are not using the session here since allowing the transactional flow to be used inside the
    //       saveQueueInquiry function would require a lot of changes across the codebase, so if we fail here we
    //       will not be able to rollback the transaction. That is not a big deal since the contact will be properly
    //       merged and the inquiry will be saved in the queue (will need to be taken manually by an agent though).
    const inquiry = yield models_1.LivechatInquiry.findOneByRoomId(roomId);
    if (!inquiry) {
        // Note: if this happens, something is really wrong with the queue, so we should throw an error to avoid
        //       carrying on a weird state.
        throw new Error('error-invalid-inquiry');
    }
    if (inquiry.status === core_typings_1.LivechatInquiryStatus.VERIFYING) {
        logger_1.contactLogger.debug({ msg: 'Verifying inquiry', roomId });
        yield QueueManager_1.QueueManager.verifyInquiry(inquiry, room);
    }
    logger_1.contactLogger.debug({
        msg: 'Contact channel has been verified and merged successfully',
        contactId,
        visitorId,
        roomId,
    });
    return result;
});
exports.runVerifyContactChannel = runVerifyContactChannel;
verifyContactChannel_1.verifyContactChannel.patch(exports.runVerifyContactChannel, () => license_1.License.hasModule('contact-id-verification'));
