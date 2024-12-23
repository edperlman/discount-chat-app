"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_services_1 = require("@rocket.chat/core-services");
const chai_1 = require("chai");
describe('MeteorError', () => {
    it('should create an error with no reason like Meteor.Error', () => {
        const error = new core_services_1.MeteorError('no reason');
        const stringfiedError = { isClientSafe: true, errorType: 'Meteor.Error', error: 'no reason', message: '[no reason]' };
        (0, chai_1.expect)(error.error).to.equal('no reason');
        (0, chai_1.expect)(error.reason).to.be.undefined;
        (0, chai_1.expect)(error.message).to.equal('[no reason]');
        (0, chai_1.expect)(error.details).to.be.undefined;
        (0, chai_1.expect)(error.isClientSafe).to.be.true;
        (0, chai_1.expect)(error.errorType).to.equal('Meteor.Error');
        (0, chai_1.expect)(JSON.parse(JSON.stringify(error))).to.deep.equal(stringfiedError);
    });
    it('should create an error with reason like Meteor.Error', () => {
        const error = new core_services_1.MeteorError('some message', 'some reason');
        const stringfiedError = {
            isClientSafe: true,
            errorType: 'Meteor.Error',
            error: 'some message',
            message: 'some reason [some message]',
            reason: 'some reason',
        };
        (0, chai_1.expect)(error.error).to.equal('some message');
        (0, chai_1.expect)(error.reason).to.equal('some reason');
        (0, chai_1.expect)(error.message).to.equal('some reason [some message]');
        (0, chai_1.expect)(error.details).to.be.undefined;
        (0, chai_1.expect)(error.isClientSafe).to.be.true;
        (0, chai_1.expect)(error.errorType).to.equal('Meteor.Error');
        (0, chai_1.expect)(JSON.parse(JSON.stringify(error))).to.deep.equal(stringfiedError);
    });
    it('should create an error with reason and details like Meteor.Error', () => {
        const error = new core_services_1.MeteorError('some message', 'some reason', { some: 'details' });
        const stringfiedError = {
            isClientSafe: true,
            errorType: 'Meteor.Error',
            error: 'some message',
            message: 'some reason [some message]',
            reason: 'some reason',
            details: { some: 'details' },
        };
        (0, chai_1.expect)(error.error).to.equal('some message');
        (0, chai_1.expect)(error.reason).to.equal('some reason');
        (0, chai_1.expect)(error.message).to.equal('some reason [some message]');
        (0, chai_1.expect)(error.details).to.be.deep.equal({ some: 'details' });
        (0, chai_1.expect)(error.isClientSafe).to.be.true;
        (0, chai_1.expect)(error.errorType).to.equal('Meteor.Error');
        (0, chai_1.expect)(JSON.parse(JSON.stringify(error))).to.deep.equal(stringfiedError);
    });
});
