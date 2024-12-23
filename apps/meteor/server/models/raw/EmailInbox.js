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
exports.EmailInboxRaw = void 0;
const BaseRaw_1 = require("./BaseRaw");
class EmailInboxRaw extends BaseRaw_1.BaseRaw {
    constructor(db, trash) {
        super(db, 'email_inbox', trash);
    }
    modelIndexes() {
        return [{ key: { email: 1 }, unique: true }];
    }
    setDisabledById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.findOneAndUpdate({ _id: id, active: true }, { $set: { active: false } }, { returnDocument: 'after' });
        });
    }
    create(emailInbox) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.insertOne(emailInbox);
        });
    }
    updateById(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            // findOneAndUpdate doesn't accept generics, so we had to type cast
            return this.findOneAndUpdate({ _id: id }, data, { returnDocument: 'after', projection: { _id: 1 } });
        });
    }
    findActive() {
        return this.find({ active: true });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.findOne({ email });
        });
    }
}
exports.EmailInboxRaw = EmailInboxRaw;
