"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const restrictions_1 = require("../../../../../app/utils/lib/restrictions");
describe('fileUploadIsValidContentTypeFromSettings', () => {
    it('should return true if type is not defined and whiteList is not defined', () => {
        (0, chai_1.expect)((0, restrictions_1.fileUploadIsValidContentTypeFromSettings)(undefined, '', '')).to.be.true;
    });
    it('should return false if type is not defined and whiteList is defined', () => {
        (0, chai_1.expect)((0, restrictions_1.fileUploadIsValidContentTypeFromSettings)(undefined, 'image/jpeg', '')).to.be.false;
    });
    it('should return true if type is defined and whiteList is not defined', () => {
        (0, chai_1.expect)((0, restrictions_1.fileUploadIsValidContentTypeFromSettings)('image/jpeg', '', '')).to.be.true;
    });
    it('should return true if type is defined and whiteList is defined and type is in whiteList', () => {
        (0, chai_1.expect)((0, restrictions_1.fileUploadIsValidContentTypeFromSettings)('image/jpeg', 'image/jpeg', '')).to.be.true;
    });
    it('should return false if type is defined and whiteList is defined and type is not in whiteList', () => {
        (0, chai_1.expect)((0, restrictions_1.fileUploadIsValidContentTypeFromSettings)('image/png', 'image/jpeg', '')).to.be.false;
    });
    it('should return false if type is defined and whiteList is not defined and type is in blackList', () => {
        (0, chai_1.expect)((0, restrictions_1.fileUploadIsValidContentTypeFromSettings)('image/jpeg', '', 'image/jpeg')).to.be.false;
    });
    it('should return true if type is defined and whiteList is not defined and type is not in blackList', () => {
        (0, chai_1.expect)((0, restrictions_1.fileUploadIsValidContentTypeFromSettings)('image/png', '', 'image/jpeg')).to.be.true;
    });
    it('should return true if type is defined and whiteList is defined and type is in whiteList with wildcard', () => {
        (0, chai_1.expect)((0, restrictions_1.fileUploadIsValidContentTypeFromSettings)('image/jpeg', 'image/*', '')).to.be.true;
    });
    it('should return false if type is defined and whiteList is defined and type is not in whiteList with wildcard', () => {
        (0, chai_1.expect)((0, restrictions_1.fileUploadIsValidContentTypeFromSettings)('text/plain', 'image/*', '')).to.be.false;
    });
    it('should return false if type is defined and whiteList is not defined and type is in blackList with wildcard', () => {
        (0, chai_1.expect)((0, restrictions_1.fileUploadIsValidContentTypeFromSettings)('image/jpeg', '', 'image/*')).to.be.false;
    });
    it('should return true if type is defined and whiteList is defined and type is not in blackList with wildcard', () => {
        (0, chai_1.expect)((0, restrictions_1.fileUploadIsValidContentTypeFromSettings)('text/plain', '', 'image/*')).to.be.true;
    });
});
