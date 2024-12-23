"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const getMostImportantRole_1 = require("../../../../lib/roles/getMostImportantRole");
describe('getMostImportantRole', () => {
    it('should return the same role if only one exists', () => {
        (0, chai_1.expect)((0, getMostImportantRole_1.getMostImportantRole)(['admin'])).to.be.eq('admin');
        (0, chai_1.expect)((0, getMostImportantRole_1.getMostImportantRole)(['livechat-manager'])).to.be.eq('livechat-manager');
        (0, chai_1.expect)((0, getMostImportantRole_1.getMostImportantRole)(['livechat-monitor'])).to.be.eq('livechat-monitor');
        (0, chai_1.expect)((0, getMostImportantRole_1.getMostImportantRole)(['livechat-agent'])).to.be.eq('livechat-agent');
        (0, chai_1.expect)((0, getMostImportantRole_1.getMostImportantRole)(['user'])).to.be.eq('user');
        (0, chai_1.expect)((0, getMostImportantRole_1.getMostImportantRole)(['guest'])).to.be.eq('guest');
        (0, chai_1.expect)((0, getMostImportantRole_1.getMostImportantRole)(['anonymous'])).to.be.eq('anonymous');
        (0, chai_1.expect)((0, getMostImportantRole_1.getMostImportantRole)(['app'])).to.be.eq('app');
        (0, chai_1.expect)((0, getMostImportantRole_1.getMostImportantRole)(['bot'])).to.be.eq('bot');
    });
    it('should return custom roles as `custom-role`', () => {
        (0, chai_1.expect)((0, getMostImportantRole_1.getMostImportantRole)(['custom1'])).to.be.eq('custom-role');
    });
    it('should return auditor, app and bot as `user`', () => {
        (0, chai_1.expect)((0, getMostImportantRole_1.getMostImportantRole)(['auditor'])).to.be.eq('user');
        (0, chai_1.expect)((0, getMostImportantRole_1.getMostImportantRole)(['auditor-log'])).to.be.eq('user');
    });
    it('should return `no-role` if no one exists', () => {
        (0, chai_1.expect)((0, getMostImportantRole_1.getMostImportantRole)([])).to.be.eq('no-role');
        (0, chai_1.expect)((0, getMostImportantRole_1.getMostImportantRole)()).to.be.eq('no-role');
    });
    it('should return correct role', () => {
        (0, chai_1.expect)((0, getMostImportantRole_1.getMostImportantRole)(['user', 'admin'])).to.be.eq('admin');
        (0, chai_1.expect)((0, getMostImportantRole_1.getMostImportantRole)(['user', 'anonymous'])).to.be.eq('user');
        (0, chai_1.expect)((0, getMostImportantRole_1.getMostImportantRole)(['user', 'guest'])).to.be.eq('user');
        (0, chai_1.expect)((0, getMostImportantRole_1.getMostImportantRole)(['user', 'guest', 'livechat-monitor'])).to.be.eq('livechat-monitor');
        (0, chai_1.expect)((0, getMostImportantRole_1.getMostImportantRole)(['user', 'custom1'])).to.be.eq('custom-role');
        (0, chai_1.expect)((0, getMostImportantRole_1.getMostImportantRole)(['custom2', 'user', 'custom1'])).to.be.eq('custom-role');
        (0, chai_1.expect)((0, getMostImportantRole_1.getMostImportantRole)(['custom2', 'admin', 'custom1'])).to.be.eq('admin');
        (0, chai_1.expect)((0, getMostImportantRole_1.getMostImportantRole)(['custom2', 'app'])).to.be.eq('custom-role');
        (0, chai_1.expect)((0, getMostImportantRole_1.getMostImportantRole)(['anonymous', 'app'])).to.be.eq('app');
    });
});
