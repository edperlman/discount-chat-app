"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const proxyquire_1 = __importDefault(require("proxyquire"));
const { _disableAppsWithAddonsCallback } = proxyquire_1.default
    .noCallThru()
    .load('../../../../../../ee/server/lib/apps/disableAppsWithAddonsCallback', {
    '../../apps': {},
    '../../../../server/lib/sendMessagesToAdmins': { sendMessagesToAdmins: () => undefined },
    '../../../../server/lib/i18n': {
        i18n: { t: () => undefined },
    },
});
/**
 * I've used named "empty" functions to spy on as it is easier to
 * troubleshoot if the assertion fails.
 * If we use `spy()` instead, there is no clear indication on the
 * error message which of the spy assertions failed
 */
describe('disableAppsWithAddonsCallback', () => {
    function sendMessagesToAdmins() {
        return undefined;
    }
    it('should not execute anything if not external module', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        function installedApps() {
            return [];
        }
        function getManagerDisable() {
            return undefined;
        }
        const mockManager = {
            disable: (0, chai_1.spy)(getManagerDisable),
        };
        const AppsMock = {
            installedApps: (0, chai_1.spy)(installedApps),
            getManager: () => mockManager,
        };
        yield _disableAppsWithAddonsCallback({ Apps: AppsMock, sendMessagesToAdmins }, { module: 'auditing', external: false, valid: true });
        (0, chai_1.expect)(AppsMock.installedApps).to.not.have.been.called();
        (0, chai_1.expect)((_a = AppsMock.getManager()) === null || _a === void 0 ? void 0 : _a.disable).to.not.have.been.called();
    }));
    it('should not execute anything if module is external and valid', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        function installedApps() {
            return [];
        }
        function getManagerDisable() {
            return undefined;
        }
        const mockManager = {
            disable: (0, chai_1.spy)(getManagerDisable),
        };
        const AppsMock = {
            installedApps: (0, chai_1.spy)(installedApps),
            getManager: () => mockManager,
        };
        yield _disableAppsWithAddonsCallback({ Apps: AppsMock, sendMessagesToAdmins }, { module: 'auditing', external: true, valid: true });
        (0, chai_1.expect)(AppsMock.installedApps).to.not.have.been.called();
        (0, chai_1.expect)((_a = AppsMock.getManager()) === null || _a === void 0 ? void 0 : _a.disable).to.not.have.been.called();
    }));
    it('should not throw if there are no apps installed that are enabled', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        function installedApps() {
            return [];
        }
        function getManagerDisable() {
            return undefined;
        }
        const mockManager = {
            disable: (0, chai_1.spy)(getManagerDisable),
        };
        const AppsMock = {
            installedApps: (0, chai_1.spy)(installedApps),
            getManager: () => mockManager,
        };
        yield (0, chai_1.expect)(_disableAppsWithAddonsCallback({ Apps: AppsMock, sendMessagesToAdmins }, { module: 'auditing', external: true, valid: false })).to.not.eventually.be.rejected;
        (0, chai_1.expect)(AppsMock.installedApps).to.have.been.called();
        (0, chai_1.expect)((_a = AppsMock.getManager()) === null || _a === void 0 ? void 0 : _a.disable).to.not.have.been.called();
    }));
    it('should only disable apps that require addons', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        function installedApps() {
            return [
                {
                    getInfo: () => ({}),
                    getName: () => 'Test App Without Addon',
                    getID() {
                        return 'test-app-without-addon';
                    },
                },
                {
                    getInfo: () => ({ addon: 'chat.rocket.test-addon' }),
                    getName: () => 'Test App WITH Addon',
                    getID() {
                        return 'test-app-with-addon';
                    },
                },
            ];
        }
        function getManagerDisable() {
            return undefined;
        }
        const mockManager = {
            disable: (0, chai_1.spy)(getManagerDisable),
        };
        const AppsMock = {
            installedApps: (0, chai_1.spy)(installedApps),
            getManager: () => mockManager,
        };
        yield (0, chai_1.expect)(_disableAppsWithAddonsCallback({ Apps: AppsMock, sendMessagesToAdmins }, { module: 'chat.rocket.test-addon', external: true, valid: false })).to.not.eventually.be.rejected;
        (0, chai_1.expect)(AppsMock.installedApps).to.have.been.called();
        (0, chai_1.expect)((_a = AppsMock.getManager()) === null || _a === void 0 ? void 0 : _a.disable).to.have.been.called.once;
        (0, chai_1.expect)((_b = AppsMock.getManager()) === null || _b === void 0 ? void 0 : _b.disable).to.have.been.called.with('test-app-with-addon');
    }));
    it('should not send messages to admins if no app was disabled', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        function installedApps() {
            return [
                {
                    getInfo: () => ({}),
                    getName: () => 'Test App Without Addon',
                    getID() {
                        return 'test-app-without-addon';
                    },
                },
            ];
        }
        function getManagerDisable() {
            return undefined;
        }
        const mockManager = {
            disable: (0, chai_1.spy)(getManagerDisable),
        };
        const AppsMock = {
            installedApps: (0, chai_1.spy)(installedApps),
            getManager: () => mockManager,
        };
        const sendMessagesToAdminsSpy = (0, chai_1.spy)(sendMessagesToAdmins);
        yield (0, chai_1.expect)(_disableAppsWithAddonsCallback({ Apps: AppsMock, sendMessagesToAdmins: sendMessagesToAdminsSpy }, { module: 'chat.rocket.test-addon', external: true, valid: false })).to.not.eventually.be.rejected;
        (0, chai_1.expect)(AppsMock.installedApps).to.have.been.called();
        (0, chai_1.expect)((_a = AppsMock.getManager()) === null || _a === void 0 ? void 0 : _a.disable).to.not.have.been.called();
        (0, chai_1.expect)(sendMessagesToAdminsSpy).to.not.have.been.called();
    }));
    it('should send messages to admins if some app has been disabled', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        function installedApps() {
            return [
                {
                    getInfo: () => ({}),
                    getName: () => 'Test App Without Addon',
                    getID() {
                        return 'test-app-without-addon';
                    },
                },
                {
                    getInfo: () => ({ addon: 'chat.rocket.test-addon' }),
                    getName: () => 'Test App WITH Addon',
                    getID() {
                        return 'test-app-with-addon';
                    },
                },
            ];
        }
        function getManagerDisable() {
            return undefined;
        }
        const mockManager = {
            disable: (0, chai_1.spy)(getManagerDisable),
        };
        const AppsMock = {
            installedApps: (0, chai_1.spy)(installedApps),
            getManager: () => mockManager,
        };
        const sendMessagesToAdminsSpy = (0, chai_1.spy)(sendMessagesToAdmins);
        yield (0, chai_1.expect)(_disableAppsWithAddonsCallback({ Apps: AppsMock, sendMessagesToAdmins: sendMessagesToAdminsSpy }, { module: 'chat.rocket.test-addon', external: true, valid: false })).to.not.eventually.be.rejected;
        (0, chai_1.expect)(AppsMock.installedApps).to.have.been.called();
        (0, chai_1.expect)((_a = AppsMock.getManager()) === null || _a === void 0 ? void 0 : _a.disable).to.have.been.called.once;
        (0, chai_1.expect)(sendMessagesToAdminsSpy).to.have.been.called();
    }));
});
