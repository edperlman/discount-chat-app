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
exports.NPSService = void 0;
const crypto_1 = require("crypto");
const core_services_1 = require("@rocket.chat/core-services");
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const notification_1 = require("./notification");
const sendNpsResults_1 = require("./sendNpsResults");
const system_1 = require("../../lib/logger/system");
class NPSService extends core_services_1.ServiceClassInternal {
    constructor() {
        super(...arguments);
        this.name = 'nps';
    }
    create(nps) {
        return __awaiter(this, void 0, void 0, function* () {
            const npsEnabled = yield models_1.Settings.getValueById('NPS_survey_enabled');
            if (!npsEnabled) {
                throw new Error('Server opted-out for NPS surveys');
            }
            const any = yield models_1.Nps.findOne({}, { projection: { _id: 1 } });
            if (!any) {
                if (nps.expireAt < nps.startAt || nps.expireAt < new Date()) {
                    throw new Error('NPS already expired');
                }
                yield core_services_1.Banner.create((0, notification_1.getBannerForAdmins)(nps.expireAt));
                yield (0, notification_1.notifyAdmins)(nps.startAt);
            }
            const { npsId, startAt, expireAt, createdBy } = nps;
            try {
                yield models_1.Nps.save({
                    _id: npsId,
                    startAt,
                    expireAt,
                    createdBy,
                    status: core_typings_1.NPSStatus.OPEN,
                });
            }
            catch (err) {
                system_1.SystemLogger.error({ msg: 'Error creating NPS', err });
                throw new Error('Error creating NPS');
            }
            return true;
        });
    }
    sendResults() {
        return __awaiter(this, void 0, void 0, function* () {
            const npsEnabled = yield models_1.Settings.getValueById('NPS_survey_enabled');
            if (!npsEnabled) {
                return;
            }
            const npsSending = yield models_1.Nps.getOpenExpiredAlreadySending();
            const nps = npsSending || (yield models_1.Nps.getOpenExpiredAndStartSending());
            if (!nps) {
                return;
            }
            const total = yield models_1.NpsVote.countByNpsId(nps._id);
            const votesToSend = yield models_1.NpsVote.findNotSentByNpsId(nps._id).toArray();
            // if there is nothing to sent, check if something gone wrong
            if (votesToSend.length === 0) {
                // check if still has votes left to send
                const totalSent = yield models_1.NpsVote.countByNpsIdAndStatus(nps._id, core_typings_1.INpsVoteStatus.SENT);
                if (totalSent === total) {
                    yield models_1.Nps.updateStatusById(nps._id, core_typings_1.NPSStatus.SENT);
                    return;
                }
                // update old votes (sent 5 minutes ago or more) in 'sending' status back to 'new'
                yield models_1.NpsVote.updateOldSendingToNewByNpsId(nps._id);
                // try again in 5 minutes
                setTimeout(() => core_services_1.NPS.sendResults(), 5 * 60 * 1000);
                return;
            }
            const today = new Date();
            const sending = yield Promise.all(votesToSend.map((vote) => __awaiter(this, void 0, void 0, function* () {
                const { value } = yield models_1.NpsVote.findOneAndUpdate({
                    _id: vote._id,
                    status: core_typings_1.INpsVoteStatus.NEW,
                }, {
                    $set: {
                        status: core_typings_1.INpsVoteStatus.SENDING,
                        sentAt: today,
                    },
                }, {
                    projection: {
                        identifier: 1,
                        roles: 1,
                        score: 1,
                        comment: 1,
                    },
                });
                return value;
            })));
            const votes = sending.filter(Boolean);
            if (votes.length > 0) {
                const voteIds = votes.map(({ _id }) => _id);
                const votesWithoutIds = votes.map(({ identifier, roles, score, comment }) => ({
                    identifier,
                    roles,
                    score,
                    comment,
                }));
                const payload = {
                    total,
                    votes: votesWithoutIds,
                };
                yield (0, sendNpsResults_1.sendNpsResults)(nps._id, payload);
                yield models_1.NpsVote.updateVotesToSent(voteIds);
            }
            const totalSent = yield models_1.NpsVote.countByNpsIdAndStatus(nps._id, core_typings_1.INpsVoteStatus.SENT);
            if (totalSent < total) {
                // send more in five minutes
                setTimeout(() => core_services_1.NPS.sendResults(), 5 * 60 * 1000);
                return;
            }
            yield models_1.Nps.updateStatusById(nps._id, core_typings_1.NPSStatus.SENT);
        });
    }
    vote(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, npsId, roles, score, comment }) {
            const npsEnabled = yield models_1.Settings.getValueById('NPS_survey_enabled');
            if (!npsEnabled) {
                return;
            }
            if (!npsId || typeof npsId !== 'string') {
                throw new Error('Invalid NPS id');
            }
            const nps = yield models_1.Nps.findOneById(npsId, {
                projection: { status: 1, startAt: 1, expireAt: 1 },
            });
            if (!nps) {
                return;
            }
            if (nps.status !== core_typings_1.NPSStatus.OPEN) {
                throw new Error('NPS not open for votes');
            }
            const today = new Date();
            if (today > nps.expireAt) {
                throw new Error('NPS expired');
            }
            if (today < nps.startAt) {
                throw new Error('NPS survey not started');
            }
            const identifier = (0, crypto_1.createHash)('sha256').update(`${userId}${npsId}`).digest('hex');
            const result = yield models_1.NpsVote.save({
                ts: new Date(),
                npsId,
                identifier,
                roles,
                score,
                comment,
                status: core_typings_1.INpsVoteStatus.NEW,
            });
            if (!result) {
                throw new Error('Error saving NPS vote');
            }
        });
    }
    closeOpenSurveys() {
        return __awaiter(this, void 0, void 0, function* () {
            yield models_1.Nps.closeAllByStatus(core_typings_1.NPSStatus.OPEN);
        });
    }
}
exports.NPSService = NPSService;
