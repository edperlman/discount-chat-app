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
exports.SearchResultValidationService = void 0;
const models_1 = require("@rocket.chat/models");
const mem_1 = __importDefault(require("mem"));
const meteor_1 = require("meteor/meteor");
const isTruthy_1 = require("../../../../lib/isTruthy");
const server_1 = require("../../../authorization/server");
const logger_1 = require("../logger/logger");
class SearchResultValidationService {
    constructor() {
        this.getSubscription = (0, mem_1.default)((rid, uid) => __awaiter(this, void 0, void 0, function* () {
            if (!rid) {
                return;
            }
            const room = yield models_1.Rooms.findOneById(rid);
            if (!room) {
                return;
            }
            if (!uid || !(yield (0, server_1.canAccessRoomAsync)(room, { _id: uid }))) {
                return;
            }
            return room;
        }));
        this.getUser = (0, mem_1.default)((uid) => __awaiter(this, void 0, void 0, function* () {
            if (!uid) {
                return;
            }
            return models_1.Users.findOneById(uid, { projection: { username: 1 } });
        }));
    }
    validateSearchResult(result) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const uid = (_a = meteor_1.Meteor.userId()) !== null && _a !== void 0 ? _a : undefined;
            const validatedResult = {};
            // get subscription for message
            if (result.message) {
                validatedResult.message = {
                    docs: (yield Promise.all(result.message.docs.map((msg) => __awaiter(this, void 0, void 0, function* () {
                        const user = yield this.getUser(msg.u._id);
                        const subscription = yield this.getSubscription(msg.rid, uid);
                        if (subscription) {
                            logger_1.SearchLogger.debug(`user ${uid} can access ${msg.rid}`);
                            return Object.assign(Object.assign({}, msg), { user: msg.u._id, r: { name: subscription.name, t: subscription.t }, username: user === null || user === void 0 ? void 0 : user.username, valid: true });
                        }
                        logger_1.SearchLogger.debug(`user ${uid} can NOT access ${msg.rid}`);
                        return undefined;
                    })))).filter(isTruthy_1.isTruthy),
                };
            }
            if (result.room) {
                result.room.docs = (yield Promise.all(result.room.docs.map((room) => __awaiter(this, void 0, void 0, function* () {
                    const subscription = yield this.getSubscription(room._id, uid);
                    if (!subscription) {
                        logger_1.SearchLogger.debug(`user ${uid} can NOT access ${room._id}`);
                        return undefined;
                    }
                    logger_1.SearchLogger.debug(`user ${uid} can access ${room._id}`);
                    return Object.assign(Object.assign({}, room), { valid: true, t: subscription.t, name: subscription.name });
                })))).filter(isTruthy_1.isTruthy);
            }
            return validatedResult;
        });
    }
}
exports.SearchResultValidationService = SearchResultValidationService;
