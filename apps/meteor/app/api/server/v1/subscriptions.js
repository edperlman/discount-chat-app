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
const rest_typings_1 = require("@rocket.chat/rest-typings");
const meteor_1 = require("meteor/meteor");
const readMessages_1 = require("../../../../server/lib/readMessages");
const api_1 = require("../api");
api_1.API.v1.addRoute('subscriptions.get', {
    authRequired: true,
    validateParams: rest_typings_1.isSubscriptionsGetProps,
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { updatedSince } = this.queryParams;
            let updatedSinceDate;
            if (updatedSince) {
                if (isNaN(Date.parse(updatedSince))) {
                    throw new meteor_1.Meteor.Error('error-roomId-param-invalid', 'The "lastUpdate" query parameter must be a valid date.');
                }
                updatedSinceDate = new Date(updatedSince);
            }
            const result = yield meteor_1.Meteor.callAsync('subscriptions/get', updatedSinceDate);
            return api_1.API.v1.success(Array.isArray(result)
                ? {
                    update: result,
                    remove: [],
                }
                : result);
        });
    },
});
api_1.API.v1.addRoute('subscriptions.getOne', {
    authRequired: true,
    validateParams: rest_typings_1.isSubscriptionsGetOneProps,
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { roomId } = this.queryParams;
            if (!roomId) {
                return api_1.API.v1.failure("The 'roomId' param is required");
            }
            return api_1.API.v1.success({
                subscription: yield models_1.Subscriptions.findOneByRoomIdAndUserId(roomId, this.userId),
            });
        });
    },
});
/**
  This API is suppose to mark any room as read.

    Method: POST
    Route: api/v1/subscriptions.read
    Params:
        - rid: The rid of the room to be marked as read.
        - roomId: Alternative for rid.
 */
api_1.API.v1.addRoute('subscriptions.read', {
    authRequired: true,
    validateParams: rest_typings_1.isSubscriptionsReadProps,
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { readThreads = false } = this.bodyParams;
            const roomId = 'rid' in this.bodyParams ? this.bodyParams.rid : this.bodyParams.roomId;
            yield (0, readMessages_1.readMessages)(roomId, this.userId, readThreads);
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('subscriptions.unread', {
    authRequired: true,
    validateParams: rest_typings_1.isSubscriptionsUnreadProps,
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            yield meteor_1.Meteor.callAsync('unreadMessages', this.bodyParams.firstUnreadMessage, this.bodyParams.roomId);
            return api_1.API.v1.success();
        });
    },
});
