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
exports.CredentialTokensRaw = void 0;
const BaseRaw_1 = require("./BaseRaw");
class CredentialTokensRaw extends BaseRaw_1.BaseRaw {
    constructor(db, trash) {
        super(db, 'credential_tokens', trash);
    }
    modelIndexes() {
        return [{ key: { expireAt: 1 }, sparse: true, expireAfterSeconds: 0 }];
    }
    create(_id, userInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const validForMilliseconds = 60000; // Valid for 60 seconds
            const token = {
                _id,
                userInfo,
                expireAt: new Date(Date.now() + validForMilliseconds),
            };
            yield this.insertOne(token);
            return token;
        });
    }
    findOneNotExpiredById(_id) {
        const query = {
            _id,
            expireAt: { $gt: new Date() },
        };
        return this.findOne(query);
    }
}
exports.CredentialTokensRaw = CredentialTokensRaw;
