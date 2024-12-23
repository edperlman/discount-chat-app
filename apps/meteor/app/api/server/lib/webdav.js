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
exports.findWebdavAccountsByUserId = findWebdavAccountsByUserId;
const models_1 = require("@rocket.chat/models");
function findWebdavAccountsByUserId(_a) {
    return __awaiter(this, arguments, void 0, function* ({ uid }) {
        return models_1.WebdavAccounts.findWithUserId(uid, {
            projection: {
                _id: 1,
                username: 1,
                serverURL: 1,
                name: 1,
            },
        }).toArray();
    });
}
