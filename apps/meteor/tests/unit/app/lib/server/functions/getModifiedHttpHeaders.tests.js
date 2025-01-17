"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const getModifiedHttpHeaders_1 = require("../../../../../../app/lib/server/functions/getModifiedHttpHeaders");
describe('getModifiedHttpHeaders', () => {
    it('should redact x-auth-token if present', () => {
        const inputHeaders = {
            'x-auth-token': '12345',
            'some-other-header': 'value',
        };
        const result = (0, getModifiedHttpHeaders_1.getModifiedHttpHeaders)(inputHeaders);
        (0, chai_1.expect)(result['x-auth-token']).to.equal('[redacted]');
        (0, chai_1.expect)(result['some-other-header']).to.equal('value');
    });
    it('should not modify headers if x-auth-token is not present', () => {
        const inputHeaders = {
            'some-other-header': 'value',
        };
        const result = (0, getModifiedHttpHeaders_1.getModifiedHttpHeaders)(inputHeaders);
        (0, chai_1.expect)(result).to.deep.equal(inputHeaders);
    });
    it('should redact rc_token in cookies if present', () => {
        const inputHeaders = {
            cookie: 'session_id=abc123; rc_token=98765; other_cookie=value',
        };
        const expectedCookies = 'session_id=abc123; rc_token=[redacted]; other_cookie=value';
        const result = (0, getModifiedHttpHeaders_1.getModifiedHttpHeaders)(inputHeaders);
        (0, chai_1.expect)(result.cookie).to.equal(expectedCookies);
    });
    it('should not modify cookies if rc_token is not present', () => {
        const inputHeaders = {
            cookie: 'session_id=abc123; other_cookie=value',
        };
        const result = (0, getModifiedHttpHeaders_1.getModifiedHttpHeaders)(inputHeaders);
        (0, chai_1.expect)(result.cookie).to.equal(inputHeaders.cookie);
    });
    it('should return headers unchanged if neither x-auth-token nor cookie are present', () => {
        const inputHeaders = {
            'some-other-header': 'value',
        };
        const result = (0, getModifiedHttpHeaders_1.getModifiedHttpHeaders)(inputHeaders);
        (0, chai_1.expect)(result).to.deep.equal(inputHeaders);
    });
    it('should handle cases with both x-auth-token and rc_token in cookie', () => {
        const inputHeaders = {
            'x-auth-token': '12345',
            'cookie': 'session_id=abc123; rc_token=98765; other_cookie=value',
        };
        const expectedCookies = 'session_id=abc123; rc_token=[redacted]; other_cookie=value';
        const result = (0, getModifiedHttpHeaders_1.getModifiedHttpHeaders)(inputHeaders);
        (0, chai_1.expect)(result['x-auth-token']).to.equal('[redacted]');
        (0, chai_1.expect)(result.cookie).to.equal(expectedCookies);
    });
});
