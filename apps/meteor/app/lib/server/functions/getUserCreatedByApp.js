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
exports.getUserCreatedByApp = getUserCreatedByApp;
const models_1 = require("@rocket.chat/models");
function getUserCreatedByApp(appId, type, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const users = yield models_1.Users.find({ appId, type }, options).toArray();
        return users !== null && users !== void 0 ? users : [];
    });
}
