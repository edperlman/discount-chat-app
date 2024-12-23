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
exports.userLoggedOut = userLoggedOut;
const models_1 = require("@rocket.chat/models");
function userLoggedOut(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (!userId) {
            return false;
        }
        const user = yield models_1.Users.findOneById(userId);
        if ((_a = user === null || user === void 0 ? void 0 : user.services) === null || _a === void 0 ? void 0 : _a.cloud) {
            yield models_1.Users.updateOne({ _id: user._id }, {
                $unset: {
                    'services.cloud': 1,
                },
            });
        }
        return true;
    });
}
