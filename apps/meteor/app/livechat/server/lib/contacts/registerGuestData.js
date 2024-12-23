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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerGuestData = registerGuestData;
const models_1 = require("@rocket.chat/models");
const tools_1 = require("@rocket.chat/tools");
const Helper_1 = require("../Helper");
const ContactMerger_1 = require("./ContactMerger");
function registerGuestData(_a, visitor_1) {
    return __awaiter(this, arguments, void 0, function* ({ name, phone, email, username }, visitor) {
        var _b, e_1, _c, _d;
        const validatedEmail = email &&
            (0, tools_1.wrapExceptions)(() => {
                const trimmedEmail = email.trim().toLowerCase();
                (0, Helper_1.validateEmail)(trimmedEmail);
                return trimmedEmail;
            }).suppress();
        const fields = [
            { type: 'name', value: name },
            { type: 'phone', value: phone === null || phone === void 0 ? void 0 : phone.number },
            { type: 'email', value: validatedEmail },
            { type: 'username', value: username || visitor.username },
        ].filter((field) => Boolean(field.value));
        if (!fields.length) {
            return;
        }
        // If a visitor was updated who already had contacts, load up the contacts and update that information as well
        const contacts = yield models_1.LivechatContacts.findAllByVisitorId(visitor._id).toArray();
        try {
            for (var _e = true, contacts_1 = __asyncValues(contacts), contacts_1_1; contacts_1_1 = yield contacts_1.next(), _b = contacts_1_1.done, !_b; _e = true) {
                _d = contacts_1_1.value;
                _e = false;
                const contact = _d;
                yield ContactMerger_1.ContactMerger.mergeFieldsIntoContact({
                    fields,
                    contact,
                    conflictHandlingMode: contact.unknown ? 'overwrite' : 'conflict',
                });
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_e && !_b && (_c = contacts_1.return)) yield _c.call(contacts_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    });
}
