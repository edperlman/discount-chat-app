"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const proxyquire_1 = __importDefault(require("proxyquire"));
const sinon_1 = __importDefault(require("sinon"));
const isFederationReady = sinon_1.default.stub();
const isFederationEnabled = sinon_1.default.stub();
const { FederationActions } = proxyquire_1.default
    .noCallThru()
    .load('../../../../../../server/services/messages/hooks/BeforeFederationActions', {
    '../../federation/utils': {
        isFederationEnabled,
        isFederationReady,
    },
});
describe("Don't perform action depending on federation status", () => {
    afterEach(() => {
        isFederationReady.reset();
        isFederationEnabled.reset();
    });
    it('should return true if neither message nor room is federated', () => {
        (0, chai_1.expect)(FederationActions.shouldPerformAction({}, {})).to.be.true;
    });
    describe('Federation is enabled', () => {
        it('should return true if message is federated and configuration is valid', () => {
            isFederationEnabled.returns(true);
            isFederationReady.returns(true);
            (0, chai_1.expect)(FederationActions.shouldPerformAction({ federation: { eventId: Date.now().toString() } }, {}))
                .to.be.true;
        });
        it('should return true if room is federated and configuration is valid', () => {
            isFederationEnabled.returns(true);
            isFederationReady.returns(true);
            (0, chai_1.expect)(FederationActions.shouldPerformAction({}, { federated: true })).to.be.true;
        });
        it('should return false if message is federated and configuration is invalid', () => {
            isFederationEnabled.returns(true);
            isFederationReady.returns(false);
            (0, chai_1.expect)(FederationActions.shouldPerformAction({ federation: { eventId: Date.now().toString() } }, {}))
                .to.be.false;
        });
        it('should return false if room is federated and configuration is invalid', () => {
            isFederationEnabled.returns(true);
            isFederationReady.returns(false);
            (0, chai_1.expect)(FederationActions.shouldPerformAction({}, { federated: true })).to.be.false;
        });
    });
    describe('Federation is disabled', () => {
        it('should return false if room is federated', () => {
            isFederationEnabled.returns(false);
            isFederationReady.returns(false);
            (0, chai_1.expect)(FederationActions.shouldPerformAction({}, { federated: true })).to.be.false;
        });
        it('should return false if message is federated', () => {
            isFederationEnabled.returns(false);
            isFederationReady.returns(false);
            (0, chai_1.expect)(FederationActions.shouldPerformAction({ federation: { eventId: Date.now().toString() } }, {}))
                .to.be.false;
        });
    });
});
