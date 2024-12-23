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
exports.getContacts = getContacts;
const models_1 = require("@rocket.chat/models");
function getContacts(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const { searchText, count, offset, sort, unknown } = params;
        const { cursor, totalCount } = models_1.LivechatContacts.findPaginatedContacts({ searchText, unknown }, {
            limit: count,
            skip: offset,
            sort: sort !== null && sort !== void 0 ? sort : { name: 1 },
        });
        const [rawContacts, total] = yield Promise.all([cursor.toArray(), totalCount]);
        const managerIds = [...new Set(rawContacts.map(({ contactManager }) => contactManager))];
        const managersCursor = models_1.Users.findByIds(managerIds, {
            projection: { name: 1, username: 1 },
        }).map((manager) => [manager._id, manager]);
        const managersData = yield managersCursor.toArray();
        const mappedManagers = Object.fromEntries(managersData);
        const contacts = rawContacts.map((contact) => {
            const { contactManager } = contact, data = __rest(contact, ["contactManager"]);
            return Object.assign(Object.assign({}, data), (contactManager ? { contactManager: mappedManagers[contactManager] } : {}));
        });
        return {
            contacts,
            count,
            offset,
            total,
        };
    });
}
