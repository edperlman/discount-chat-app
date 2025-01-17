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
exports.getStatusText = void 0;
const models_1 = require("@rocket.chat/models");
const getStatusText = function (userId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!userId) {
            return;
        }
        const projection = {
            statusText: 1,
        };
        const options = {
            projection,
            limit: 1,
        };
        const data = yield models_1.Users.findOneById(userId, options);
        return data === null || data === void 0 ? void 0 : data.statusText;
    });
};
exports.getStatusText = getStatusText;
