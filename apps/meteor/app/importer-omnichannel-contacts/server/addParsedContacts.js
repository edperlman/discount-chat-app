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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addParsedContacts = addParsedContacts;
const random_1 = require("@rocket.chat/random");
function addParsedContacts(parsedContacts) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, parsedContacts_1, parsedContacts_1_1;
        var _b, e_1, _c, _d;
        const columnNames = parsedContacts.shift();
        let addedContacts = 0;
        try {
            for (_a = true, parsedContacts_1 = __asyncValues(parsedContacts); parsedContacts_1_1 = yield parsedContacts_1.next(), _b = parsedContacts_1_1.done, !_b; _a = true) {
                _d = parsedContacts_1_1.value;
                _a = false;
                const parsedData = _d;
                const contactData = parsedData.reduce((acc, value, index) => {
                    const columnName = columnNames && index < columnNames.length ? columnNames[index] : `column${index}`;
                    return Object.assign(Object.assign({}, acc), { [columnName]: value });
                }, {});
                if (!contactData.emails && !contactData.phones && !contactData.name) {
                    continue;
                }
                const { emails = '', phones = '', name = '', manager: contactManager = undefined, id = random_1.Random.id() } = contactData, customFields = __rest(contactData, ["emails", "phones", "name", "manager", "id"]);
                yield this.addContact({
                    importIds: [id],
                    emails: emails.split(';'),
                    phones: phones.split(';'),
                    name,
                    contactManager,
                    customFields,
                });
                addedContacts++;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_a && !_b && (_c = parsedContacts_1.return)) yield _c.call(parsedContacts_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return addedContacts;
    });
}
