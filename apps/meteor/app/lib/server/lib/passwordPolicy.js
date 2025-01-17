"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordPolicy = void 0;
const password_policies_1 = require("@rocket.chat/password-policies");
const server_1 = require("../../../settings/server");
const enabled = false;
const minLength = -1;
const maxLength = -1;
const forbidRepeatingCharacters = false;
const forbidRepeatingCharactersCount = 3;
const mustContainAtLeastOneLowercase = false;
const mustContainAtLeastOneUppercase = false;
const mustContainAtLeastOneNumber = false;
const mustContainAtLeastOneSpecialCharacter = false;
exports.passwordPolicy = new password_policies_1.PasswordPolicy({
    enabled,
    minLength,
    maxLength,
    forbidRepeatingCharacters,
    forbidRepeatingCharactersCount,
    mustContainAtLeastOneLowercase,
    mustContainAtLeastOneUppercase,
    mustContainAtLeastOneNumber,
    mustContainAtLeastOneSpecialCharacter,
    throwError: true,
});
server_1.settings.watchMultiple([
    'Accounts_Password_Policy_Enabled',
    'Accounts_Password_Policy_MinLength',
    'Accounts_Password_Policy_MaxLength',
    'Accounts_Password_Policy_ForbidRepeatingCharacters',
    'Accounts_Password_Policy_ForbidRepeatingCharactersCount',
    'Accounts_Password_Policy_AtLeastOneLowercase',
    'Accounts_Password_Policy_AtLeastOneUppercase',
    'Accounts_Password_Policy_AtLeastOneNumber',
    'Accounts_Password_Policy_AtLeastOneSpecialCharacter',
], ([enabled, minLength, maxLength, forbidRepeatingCharacters, forbidRepeatingCharactersCount, mustContainAtLeastOneLowercase, mustContainAtLeastOneUppercase, mustContainAtLeastOneNumber, mustContainAtLeastOneSpecialCharacter,]) => {
    exports.passwordPolicy = new password_policies_1.PasswordPolicy({
        enabled: Boolean(enabled),
        minLength: Number(minLength),
        maxLength: Number(maxLength),
        forbidRepeatingCharacters: Boolean(forbidRepeatingCharacters),
        forbidRepeatingCharactersCount: Number(forbidRepeatingCharactersCount),
        mustContainAtLeastOneLowercase: Boolean(mustContainAtLeastOneLowercase),
        mustContainAtLeastOneUppercase: Boolean(mustContainAtLeastOneUppercase),
        mustContainAtLeastOneNumber: Boolean(mustContainAtLeastOneNumber),
        mustContainAtLeastOneSpecialCharacter: Boolean(mustContainAtLeastOneSpecialCharacter),
        throwError: true,
    });
});
