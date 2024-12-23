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
exports.checkUserHasCloudLogin = checkUserHasCloudLogin;
const models_1 = require("@rocket.chat/models");
const retrieveRegistrationStatus_1 = require("./retrieveRegistrationStatus");
function checkUserHasCloudLogin(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const { workspaceRegistered } = yield (0, retrieveRegistrationStatus_1.retrieveRegistrationStatus)();
        if (!workspaceRegistered) {
            return false;
        }
        if (!userId) {
            return false;
        }
        const user = yield models_1.Users.findOneById(userId);
        if ((_b = (_a = user === null || user === void 0 ? void 0 : user.services) === null || _a === void 0 ? void 0 : _a.cloud) === null || _b === void 0 ? void 0 : _b.accessToken) {
            return true;
        }
        return false;
    });
}
