"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const proxyquire_1 = __importDefault(require("proxyquire"));
const settings = {
    enabled: false,
    ready: false,
    get(id) {
        switch (id) {
            case 'Federation_Matrix_enabled':
                return this.enabled;
            case 'Federation_Matrix_configuration_status':
                return this.ready ? 'Valid' : 'Invalid';
        }
    },
    reset() {
        this.enabled = false;
        this.ready = false;
    },
};
const { throwIfFederationNotEnabledOrNotReady, throwIfFederationNotReady, throwIfFederationEnabledButNotReady } = proxyquire_1.default
    .noCallThru()
    .load('../../../../server/services/federation/utils', {
    '../../../app/settings/server': {
        settings,
    },
});
describe('Federation helper functions', () => {
    afterEach(() => {
        settings.reset();
    });
    describe('#throwIfFederationNotReady', () => {
        it('should throw if federation is not ready', () => {
            (0, chai_1.expect)(throwIfFederationNotReady).to.throw();
        });
    });
    describe('#throwIfFederationNotEnabledOrNotReady', () => {
        it('should throw if federation is not enabled', () => {
            (0, chai_1.expect)(throwIfFederationNotEnabledOrNotReady).to.throw();
        });
        it('should throw if federation is enabled but configuration is invalid', () => {
            settings.enabled = true;
            (0, chai_1.expect)(throwIfFederationNotEnabledOrNotReady).to.throw();
        });
        it('should not throw if both federation is enabled and configuration is valid', () => {
            settings.enabled = true;
            settings.ready = true;
            (0, chai_1.expect)(throwIfFederationNotEnabledOrNotReady).to.not.throw();
        });
    });
    describe('#throwIfFederationEnabledButNotReady', () => {
        it('should throw if federation is enabled and configuration is invalid', () => {
            settings.enabled = true;
            settings.ready = false;
            (0, chai_1.expect)(throwIfFederationEnabledButNotReady).to.throw();
        });
        it('should not throw if federation is disabled', () => {
            (0, chai_1.expect)(throwIfFederationEnabledButNotReady).to.not.throw();
            settings.ready = true;
            (0, chai_1.expect)(throwIfFederationEnabledButNotReady).to.not.throw();
        });
    });
});
