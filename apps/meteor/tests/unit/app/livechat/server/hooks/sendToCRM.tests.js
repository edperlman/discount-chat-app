"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const proxyquire_1 = __importDefault(require("proxyquire"));
const resultObj = {
    result: true,
};
const { sendMessageType, isOmnichannelNavigationMessage, isOmnichannelClosingMessage, getAdditionalFieldsByType } = proxyquire_1.default
    .noCallThru()
    .load('../../../../../../app/livechat/server/hooks/sendToCRM', {
    '../../../settings/server': {
        settings: {
            get() {
                return resultObj.result;
            },
        },
    },
    '../../../utils/server/functions/normalizeMessageFileUpload': {
        normalizeMessageFileUpload: (data) => data,
    },
    '../lib/LivechatTyped': {
        Livechat: {},
    },
});
describe('[OC] Send TO CRM', () => {
    describe('isOmnichannelNavigationMessage', () => {
        it('should return true if the message is a navigation message', () => {
            const message = { t: 'livechat_navigation_history' };
            (0, chai_1.expect)(isOmnichannelNavigationMessage(message)).to.be.true;
        });
        it('should return false if the message is not a navigation message', () => {
            const message = { t: 'livechat-close' };
            (0, chai_1.expect)(isOmnichannelNavigationMessage(message)).to.be.false;
        });
    });
    describe('isOmnichannelClosingMessage', () => {
        it('should return true if the message is a closing message', () => {
            const message = { t: 'livechat-close' };
            (0, chai_1.expect)(isOmnichannelClosingMessage(message)).to.be.true;
        });
        it('should return false if the message is not a closing message', () => {
            const message = { t: 'livechat_navigation_history' };
            (0, chai_1.expect)(isOmnichannelClosingMessage(message)).to.be.false;
        });
    });
    describe('sendMessageType', () => {
        it('should return true if the message type is a closing message', () => {
            (0, chai_1.expect)(sendMessageType('livechat-close')).to.be.true;
        });
        it('should return true if the message type is a navigation message and the settings are enabled', () => {
            (0, chai_1.expect)(sendMessageType('livechat_navigation_history')).to.be.true;
        });
        it('should return false if the message type is a navigation message and the settings are disabled', () => {
            resultObj.result = false;
            (0, chai_1.expect)(sendMessageType('livechat_navigation_history')).to.be.false;
        });
        it('should return false if the message type is not a closing or navigation message', () => {
            (0, chai_1.expect)(sendMessageType('message')).to.be.false;
        });
    });
    describe('getAdditionalFieldsByType', () => {
        it('should return the correct fields for the LivechatSessionStart type', () => {
            const room = { departmentId: 'departmentId' };
            (0, chai_1.expect)(getAdditionalFieldsByType('LivechatSessionStart', room)).to.deep.equal({ departmentId: 'departmentId' });
        });
        it('should return the correct fields for the LivechatSessionQueued type', () => {
            const room = { departmentId: 'departmentId' };
            (0, chai_1.expect)(getAdditionalFieldsByType('LivechatSessionQueued', room)).to.deep.equal({ departmentId: 'departmentId' });
        });
        it('should return the correct fields for the LivechatSession type', () => {
            const room = {
                departmentId: 'departmentId',
                servedBy: 'servedBy',
                closedAt: 'closedAt',
                closedBy: 'closedBy',
                closer: 'closer',
            };
            (0, chai_1.expect)(getAdditionalFieldsByType('LivechatSession', room)).to.deep.equal({
                departmentId: 'departmentId',
                servedBy: 'servedBy',
                closedAt: 'closedAt',
                closedBy: 'closedBy',
                closer: 'closer',
            });
        });
        it('should return the correct fields for the LivechatSessionTaken type', () => {
            const room = { departmentId: 'departmentId', servedBy: 'servedBy' };
            (0, chai_1.expect)(getAdditionalFieldsByType('LivechatSessionTaken', room)).to.deep.equal({ departmentId: 'departmentId', servedBy: 'servedBy' });
        });
        it('should return the correct fields for the LivechatSessionForwarded type', () => {
            const room = {
                departmentId: 'departmentId',
                servedBy: 'servedBy',
                oldDepartmentId: 'oldDepartmentId',
                oldServedBy: 'oldServedBy',
            };
            (0, chai_1.expect)(getAdditionalFieldsByType('LivechatSessionForwarded', room)).to.deep.equal({
                departmentId: 'departmentId',
                servedBy: 'servedBy',
                oldDepartmentId: 'oldDepartmentId',
                oldServedBy: 'oldServedBy',
            });
        });
        it('should return an empty object for an unknown type', () => {
            const room = {};
            (0, chai_1.expect)(getAdditionalFieldsByType('unknownType', room)).to.deep.equal({});
        });
    });
});
