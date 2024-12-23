"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const proxyquire_1 = __importDefault(require("proxyquire"));
const { isVerifiedChannelInSource } = proxyquire_1.default.noCallThru().load('./isVerifiedChannelInSource', {});
describe('isVerifiedChannelInSource', () => {
    it('should return false if channel is not verified', () => {
        const channel = {
            verified: false,
        };
        const visitorId = 'visitor1';
        const source = {
            type: 'widget',
        };
        (0, chai_1.expect)(isVerifiedChannelInSource(channel, visitorId, source)).to.be.false;
    });
    it('should return false if channel visitorId is different from visitorId', () => {
        const channel = {
            verified: true,
            visitor: {
                visitorId: 'visitor2',
            },
        };
        const visitorId = 'visitor1';
        const source = {
            type: 'widget',
        };
        (0, chai_1.expect)(isVerifiedChannelInSource(channel, visitorId, source)).to.be.false;
    });
    it('should return false if channel visitor source type is different from source type', () => {
        const channel = {
            verified: true,
            visitor: {
                visitorId: 'visitor1',
                source: {
                    type: 'web',
                },
            },
        };
        const visitorId = 'visitor1';
        const source = {
            type: 'widget',
        };
        (0, chai_1.expect)(isVerifiedChannelInSource(channel, visitorId, source)).to.be.false;
    });
    it('should return false if channel visitor source id is different from source id', () => {
        const channel = {
            verified: true,
            visitor: {
                visitorId: 'visitor1',
                source: {
                    type: 'widget',
                    id: 'source1',
                },
            },
        };
        const visitorId = 'visitor1';
        const source = {
            type: 'widget',
            id: 'source2',
        };
        (0, chai_1.expect)(isVerifiedChannelInSource(channel, visitorId, source)).to.be.false;
    });
    it('should return false if source id is not defined and channel visitor source id is defined', () => {
        const channel = {
            verified: true,
            visitor: {
                visitorId: 'visitor1',
                source: {
                    type: 'widget',
                    id: 'source1',
                },
            },
        };
        const visitorId = 'visitor1';
        const source = {
            type: 'widget',
        };
        (0, chai_1.expect)(isVerifiedChannelInSource(channel, visitorId, source)).to.be.false;
    });
    it('should return true if all conditions are met', () => {
        const channel = {
            verified: true,
            visitor: {
                visitorId: 'visitor1',
                source: {
                    type: 'widget',
                    id: 'source1',
                },
            },
        };
        const visitorId = 'visitor1';
        const source = {
            type: 'widget',
            id: 'source1',
        };
        (0, chai_1.expect)(isVerifiedChannelInSource(channel, visitorId, source)).to.be.true;
    });
});
