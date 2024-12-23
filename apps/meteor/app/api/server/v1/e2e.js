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
const rest_typings_1 = require("@rocket.chat/rest-typings");
const expiry_map_1 = __importDefault(require("expiry-map"));
const meteor_1 = require("meteor/meteor");
const canAccessRoom_1 = require("../../../authorization/server/functions/canAccessRoom");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const handleSuggestedGroupKey_1 = require("../../../e2e/server/functions/handleSuggestedGroupKey");
const provideUsersSuggestedGroupKeys_1 = require("../../../e2e/server/functions/provideUsersSuggestedGroupKeys");
const resetRoomKey_1 = require("../../../e2e/server/functions/resetRoomKey");
const server_1 = require("../../../settings/server");
const api_1 = require("../api");
// After 10s the room lock will expire, meaning that if for some reason the process never completed
// The next reset will be available 10s after
const LockMap = new expiry_map_1.default(10000);
api_1.API.v1.addRoute('e2e.fetchMyKeys', {
    authRequired: true,
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield meteor_1.Meteor.callAsync('e2e.fetchMyKeys');
            return api_1.API.v1.success(result);
        });
    },
});
api_1.API.v1.addRoute('e2e.getUsersOfRoomWithoutKey', {
    authRequired: true,
    validateParams: rest_typings_1.ise2eGetUsersOfRoomWithoutKeyParamsGET,
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { rid } = this.queryParams;
            const result = yield meteor_1.Meteor.callAsync('e2e.getUsersOfRoomWithoutKey', rid);
            return api_1.API.v1.success(result);
        });
    },
});
/**
 * @openapi
 *  /api/v1/e2e.setRoomKeyID:
 *    post:
 *      description: Sets the end-to-end encryption key ID for a room
 *      security:
 *        - autenticated: {}
 *      requestBody:
 *        description: A tuple containing the room ID and the key ID
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                rid:
 *                  type: string
 *                keyID:
 *                  type: string
 *      responses:
 *        200:
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ApiSuccessV1'
 *        default:
 *          description: Unexpected error
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ApiFailureV1'
 */
api_1.API.v1.addRoute('e2e.setRoomKeyID', {
    authRequired: true,
    validateParams: rest_typings_1.ise2eSetRoomKeyIDParamsPOST,
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { rid, keyID } = this.bodyParams;
            yield meteor_1.Meteor.callAsync('e2e.setRoomKeyID', rid, keyID);
            return api_1.API.v1.success();
        });
    },
});
/**
 * @openapi
 *  /api/v1/e2e.setUserPublicAndPrivateKeys:
 *    post:
 *      description: Sets the end-to-end encryption keys for the authenticated user
 *      security:
 *        - autenticated: {}
 *      requestBody:
 *        description: A tuple containing the public and the private keys
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                public_key:
 *                  type: string
 *                private_key:
 *                  type: string
 *                force:
 *                  type: boolean
 *      responses:
 *        200:
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ApiSuccessV1'
 *        default:
 *          description: Unexpected error
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ApiFailureV1'
 */
api_1.API.v1.addRoute('e2e.setUserPublicAndPrivateKeys', {
    authRequired: true,
    validateParams: rest_typings_1.ise2eSetUserPublicAndPrivateKeysParamsPOST,
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            const { public_key, private_key, force } = this.bodyParams;
            yield meteor_1.Meteor.callAsync('e2e.setUserPublicAndPrivateKeys', {
                public_key,
                private_key,
                force,
            });
            return api_1.API.v1.success();
        });
    },
});
/**
 * @openapi
 *  /api/v1/e2e.updateGroupKey:
 *    post:
 *      description: Updates the end-to-end encryption key for a user on a room
 *      security:
 *        - autenticated: {}
 *      requestBody:
 *        description: A tuple containing the user ID, the room ID, and the key
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                uid:
 *                  type: string
 *                rid:
 *                  type: string
 *                key:
 *                  type: string
 *      responses:
 *        200:
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ApiSuccessV1'
 *        default:
 *          description: Unexpected error
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ApiFailureV1'
 */
api_1.API.v1.addRoute('e2e.updateGroupKey', {
    authRequired: true,
    validateParams: rest_typings_1.ise2eUpdateGroupKeyParamsPOST,
    deprecation: {
        version: '8.0.0',
    },
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid, rid, key } = this.bodyParams;
            yield meteor_1.Meteor.callAsync('e2e.updateGroupKey', rid, uid, key);
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('e2e.acceptSuggestedGroupKey', {
    authRequired: true,
    validateParams: rest_typings_1.ise2eGetUsersOfRoomWithoutKeyParamsGET,
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { rid } = this.bodyParams;
            yield (0, handleSuggestedGroupKey_1.handleSuggestedGroupKey)('accept', rid, this.userId, 'e2e.acceptSuggestedGroupKey');
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('e2e.rejectSuggestedGroupKey', {
    authRequired: true,
    validateParams: rest_typings_1.ise2eGetUsersOfRoomWithoutKeyParamsGET,
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { rid } = this.bodyParams;
            yield (0, handleSuggestedGroupKey_1.handleSuggestedGroupKey)('reject', rid, this.userId, 'e2e.rejectSuggestedGroupKey');
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('e2e.fetchUsersWaitingForGroupKey', {
    authRequired: true,
    validateParams: rest_typings_1.isE2EFetchUsersWaitingForGroupKeyProps,
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!server_1.settings.get('E2E_Enable')) {
                return api_1.API.v1.success({ usersWaitingForE2EKeys: {} });
            }
            const { roomIds = [] } = this.queryParams;
            const usersWaitingForE2EKeys = (yield models_1.Subscriptions.findUsersWithPublicE2EKeyByRids(roomIds, this.userId).toArray()).reduce((acc, { rid, users }) => (Object.assign({ [rid]: users }, acc)), {});
            return api_1.API.v1.success({
                usersWaitingForE2EKeys,
            });
        });
    },
});
api_1.API.v1.addRoute('e2e.provideUsersSuggestedGroupKeys', {
    authRequired: true,
    validateParams: rest_typings_1.isE2EProvideUsersGroupKeyProps,
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!server_1.settings.get('E2E_Enable')) {
                return api_1.API.v1.success();
            }
            yield (0, provideUsersSuggestedGroupKeys_1.provideUsersSuggestedGroupKeys)(this.userId, this.bodyParams.usersSuggestedGroupKeys);
            return api_1.API.v1.success();
        });
    },
});
// This should have permissions
api_1.API.v1.addRoute('e2e.resetRoomKey', { authRequired: true, validateParams: rest_typings_1.isE2EResetRoomKeyProps }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { rid, e2eKey, e2eKeyId } = this.bodyParams;
            if (!(yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'toggle-room-e2e-encryption', rid))) {
                return api_1.API.v1.unauthorized();
            }
            if (LockMap.has(rid)) {
                throw new Error('error-e2e-key-reset-in-progress');
            }
            LockMap.set(rid, true);
            if (!(yield (0, canAccessRoom_1.canAccessRoomIdAsync)(rid, this.userId))) {
                throw new Error('error-not-allowed');
            }
            try {
                yield (0, resetRoomKey_1.resetRoomKey)(rid, this.userId, e2eKey, e2eKeyId);
                return api_1.API.v1.success();
            }
            catch (e) {
                console.error(e);
                return api_1.API.v1.failure('error-e2e-key-reset-failed');
            }
            finally {
                LockMap.delete(rid);
            }
        });
    },
});
