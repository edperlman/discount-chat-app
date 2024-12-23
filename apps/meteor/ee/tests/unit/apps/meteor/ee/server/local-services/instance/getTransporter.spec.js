"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const getTransporter_1 = require("../../../../../../../../server/local-services/instance/getTransporter");
describe('getTransporter', () => {
    it('should return TCP with port 0 by default', () => {
        (0, chai_1.expect)((0, getTransporter_1.getTransporter)()).to.deep.equal({ port: 0, udpDiscovery: false, useHostname: false });
    });
    it('should return TCP with port set via env var', () => {
        (0, chai_1.expect)((0, getTransporter_1.getTransporter)({ port: '1234' })).to.deep.equal({ port: '1234', udpDiscovery: false, useHostname: false });
        (0, chai_1.expect)((0, getTransporter_1.getTransporter)({ port: '   1234' })).to.deep.equal({ port: '1234', udpDiscovery: false, useHostname: false });
        (0, chai_1.expect)((0, getTransporter_1.getTransporter)({ port: '   1234   ' })).to.deep.equal({ port: '1234', udpDiscovery: false, useHostname: false });
    });
    it('should throw if transporter set incorrectly', () => {
        (0, chai_1.expect)(() => (0, getTransporter_1.getTransporter)({ transporter: 'something' })).to.throw('invalid transporter');
    });
    it('should return transporter if set correctly', () => {
        (0, chai_1.expect)((0, getTransporter_1.getTransporter)({ transporter: 'monolith+nats://address' })).to.equal('nats://address');
    });
});
