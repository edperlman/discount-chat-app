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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const random_1 = require("@rocket.chat/random");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const pushConfig_1 = require("../../../../server/lib/pushConfig");
const canAccessRoom_1 = require("../../../authorization/server/functions/canAccessRoom");
const PushNotification_1 = __importDefault(require("../../../push-notifications/server/lib/PushNotification"));
const server_1 = require("../../../settings/server");
const api_1 = require("../api");
api_1.API.v1.addRoute('push.token', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, type, value, appName } = this.bodyParams;
            if (id && typeof id !== 'string') {
                throw new meteor_1.Meteor.Error('error-id-param-not-valid', 'The required "id" body param is invalid.');
            }
            const deviceId = id || random_1.Random.id();
            if (!type || (type !== 'apn' && type !== 'gcm')) {
                throw new meteor_1.Meteor.Error('error-type-param-not-valid', 'The required "type" body param is missing or invalid.');
            }
            if (!value || typeof value !== 'string') {
                throw new meteor_1.Meteor.Error('error-token-param-not-valid', 'The required "value" body param is missing or invalid.');
            }
            if (!appName || typeof appName !== 'string') {
                throw new meteor_1.Meteor.Error('error-appName-param-not-valid', 'The required "appName" body param is missing or invalid.');
            }
            const result = yield meteor_1.Meteor.callAsync('raix:push-update', {
                id: deviceId,
                token: { [type]: value },
                authToken: this.request.headers['x-auth-token'],
                appName,
                userId: this.userId,
            });
            return api_1.API.v1.success({ result });
        });
    },
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            const { token } = this.bodyParams;
            if (!token || typeof token !== 'string') {
                throw new meteor_1.Meteor.Error('error-token-param-not-valid', 'The required "token" body param is missing or invalid.');
            }
            const affectedRecords = (yield models_1.AppsTokens.deleteMany({
                $or: [
                    {
                        'token.apn': token,
                    },
                    {
                        'token.gcm': token,
                    },
                ],
                userId: this.userId,
            })).deletedCount;
            if (affectedRecords === 0) {
                return api_1.API.v1.notFound();
            }
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('push.get', { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const params = this.queryParams;
            (0, check_1.check)(params, check_1.Match.ObjectIncluding({
                id: String,
            }));
            const receiver = yield models_1.Users.findOneById(this.userId);
            if (!receiver) {
                throw new Error('error-user-not-found');
            }
            const message = yield models_1.Messages.findOneById(params.id);
            if (!message) {
                throw new Error('error-message-not-found');
            }
            const room = yield models_1.Rooms.findOneById(message.rid);
            if (!room) {
                throw new Error('error-room-not-found');
            }
            if (!(yield (0, canAccessRoom_1.canAccessRoomAsync)(room, receiver))) {
                throw new Error('error-not-allowed');
            }
            const data = yield PushNotification_1.default.getNotificationForMessageId({ receiver, room, message });
            return api_1.API.v1.success({ data });
        });
    },
});
api_1.API.v1.addRoute('push.info', { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const defaultGateway = (_a = (yield models_1.Settings.findOneById('Push_gateway', { projection: { packageValue: 1 } }))) === null || _a === void 0 ? void 0 : _a.packageValue;
            const defaultPushGateway = server_1.settings.get('Push_gateway') === defaultGateway;
            return api_1.API.v1.success({
                pushGatewayEnabled: server_1.settings.get('Push_enable'),
                defaultPushGateway,
            });
        });
    },
});
api_1.API.v1.addRoute('push.test', {
    authRequired: true,
    rateLimiterOptions: {
        numRequestsAllowed: 1,
        intervalTimeInMS: 1000,
    },
    permissionsRequired: ['test-push-notifications'],
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            if (server_1.settings.get('Push_enable') !== true) {
                throw new meteor_1.Meteor.Error('error-push-disabled', 'Push is disabled', {
                    method: 'push_test',
                });
            }
            const tokensCount = yield (0, pushConfig_1.executePushTest)(this.userId, this.user.username);
            return api_1.API.v1.success({ tokensCount });
        });
    },
});
