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
exports.getRoomRoles = getRoomRoles;
const models_1 = require("@rocket.chat/models");
const underscore_1 = __importDefault(require("underscore"));
const server_1 = require("../../../app/settings/server");
function getRoomRoles(rid) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            sort: {
                'u.username': 1,
            },
            projection: {
                rid: 1,
                u: 1,
                roles: 1,
            },
        };
        const useRealName = server_1.settings.get('UI_Use_Real_Name') === true;
        const roles = yield models_1.Roles.find({ scope: 'Subscriptions', description: { $exists: true, $ne: '' } }).toArray();
        const subscriptions = yield models_1.Subscriptions.findByRoomIdAndRoles(rid, underscore_1.default.pluck(roles, '_id'), options).toArray();
        if (!useRealName) {
            return subscriptions;
        }
        return Promise.all(subscriptions.map((subscription) => __awaiter(this, void 0, void 0, function* () {
            const user = yield models_1.Users.findOneById(subscription.u._id);
            subscription.u.name = user === null || user === void 0 ? void 0 : user.name;
            return subscription;
        })));
    });
}
