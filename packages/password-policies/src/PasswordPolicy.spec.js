"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PasswordPolicy_1 = require("./PasswordPolicy");
describe('Password tests with default options', () => {
    it('should allow all passwords', () => {
        const passwordPolicy = new PasswordPolicy_1.PasswordPolicy({ throwError: false });
        expect(passwordPolicy.validate(null)).toBe(false);
        expect(passwordPolicy.validate(undefined)).toBe(false);
        expect(passwordPolicy.validate('')).toBe(false);
        expect(passwordPolicy.validate('            ')).toBe(false);
        expect(passwordPolicy.validate('a')).toBe(true);
        expect(passwordPolicy.validate('aaaaaaaaa')).toBe(true);
    });
});
describe('Password tests with options', () => {
    it('should not allow non string or empty', () => {
        const passwordPolicy = new PasswordPolicy_1.PasswordPolicy({
            enabled: true,
            throwError: false,
        });
        expect(passwordPolicy.validate(null)).toBe(false);
        expect(passwordPolicy.validate(undefined)).toBe(false);
        expect(passwordPolicy.validate(1)).toBe(false);
        expect(passwordPolicy.validate(true)).toBe(false);
        expect(passwordPolicy.validate(new Date())).toBe(false);
        expect(passwordPolicy.validate(new Function())).toBe(false);
        expect(passwordPolicy.validate('')).toBe(false);
    });
    it('should restrict by minLength', () => {
        const passwordPolicy = new PasswordPolicy_1.PasswordPolicy({
            enabled: true,
            minLength: 5,
            throwError: false,
        });
        expect(passwordPolicy.validate('1')).toBe(false);
        expect(passwordPolicy.validate('1234')).toBe(false);
        expect(passwordPolicy.validate('12345')).toBe(true);
        expect(passwordPolicy.validate('     ')).toBe(false);
    });
    it('should restrict by maxLength', () => {
        const passwordPolicy = new PasswordPolicy_1.PasswordPolicy({
            enabled: true,
            maxLength: 5,
            throwError: false,
        });
        expect(passwordPolicy.validate('1')).toBe(true);
        expect(passwordPolicy.validate('12345')).toBe(true);
        expect(passwordPolicy.validate('123456')).toBe(false);
        expect(passwordPolicy.validate('      ')).toBe(false);
    });
    it('should allow repeated characters', () => {
        const passwordPolicy = new PasswordPolicy_1.PasswordPolicy({
            enabled: true,
            forbidRepeatingCharacters: false,
            throwError: false,
        });
        expect(passwordPolicy.validate('1')).toBe(true);
        expect(passwordPolicy.validate('12345')).toBe(true);
        expect(passwordPolicy.validate('123456')).toBe(true);
        expect(passwordPolicy.validate('      ')).toBe(false);
        expect(passwordPolicy.validate('11111111111111')).toBe(true);
    });
    it('should restrict repeated characters', () => {
        const passwordPolicy = new PasswordPolicy_1.PasswordPolicy({
            enabled: true,
            forbidRepeatingCharacters: true,
            forbidRepeatingCharactersCount: 3,
            throwError: false,
        });
        expect(passwordPolicy.validate('1')).toBe(true);
        expect(passwordPolicy.validate('11')).toBe(true);
        expect(passwordPolicy.validate('111')).toBe(true);
        expect(passwordPolicy.validate('1111')).toBe(false);
        expect(passwordPolicy.validate('     ')).toBe(false);
        expect(passwordPolicy.validate('123456')).toBe(true);
    });
    it('should restrict repeated characters customized', () => {
        const passwordPolicy = new PasswordPolicy_1.PasswordPolicy({
            enabled: true,
            forbidRepeatingCharacters: true,
            forbidRepeatingCharactersCount: 5,
            throwError: false,
        });
        expect(passwordPolicy.validate('1')).toBe(true);
        expect(passwordPolicy.validate('11')).toBe(true);
        expect(passwordPolicy.validate('111')).toBe(true);
        expect(passwordPolicy.validate('1111')).toBe(true);
        expect(passwordPolicy.validate('11111')).toBe(true);
        expect(passwordPolicy.validate('111111')).toBe(false);
        expect(passwordPolicy.validate('      ')).toBe(false);
        expect(passwordPolicy.validate('123456')).toBe(true);
    });
    it('should contain one lowercase', () => {
        const passwordPolicy = new PasswordPolicy_1.PasswordPolicy({
            enabled: true,
            mustContainAtLeastOneLowercase: true,
            throwError: false,
        });
        expect(passwordPolicy.validate('a')).toBe(true);
        expect(passwordPolicy.validate('aa')).toBe(true);
        expect(passwordPolicy.validate('A')).toBe(false);
        expect(passwordPolicy.validate('   ')).toBe(false);
        expect(passwordPolicy.validate('123456')).toBe(false);
        expect(passwordPolicy.validate('AAAAA')).toBe(false);
        expect(passwordPolicy.validate('AAAaAAA')).toBe(true);
    });
    it('should contain one uppercase', () => {
        const passwordPolicy = new PasswordPolicy_1.PasswordPolicy({
            enabled: true,
            mustContainAtLeastOneUppercase: true,
            throwError: false,
        });
        expect(passwordPolicy.validate('a')).toBe(false);
        expect(passwordPolicy.validate('aa')).toBe(false);
        expect(passwordPolicy.validate('A')).toBe(true);
        expect(passwordPolicy.validate('   ')).toBe(false);
        expect(passwordPolicy.validate('123456')).toBe(false);
        expect(passwordPolicy.validate('AAAAA')).toBe(true);
        expect(passwordPolicy.validate('AAAaAAA')).toBe(true);
    });
    it('should contain one number', () => {
        const passwordPolicy = new PasswordPolicy_1.PasswordPolicy({
            enabled: true,
            mustContainAtLeastOneNumber: true,
            throwError: false,
        });
        expect(passwordPolicy.validate('a')).toBe(false);
        expect(passwordPolicy.validate('aa')).toBe(false);
        expect(passwordPolicy.validate('A')).toBe(false);
        expect(passwordPolicy.validate('   ')).toBe(false);
        expect(passwordPolicy.validate('123456')).toBe(true);
        expect(passwordPolicy.validate('AAAAA')).toBe(false);
        expect(passwordPolicy.validate('AAAaAAA')).toBe(false);
        expect(passwordPolicy.validate('AAAa1AAA')).toBe(true);
    });
    it('should contain one special character', () => {
        const passwordPolicy = new PasswordPolicy_1.PasswordPolicy({
            enabled: true,
            mustContainAtLeastOneSpecialCharacter: true,
            throwError: false,
        });
        expect(passwordPolicy.validate('a')).toBe(false);
        expect(passwordPolicy.validate('aa')).toBe(false);
        expect(passwordPolicy.validate('A')).toBe(false);
        expect(passwordPolicy.validate('   ')).toBe(false);
        expect(passwordPolicy.validate('123456')).toBe(false);
        expect(passwordPolicy.validate('AAAAA')).toBe(false);
        expect(passwordPolicy.validate('AAAaAAA')).toBe(false);
        expect(passwordPolicy.validate('AAAa1AAA')).toBe(false);
        expect(passwordPolicy.validate('AAAa@AAA')).toBe(true);
    });
});
describe('Password Policy', () => {
    it('should return a correct password policy', () => {
        var _a;
        const passwordPolicy = new PasswordPolicy_1.PasswordPolicy({
            enabled: true,
            throwError: false,
            minLength: 10,
            maxLength: 20,
            forbidRepeatingCharacters: true,
            forbidRepeatingCharactersCount: 4,
            mustContainAtLeastOneLowercase: true,
            mustContainAtLeastOneUppercase: true,
            mustContainAtLeastOneNumber: true,
            mustContainAtLeastOneSpecialCharacter: true,
        });
        const policy = passwordPolicy.getPasswordPolicy();
        expect(policy).not.toBe(undefined);
        expect(policy.enabled).toBe(true);
        expect(policy.policy.length).toBe(8);
        expect(policy.policy[0][0]).toBe('get-password-policy-minLength');
        expect((_a = policy.policy[0][1]) === null || _a === void 0 ? void 0 : _a.minLength).toBe(10);
    });
    it('should return correct values if policy is disabled', () => {
        const passwordPolicy = new PasswordPolicy_1.PasswordPolicy({
            enabled: false,
        });
        const policy = passwordPolicy.getPasswordPolicy();
        expect(policy.enabled).toBe(false);
        expect(policy.policy.length).toBe(0);
    });
    it('should return correct values if policy is enabled but no specifiers exists', () => {
        const passwordPolicy = new PasswordPolicy_1.PasswordPolicy({
            enabled: true,
        });
        const policy = passwordPolicy.getPasswordPolicy();
        expect(policy.enabled).toBe(true);
        // even when no policy is specified, forbidRepeatingCharactersCount is still configured
        // since its default value is 3
        expect(policy.policy.length).toBe(1);
    });
});
