"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AppStatus_1 = require("@rocket.chat/apps-engine/definition/AppStatus");
const storage_1 = require("@rocket.chat/apps-engine/server/storage");
const chai_1 = require("chai");
const canEnableApp_1 = require("../../../../../ee/app/license/server/canEnableApp");
const getDefaultApp = () => ({
    _id: '6706d9258e0ca97c2f0cc885',
    id: '2e14ff6e-b4d5-4c4c-b12b-b1b1d15ec630',
    info: {
        id: '2e14ff6e-b4d5-4c4c-b12b-b1b1d15ec630',
        version: '0.0.1',
        requiredApiVersion: '^1.19.0',
        iconFile: 'icon.png',
        author: { name: 'a', homepage: 'a', support: 'a' },
        name: 'Add-on test',
        nameSlug: 'add-on-test',
        classFile: 'AddOnTestApp.js',
        description: 'a',
        implements: [],
        iconFileContent: '',
    },
    status: AppStatus_1.AppStatus.UNKNOWN,
    settings: {},
    implemented: {},
    installationSource: storage_1.AppInstallationSource.PRIVATE,
    languageContent: {},
    sourcePath: 'GridFS:/6706d9258e0ca97c2f0cc880',
    signature: '',
    createdAt: new Date('2024-10-09T19:27:33.923Z'),
    updatedAt: new Date('2024-10-09T19:27:33.923Z'),
});
// We will be passing promises to the `expect` function
/* eslint-disable @typescript-eslint/no-floating-promises */
describe('canEnableApp', () => {
    it('should throw the message "apps-engine-not-initialized" when appropriate', () => {
        const AppsMock = {
            isInitialized() {
                return false;
            },
        };
        const LicenseMock = {};
        const deps = { Apps: AppsMock, License: LicenseMock };
        return (0, chai_1.expect)((0, canEnableApp_1._canEnableApp)(deps, getDefaultApp())).to.eventually.be.rejectedWith('apps-engine-not-initialized');
    });
    const AppsMock = {
        isInitialized() {
            return true;
        },
    };
    const LicenseMock = {
        hasModule() {
            return false;
        },
        shouldPreventAction() {
            return true;
        },
        hasValidLicense() {
            return false;
        },
    };
    const deps = { Apps: AppsMock, License: LicenseMock };
    it('should throw the message "app-addon-not-valid" when appropriate', () => {
        const app = getDefaultApp();
        app.info.addon = 'chat.rocket.test-addon';
        return (0, chai_1.expect)((0, canEnableApp_1._canEnableApp)(deps, app)).to.eventually.be.rejectedWith('app-addon-not-valid');
    });
    it('should throw the message "license-prevented" when appropriate', () => {
        const privateApp = getDefaultApp();
        const marketplaceApp = getDefaultApp();
        marketplaceApp.installationSource = storage_1.AppInstallationSource.MARKETPLACE;
        return Promise.all([
            (0, chai_1.expect)((0, canEnableApp_1._canEnableApp)(deps, privateApp)).to.eventually.be.rejectedWith('license-prevented'),
            (0, chai_1.expect)((0, canEnableApp_1._canEnableApp)(deps, marketplaceApp)).to.eventually.be.rejectedWith('license-prevented'),
        ]);
    });
    it('should throw the message "invalid-license" when appropriate', () => {
        const License = Object.assign(Object.assign({}, LicenseMock), { shouldPreventAction: () => false });
        const app = getDefaultApp();
        app.installationSource = storage_1.AppInstallationSource.MARKETPLACE;
        app.marketplaceInfo = { isEnterpriseOnly: true };
        const deps = { Apps: AppsMock, License };
        return (0, chai_1.expect)((0, canEnableApp_1._canEnableApp)(deps, app)).to.eventually.be.rejectedWith('invalid-license');
    });
    it('should not throw if app is migrated', () => {
        const app = getDefaultApp();
        app.migrated = true;
        return (0, chai_1.expect)((0, canEnableApp_1._canEnableApp)(deps, app)).to.not.eventually.be.rejected;
    });
    it('should not throw if license allows it', () => {
        const License = {
            hasModule() {
                return true;
            },
            shouldPreventAction() {
                return false;
            },
            hasValidLicense() {
                return true;
            },
        };
        const deps = { Apps: AppsMock, License };
        return (0, chai_1.expect)((0, canEnableApp_1._canEnableApp)(deps, getDefaultApp())).to.not.eventually.be.rejected;
    });
});
