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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUsernameSuggestion = generateUsernameSuggestion;
const models_1 = require("@rocket.chat/models");
const limax_1 = __importDefault(require("limax"));
const server_1 = require("../../../settings/server");
function slug(text) {
    return (0, limax_1.default)(text, { replacement: '.' }).replace(/[^0-9a-z-_.]/g, '');
}
function usernameIsAvailable(username) {
    return __awaiter(this, void 0, void 0, function* () {
        if (username.length === 0) {
            return false;
        }
        if (username === 'all') {
            return false;
        }
        return !(yield models_1.Users.findOneByUsernameIgnoringCase(username, {}));
    });
}
const name = (username) => (server_1.settings.get('UTF8_Names_Slugify') ? slug(username) : username);
function generateUsernameSuggestion(user) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        let usernames = [];
        if (user.name) {
            usernames.push(name(user.name));
            const nameParts = user.name.split(' ');
            if (nameParts.length > 1) {
                const [first] = nameParts;
                const last = nameParts[nameParts.length - 1];
                usernames.push(name(first[0] + last));
                usernames.push(name(first + last[0]));
            }
        }
        if (user === null || user === void 0 ? void 0 : user.name) {
            usernames.push(name(user.name));
        }
        if (Array.isArray(user.services)) {
            const services = [
                ...new Set(user.services.flatMap(({ name, username, firstName, lastName }) => [name, username, firstName, lastName])),
            ];
            usernames.push(...services.map(name));
        }
        if (user.emails && user.emails.length > 0) {
            for (const email of user.emails) {
                if (email.address && email.verified === true) {
                    usernames.push(slug(email.address.replace(/@.+$/, '')));
                    usernames.push(slug(email.address.replace(/(.+)@(\w+).+/, '$1.$2')));
                }
            }
        }
        usernames = usernames.filter((e) => e);
        try {
            for (var _d = true, usernames_1 = __asyncValues(usernames), usernames_1_1; usernames_1_1 = yield usernames_1.next(), _a = usernames_1_1.done, !_a; _d = true) {
                _c = usernames_1_1.value;
                _d = false;
                const item = _c;
                if (yield usernameIsAvailable(item)) {
                    return item;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = usernames_1.return)) yield _b.call(usernames_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        usernames.push(server_1.settings.get('Accounts_DefaultUsernamePrefixSuggestion'));
        let index = yield models_1.Users.col.countDocuments({ username: new RegExp(`^${usernames[0]}-[0-9]+`) });
        const username = '';
        while (!username) {
            // eslint-disable-next-line no-await-in-loop
            if (yield usernameIsAvailable(`${usernames[0]}-${index}`)) {
                return `${usernames[0]}-${index}`;
            }
            index++;
        }
    });
}
