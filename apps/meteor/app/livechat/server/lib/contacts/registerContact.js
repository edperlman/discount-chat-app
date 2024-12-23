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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerContact = registerContact;
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const getAllowedCustomFields_1 = require("./getAllowedCustomFields");
const validateCustomFields_1 = require("./validateCustomFields");
const callbacks_1 = require("../../../../../lib/callbacks");
const notifyListener_1 = require("../../../../lib/server/lib/notifyListener");
function registerContact(_a) {
    return __awaiter(this, arguments, void 0, function* ({ token, name, email = '', phone, username, customFields = {}, contactManager, }) {
        var _b, e_1, _c, _d;
        var _e, _f, _g;
        if (!token || typeof token !== 'string') {
            throw new core_services_1.MeteorError('error-invalid-contact-data', 'Invalid visitor token');
        }
        const visitorEmail = email.trim().toLowerCase();
        if (contactManager === null || contactManager === void 0 ? void 0 : contactManager.username) {
            // verify if the user exists with this username and has a livechat-agent role
            const manager = yield models_1.Users.findOneByUsername(contactManager.username, { projection: { roles: 1 } });
            if (!manager) {
                throw new core_services_1.MeteorError('error-contact-manager-not-found', `No user found with username ${contactManager.username}`);
            }
            if (!manager.roles || !Array.isArray(manager.roles) || !manager.roles.includes('livechat-agent')) {
                throw new core_services_1.MeteorError('error-invalid-contact-manager', 'The contact manager must have the role "livechat-agent"');
            }
        }
        const existingUserByToken = yield models_1.LivechatVisitors.getVisitorByToken(token, { projection: { _id: 1 } });
        let visitorId = existingUserByToken === null || existingUserByToken === void 0 ? void 0 : existingUserByToken._id;
        if (!existingUserByToken) {
            if (!username) {
                username = yield models_1.LivechatVisitors.getNextVisitorUsername();
            }
            const existingUserByEmail = yield models_1.LivechatVisitors.findOneGuestByEmailAddress(visitorEmail);
            visitorId = existingUserByEmail === null || existingUserByEmail === void 0 ? void 0 : existingUserByEmail._id;
            if (!existingUserByEmail) {
                const userData = {
                    username,
                    ts: new Date(),
                    token,
                };
                visitorId = (yield models_1.LivechatVisitors.insertOne(userData)).insertedId;
            }
        }
        const allowedCF = yield (0, getAllowedCustomFields_1.getAllowedCustomFields)();
        const livechatData = (0, validateCustomFields_1.validateCustomFields)(allowedCF, customFields, { ignoreAdditionalFields: true });
        const fieldsToRemove = Object.assign(Object.assign(Object.assign({}, (phone === '' && { phone: 1 })), (visitorEmail === '' && { visitorEmails: 1 })), (!(contactManager === null || contactManager === void 0 ? void 0 : contactManager.username) && { contactManager: 1 }));
        const updateUser = Object.assign({ $set: Object.assign(Object.assign(Object.assign({ token,
                name,
                livechatData }, (phone && { phone: [{ phoneNumber: phone }] })), (visitorEmail && { visitorEmails: [{ address: visitorEmail }] })), ((contactManager === null || contactManager === void 0 ? void 0 : contactManager.username) && { contactManager: { username: contactManager.username } })) }, (Object.keys(fieldsToRemove).length && { $unset: fieldsToRemove }));
        yield models_1.LivechatVisitors.updateOne({ _id: visitorId }, updateUser);
        const extraQuery = yield callbacks_1.callbacks.run('livechat.applyRoomRestrictions', {});
        const rooms = yield models_1.LivechatRooms.findByVisitorId(visitorId, {}, extraQuery).toArray();
        if (rooms === null || rooms === void 0 ? void 0 : rooms.length) {
            try {
                for (var _h = true, rooms_1 = __asyncValues(rooms), rooms_1_1; rooms_1_1 = yield rooms_1.next(), _b = rooms_1_1.done, !_b; _h = true) {
                    _d = rooms_1_1.value;
                    _h = false;
                    const room = _d;
                    const { _id: rid } = room;
                    const responses = yield Promise.all([
                        models_1.Rooms.setFnameById(rid, name),
                        models_1.LivechatInquiry.setNameByRoomId(rid, name),
                        models_1.Subscriptions.updateDisplayNameByRoomId(rid, name),
                    ]);
                    if ((_e = responses[0]) === null || _e === void 0 ? void 0 : _e.modifiedCount) {
                        void (0, notifyListener_1.notifyOnRoomChangedById)(rid);
                    }
                    if ((_f = responses[1]) === null || _f === void 0 ? void 0 : _f.modifiedCount) {
                        void (0, notifyListener_1.notifyOnLivechatInquiryChangedByRoom)(rid, 'updated', { name });
                    }
                    if ((_g = responses[2]) === null || _g === void 0 ? void 0 : _g.modifiedCount) {
                        void (0, notifyListener_1.notifyOnSubscriptionChangedByRoomId)(rid);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_h && !_b && (_c = rooms_1.return)) yield _c.call(rooms_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        return visitorId;
    });
}
