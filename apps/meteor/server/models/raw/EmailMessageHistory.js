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
exports.EmailMessageHistoryRaw = void 0;
const BaseRaw_1 = require("./BaseRaw");
class EmailMessageHistoryRaw extends BaseRaw_1.BaseRaw {
    constructor(db, trash) {
        super(db, 'email_message_history', trash);
    }
    modelIndexes() {
        return [{ key: { createdAt: 1 }, expireAfterSeconds: 60 * 60 * 24 }];
    }
    create(_a) {
        return __awaiter(this, arguments, void 0, function* ({ _id, email }) {
            return this.insertOne({
                _id,
                email,
                createdAt: new Date(),
            });
        });
    }
}
exports.EmailMessageHistoryRaw = EmailMessageHistoryRaw;
