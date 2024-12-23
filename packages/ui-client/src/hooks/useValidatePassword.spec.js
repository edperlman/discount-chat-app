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
const mock_providers_1 = require("@rocket.chat/mock-providers");
const react_1 = require("@testing-library/react");
const useValidatePassword_1 = require("./useValidatePassword");
const settingsMockWrapper = (0, mock_providers_1.mockAppRoot)()
    .withSetting('Accounts_Password_Policy_Enabled', 'true')
    .withSetting('Accounts_Password_Policy_MinLength', '6')
    .withSetting('Accounts_Password_Policy_MaxLength', '24')
    .withSetting('Accounts_Password_Policy_ForbidRepeatingCharacters', 'true')
    .withSetting('Accounts_Password_Policy_ForbidRepeatingCharactersCount', '3')
    .withSetting('Accounts_Password_Policy_AtLeastOneLowercase', 'true')
    .withSetting('Accounts_Password_Policy_AtLeastOneUppercase', 'true')
    .withSetting('Accounts_Password_Policy_AtLeastOneNumber', 'true')
    .withSetting('Accounts_Password_Policy_AtLeastOneSpecialCharacter', 'true')
    .build();
it("should return `false` if password doesn't match all the requirements", () => __awaiter(void 0, void 0, void 0, function* () {
    const { result } = (0, react_1.renderHook)(() => __awaiter(void 0, void 0, void 0, function* () { return (0, useValidatePassword_1.useValidatePassword)('secret'); }), {
        legacyRoot: true,
        wrapper: settingsMockWrapper,
    });
    const res = yield result.current;
    expect(res).toBeFalsy();
}));
it('should return `true` if password matches all the requirements', () => __awaiter(void 0, void 0, void 0, function* () {
    const { result } = (0, react_1.renderHook)(() => __awaiter(void 0, void 0, void 0, function* () { return (0, useValidatePassword_1.useValidatePassword)('5kgnGPq^&t4DSYW!SH#4N'); }), {
        legacyRoot: true,
        wrapper: settingsMockWrapper,
    });
    const res = yield result.current;
    expect(res).toBeTruthy();
}));
