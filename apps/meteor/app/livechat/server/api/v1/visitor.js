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
const models_1 = require("@rocket.chat/models");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const callbacks_1 = require("../../../../../lib/callbacks");
const server_1 = require("../../../../api/server");
const server_2 = require("../../../../settings/server");
const LivechatTyped_1 = require("../../lib/LivechatTyped");
const livechat_1 = require("../lib/livechat");
server_1.API.v1.addRoute('livechat/visitor', {
    rateLimiterOptions: {
        numRequestsAllowed: 5,
        intervalTimeInMS: 60000,
    },
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(this.bodyParams, {
                visitor: check_1.Match.ObjectIncluding({
                    token: String,
                    name: check_1.Match.Maybe(String),
                    email: check_1.Match.Maybe(String),
                    department: check_1.Match.Maybe(String),
                    phone: check_1.Match.Maybe(String),
                    username: check_1.Match.Maybe(String),
                    customFields: check_1.Match.Maybe([
                        check_1.Match.ObjectIncluding({
                            key: String,
                            value: String,
                            overwrite: Boolean,
                        }),
                    ]),
                }),
            });
            const { customFields, id, token, name, email, department, phone, username, connectionData } = this.bodyParams.visitor;
            if (!(token === null || token === void 0 ? void 0 : token.trim())) {
                throw new meteor_1.Meteor.Error('error-invalid-token', 'Token cannot be empty', { method: 'livechat/visitor' });
            }
            const guest = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ token }, (id && { id })), (name && { name })), (email && { email })), (department && { department })), (username && { username })), (connectionData && { connectionData })), (phone && typeof phone === 'string' && { phone: { number: phone } })), { connectionData: (0, livechat_1.normalizeHttpHeaderData)(this.request.headers) });
            const visitor = yield LivechatTyped_1.Livechat.registerGuest(guest);
            if (!visitor) {
                throw new meteor_1.Meteor.Error('error-livechat-visitor-registration', 'Error registering visitor', {
                    method: 'livechat/visitor',
                });
            }
            const extraQuery = yield callbacks_1.callbacks.run('livechat.applyRoomRestrictions', {});
            // If it's updating an existing visitor, it must also update the roomInfo
            const rooms = yield models_1.LivechatRooms.findOpenByVisitorToken(visitor === null || visitor === void 0 ? void 0 : visitor.token, {}, extraQuery).toArray();
            yield Promise.all(rooms.map((room) => {
                var _a, _b;
                return visitor &&
                    LivechatTyped_1.Livechat.saveRoomInfo(room, {
                        _id: visitor._id,
                        name: visitor.name,
                        phone: (_b = (_a = visitor.phone) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.phoneNumber,
                        livechatData: visitor.livechatData,
                    });
            }));
            if (customFields && Array.isArray(customFields) && customFields.length > 0) {
                const keys = customFields.map((field) => field.key);
                const errors = [];
                const processedKeys = yield Promise.all(yield models_1.LivechatCustomField.findByIdsAndScope(keys, 'visitor', {
                    projection: { _id: 1 },
                })
                    .map((field) => __awaiter(this, void 0, void 0, function* () {
                    const customField = customFields.find((f) => f.key === field._id);
                    if (!customField) {
                        return;
                    }
                    const { key, value, overwrite } = customField;
                    // TODO: Change this to Bulk update
                    if (!(yield models_1.LivechatVisitors.updateLivechatDataByToken(token, key, value, overwrite))) {
                        errors.push(key);
                    }
                    return key;
                }))
                    .toArray());
                if (processedKeys.length !== keys.length) {
                    LivechatTyped_1.Livechat.logger.warn({
                        msg: 'Some custom fields were not processed',
                        visitorId: visitor._id,
                        missingKeys: keys.filter((key) => !processedKeys.includes(key)),
                    });
                }
                if (errors.length > 0) {
                    LivechatTyped_1.Livechat.logger.error({
                        msg: 'Error updating custom fields',
                        visitorId: visitor._id,
                        errors,
                    });
                    throw new Error('error-updating-custom-fields');
                }
                return server_1.API.v1.success({ visitor: yield models_1.LivechatVisitors.findOneEnabledById(visitor._id) });
            }
            if (!visitor) {
                throw new meteor_1.Meteor.Error('error-saving-visitor', 'An error ocurred while saving visitor');
            }
            return server_1.API.v1.success({ visitor });
        });
    },
});
server_1.API.v1.addRoute('livechat/visitor/:token', {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(this.urlParams, {
                token: String,
            });
            const visitor = yield models_1.LivechatVisitors.getVisitorByToken(this.urlParams.token, {});
            if (!visitor) {
                throw new meteor_1.Meteor.Error('invalid-token');
            }
            return server_1.API.v1.success({ visitor });
        });
    },
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(this.urlParams, {
                token: String,
            });
            const visitor = yield models_1.LivechatVisitors.getVisitorByToken(this.urlParams.token, {});
            if (!visitor) {
                throw new meteor_1.Meteor.Error('invalid-token');
            }
            const extraQuery = yield callbacks_1.callbacks.run('livechat.applyRoomRestrictions', {});
            const rooms = yield models_1.LivechatRooms.findOpenByVisitorToken(this.urlParams.token, {
                projection: {
                    name: 1,
                    t: 1,
                    cl: 1,
                    u: 1,
                    usernames: 1,
                    servedBy: 1,
                },
            }, extraQuery).toArray();
            // if gdpr is enabled, bypass rooms check
            if ((rooms === null || rooms === void 0 ? void 0 : rooms.length) && !server_2.settings.get('Livechat_Allow_collect_and_store_HTTP_header_informations')) {
                throw new meteor_1.Meteor.Error('visitor-has-open-rooms', 'Cannot remove visitors with opened rooms');
            }
            const { _id } = visitor;
            const result = yield LivechatTyped_1.Livechat.removeGuest(_id);
            if (!result.modifiedCount) {
                throw new meteor_1.Meteor.Error('error-removing-visitor', 'An error ocurred while deleting visitor');
            }
            return server_1.API.v1.success({
                visitor: {
                    _id,
                    ts: new Date().toISOString(),
                },
            });
        });
    },
});
server_1.API.v1.addRoute('livechat/visitor/:token/room', { authRequired: true, permissionsRequired: ['view-livechat-manager'] }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const extraQuery = yield callbacks_1.callbacks.run('livechat.applyRoomRestrictions', {});
            const rooms = yield models_1.LivechatRooms.findOpenByVisitorToken(this.urlParams.token, {
                projection: {
                    name: 1,
                    t: 1,
                    cl: 1,
                    u: 1,
                    usernames: 1,
                    servedBy: 1,
                },
            }, extraQuery).toArray();
            return server_1.API.v1.success({ rooms });
        });
    },
});
server_1.API.v1.addRoute('livechat/visitor.callStatus', {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(this.bodyParams, {
                token: String,
                callStatus: String,
                rid: String,
                callId: String,
            });
            const { token, callStatus, rid, callId } = this.bodyParams;
            const guest = yield (0, livechat_1.findGuest)(token);
            if (!guest) {
                throw new meteor_1.Meteor.Error('invalid-token');
            }
            yield LivechatTyped_1.Livechat.updateCallStatus(callId, rid, callStatus, guest);
            return server_1.API.v1.success({ token, callStatus });
        });
    },
});
server_1.API.v1.addRoute('livechat/visitor.status', {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(this.bodyParams, {
                token: String,
                status: String,
            });
            const { token, status } = this.bodyParams;
            const guest = yield (0, livechat_1.findGuest)(token);
            if (!guest) {
                throw new meteor_1.Meteor.Error('invalid-token');
            }
            yield LivechatTyped_1.Livechat.notifyGuestStatusChanged(token, status);
            return server_1.API.v1.success({ token, status });
        });
    },
});
