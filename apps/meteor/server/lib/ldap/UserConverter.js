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
exports.LDAPUserConverter = void 0;
const models_1 = require("@rocket.chat/models");
const UserConverter_1 = require("../../../app/importer/server/classes/converters/UserConverter");
const server_1 = require("../../../app/settings/server");
class LDAPUserConverter extends UserConverter_1.UserConverter {
    constructor(options, logger, cache) {
        var _a;
        const ldapOptions = Object.assign({ workInMemory: true }, (options || {}));
        super(ldapOptions, logger, cache);
        this.mergeExistingUsers = (_a = server_1.settings.get('LDAP_Merge_Existing_Users')) !== null && _a !== void 0 ? _a : true;
    }
    findExistingUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if ((_b = (_a = data.services) === null || _a === void 0 ? void 0 : _a.ldap) === null || _b === void 0 ? void 0 : _b.id) {
                const importedUser = yield models_1.Users.findOneByLDAPId(data.services.ldap.id, data.services.ldap.idAttribute);
                if (importedUser) {
                    return importedUser;
                }
            }
            if (!this.mergeExistingUsers) {
                return;
            }
            if (data.emails.length) {
                const emailUser = yield models_1.Users.findOneWithoutLDAPByEmailAddress(data.emails[0], {});
                if (emailUser) {
                    return emailUser;
                }
            }
            if (data.username) {
                return models_1.Users.findOneWithoutLDAPByUsernameIgnoringCase(data.username);
            }
        });
    }
    static convertSingleUser(userData, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const converter = new LDAPUserConverter(options);
            yield converter.addObject(userData);
            yield converter.convertData();
        });
    }
}
exports.LDAPUserConverter = LDAPUserConverter;
