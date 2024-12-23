"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const validateNameChars_1 = require("../../../../../../app/lib/server/functions/validateNameChars");
describe('validateNameChars', () => {
    it('should return false for undefined input', () => {
        (0, chai_1.expect)((0, validateNameChars_1.validateNameChars)(undefined)).to.be.false;
    });
    it('should return false for non-string input', () => {
        (0, chai_1.expect)((0, validateNameChars_1.validateNameChars)(123)).to.be.false;
        (0, chai_1.expect)((0, validateNameChars_1.validateNameChars)({})).to.be.false;
        (0, chai_1.expect)((0, validateNameChars_1.validateNameChars)([])).to.be.false;
    });
    it('should return false for names with invalid characters', () => {
        (0, chai_1.expect)((0, validateNameChars_1.validateNameChars)('name<')).to.be.false;
        (0, chai_1.expect)((0, validateNameChars_1.validateNameChars)('name>')).to.be.false;
        (0, chai_1.expect)((0, validateNameChars_1.validateNameChars)('name/')).to.be.false;
        (0, chai_1.expect)((0, validateNameChars_1.validateNameChars)('name\\')).to.be.false;
    });
    it('should return false for names with invalid characters after decoding', () => {
        (0, chai_1.expect)((0, validateNameChars_1.validateNameChars)('name%3E')).to.be.false;
        (0, chai_1.expect)((0, validateNameChars_1.validateNameChars)('name%5C')).to.be.false;
        (0, chai_1.expect)((0, validateNameChars_1.validateNameChars)('name%3C')).to.be.false;
    });
    it('should return false for malicious HTML payloads', () => {
        (0, chai_1.expect)((0, validateNameChars_1.validateNameChars)('<script>alert("XSS");</script>')).to.be.false;
        (0, chai_1.expect)((0, validateNameChars_1.validateNameChars)('%3Cscript%3Ealert%28%27XSS%27%29%3C%2Fscript%3E')).to.be.false;
        (0, chai_1.expect)((0, validateNameChars_1.validateNameChars)('<form action="http://malicious.site" method="post"><input type="text" name="username" value="Enter username"><input type="password" name="password" value="Enter password"><input type="submit" value="Submit"></form>')).to.be.false;
        (0, chai_1.expect)((0, validateNameChars_1.validateNameChars)('%3Cform%20action%3D%22http%3A%2F%2Fmalicious.site%22%20method%3D%22post%22%3E%3Cinput%20type%3D%22text%22%20name%3D%22username%22%20value%3D%22Enter%20username%22%3E%3Cinput%20type%3D%22password%22%20name%3D%22password%22%20value%3D%22Enter%20password%22%3E%3Cinput%20type%3D%22submit%22%20value%3D%22Submit%22%3E%3C%2Fform%3E')).to.be.false;
    });
    it('should return false if decodeURI throws an error', () => {
        (0, chai_1.expect)((0, validateNameChars_1.validateNameChars)('%')).to.be.false;
        (0, chai_1.expect)((0, validateNameChars_1.validateNameChars)('%E0%A4%A')).to.be.false;
    });
    it('should return true for valid names', () => {
        (0, chai_1.expect)((0, validateNameChars_1.validateNameChars)('name')).to.be.true;
        (0, chai_1.expect)((0, validateNameChars_1.validateNameChars)('valid_name')).to.be.true;
        (0, chai_1.expect)((0, validateNameChars_1.validateNameChars)('valid-name')).to.be.true;
        (0, chai_1.expect)((0, validateNameChars_1.validateNameChars)('valid.name')).to.be.true;
        (0, chai_1.expect)((0, validateNameChars_1.validateNameChars)('valid name')).to.be.true;
    });
});
