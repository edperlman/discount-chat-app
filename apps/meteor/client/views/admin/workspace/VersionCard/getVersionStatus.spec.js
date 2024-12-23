"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getVersionStatus_1 = require("./getVersionStatus");
describe('if the server version from server and the highest version from cloud are the same', () => {
    describe('the expiration date is in the future', () => {
        it('should return as latest version', () => {
            const status = (0, getVersionStatus_1.getVersionStatus)('3.0.0', [
                {
                    version: '3.0.0',
                    expiration: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                    security: false,
                    infoUrl: '',
                },
            ]);
            expect(status.label).toBe('latest');
        });
    });
    describe('the expiration date is in the past', () => {
        it('should return as outdated version', () => {
            const status = (0, getVersionStatus_1.getVersionStatus)('3.0.0', [
                {
                    version: '3.0.0',
                    expiration: new Date('2020-01-01'),
                    security: false,
                    infoUrl: '',
                },
            ]);
            expect(status.label).toBe('outdated');
        });
    });
});
describe('if the server version is not in the list of supported versions', () => {
    it('should return as outdated version', () => {
        const status = (0, getVersionStatus_1.getVersionStatus)('2.0.0', [
            {
                version: '3.0.0',
                expiration: new Date(),
                security: false,
                infoUrl: '',
            },
        ]);
        expect(status.label).toBe('outdated');
    });
});
describe('if the server version is in the list of supported versions but is not the highest', () => {
    describe('the expiration date is in the future', () => {
        it('should return as available version', () => {
            const status = (0, getVersionStatus_1.getVersionStatus)('3.0.0', [
                {
                    version: '3.0.0',
                    expiration: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                    security: false,
                    infoUrl: '',
                },
                {
                    version: '4.0.0',
                    expiration: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                    security: false,
                    infoUrl: '',
                },
            ]);
            expect(status.label).toBe('available_version');
        });
    });
    describe('the expiration date is in the past', () => {
        it('should return as outdated version', () => {
            const status = (0, getVersionStatus_1.getVersionStatus)('3.0.0', [
                {
                    version: '3.0.0',
                    expiration: new Date('2020-01-01'),
                    security: false,
                    infoUrl: '',
                },
                {
                    version: '4.0.0',
                    expiration: new Date(),
                    security: false,
                    infoUrl: '',
                },
            ]);
            expect(status.label).toBe('outdated');
        });
    });
});
describe('if the server version is not in the list of supported versions but is the highest', () => {
    it('should return as latest version', () => {
        const status = (0, getVersionStatus_1.getVersionStatus)('4.0.0', [
            {
                version: '2.0.0',
                expiration: new Date(),
                security: false,
                infoUrl: '',
            },
            {
                version: '3.0.0',
                expiration: new Date(),
                security: false,
                infoUrl: '',
            },
        ]);
        expect(status.label).toBe('outdated');
        expect(status.version).toBe('4.0.0');
    });
});
describe('prerelease version', () => {
    it('should not suggest available version the highest version is a prerelease from a different tag', () => {
        const status = (0, getVersionStatus_1.getVersionStatus)('3.0.0', [
            {
                version: '3.0.0',
                expiration: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                security: false,
                infoUrl: '',
            },
            {
                version: '4.0.0-develop',
                expiration: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                security: false,
                infoUrl: '',
            },
        ]);
        expect(status.label).toBe('latest');
        expect(status.version).toBe('3.0.0');
    });
    it('should suggest available version the highest version is a prerelease from the same tag', () => {
        const status = (0, getVersionStatus_1.getVersionStatus)('6.5.0-rc.14', [
            {
                version: '6.5.0-rc.14',
                expiration: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                security: false,
                infoUrl: '',
            },
            {
                version: '6.5.0-rc.15',
                expiration: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                security: false,
                infoUrl: '',
            },
            {
                version: '4.0.0-develop',
                expiration: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                security: false,
                infoUrl: '',
            },
        ]);
        expect(status.label).toBe('available_version');
        expect(status.version).toBe('6.5.0-rc.15');
    });
    it('should suggest available version the highest version even if the current one is a prerelease', () => {
        const status = (0, getVersionStatus_1.getVersionStatus)('6.5.0-rc.14', [
            {
                version: '6.5.0-rc.14',
                expiration: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                security: false,
                infoUrl: '',
            },
            {
                version: '6.5.0-rc.15',
                expiration: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                security: false,
                infoUrl: '',
            },
            {
                version: '7.0.0',
                expiration: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                security: false,
                infoUrl: '',
            },
        ]);
        expect(status.label).toBe('available_version');
        expect(status.version).toBe('7.0.0');
    });
});
