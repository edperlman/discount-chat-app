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
Object.defineProperty(exports, "__esModule", { value: true });
const core_services_1 = require("@rocket.chat/core-services");
const license_1 = require("@rocket.chat/license");
const validateUserRoles_1 = require("./validateUserRoles");
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    const license = new license_1.MockedLicenseBuilder();
    yield license_1.License.setWorkspaceUrl('http://localhost:3000');
    license_1.License.setLicenseLimitCounter('activeUsers', () => 0);
    license_1.License.setLicenseLimitCounter('guestUsers', () => 0);
    license_1.License.setLicenseLimitCounter('roomsPerGuest', () => __awaiter(void 0, void 0, void 0, function* () { return 0; }));
    license_1.License.setLicenseLimitCounter('privateApps', () => 0);
    license_1.License.setLicenseLimitCounter('marketplaceApps', () => 0);
    license_1.License.setLicenseLimitCounter('monthlyActiveContacts', () => __awaiter(void 0, void 0, void 0, function* () { return 0; }));
    license_1.License.setLicenseLimitCounter('activeUsers', () => 1);
    license
        .withLimits('activeUsers', [
        {
            max: 1,
            behavior: 'prevent_action',
        },
    ])
        .withLimits('guestUsers', [
        {
            max: 1,
            behavior: 'prevent_action',
        },
    ]);
    yield license_1.License.setLicense(yield license.sign());
}));
describe('Operating after activeUsers Limits', () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        license_1.License.setLicenseLimitCounter('activeUsers', () => 1);
    }));
    describe('Adding a new user', () => {
        it('should  throw error when user is active as undefined', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = {
                roles: ['user'],
            };
            yield expect((0, validateUserRoles_1.validateUserRoles)(user)).rejects.toThrow(core_services_1.MeteorError);
        }));
        it('should not throw error when user is not active', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = {
                active: false,
                type: 'user',
            };
            yield expect((0, validateUserRoles_1.validateUserRoles)(user)).resolves.not.toThrow();
        }));
        it('should not throw error when user is an app', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = {
                active: true,
                type: 'app',
            };
            yield expect((0, validateUserRoles_1.validateUserRoles)(user)).resolves.not.toThrow();
        }));
        it('should not throw error when user is a bot', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = {
                active: true,
                type: 'bot',
            };
            yield expect((0, validateUserRoles_1.validateUserRoles)(user)).resolves.not.toThrow();
        }));
        it('should not throw error when user is a guest', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = {
                active: true,
                type: 'user',
                roles: ['guest'],
            };
            yield expect((0, validateUserRoles_1.validateUserRoles)(user)).resolves.not.toThrow();
        }));
        it('should throw error when user is active', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = {
                active: true,
                type: 'user',
            };
            yield expect((0, validateUserRoles_1.validateUserRoles)(user)).rejects.toThrow(core_services_1.MeteorError);
        }));
    });
    describe('Editing an existing user', () => {
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            license_1.License.setLicenseLimitCounter('guestUsers', () => 1);
        }));
        afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
            license_1.License.setLicenseLimitCounter('guestUsers', () => 0);
        }));
        it('should throw an error when we try to activate a user', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = {
                active: true,
                type: 'user',
            };
            const currentUser = {
                active: false,
                type: 'user',
            };
            yield expect((0, validateUserRoles_1.validateUserRoles)(user, currentUser)).rejects.toThrow(core_services_1.MeteorError);
        }));
        it('should not throw an error when we try to deactivate a user', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = {
                active: false,
                type: 'user',
            };
            const currentUser = {
                active: true,
                type: 'user',
            };
            yield expect((0, validateUserRoles_1.validateUserRoles)(user, currentUser)).resolves.not.toThrow();
        }));
        it('should not throw an error when we try to change an active user', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = {
                active: true,
                type: 'user',
            };
            const currentUser = {
                active: true,
                type: 'user',
            };
            yield expect((0, validateUserRoles_1.validateUserRoles)(user, currentUser)).resolves.not.toThrow();
        }));
        it('should throw an error when we try to convert a bot to a user', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = {
                active: true,
                type: 'user',
            };
            const currentUser = {
                active: true,
                type: 'bot',
            };
            yield expect((0, validateUserRoles_1.validateUserRoles)(user, currentUser)).rejects.toThrow(core_services_1.MeteorError);
        }));
    });
});
describe('Operating after guestUsers Limits', () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        license_1.License.setLicenseLimitCounter('guestUsers', () => 1);
    }));
    it('should throw an error when we try to convert an user to guest', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = {
            active: true,
            type: 'user',
            roles: ['guest'],
        };
        const currentUser = {
            active: true,
            type: 'user',
        };
        yield expect((0, validateUserRoles_1.validateUserRoles)(user, currentUser)).rejects.toThrow(core_services_1.MeteorError);
    }));
    it('should  throw an error when we try to convert app to guest', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = {
            active: true,
            type: 'user',
            roles: ['guest'],
        };
        const currentUser = {
            active: true,
            type: 'app',
        };
        yield expect((0, validateUserRoles_1.validateUserRoles)(user, currentUser)).rejects.toThrow(core_services_1.MeteorError);
    }));
    it('should not throw an error when we try to edit a guest', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = {
            active: true,
            type: 'user',
            roles: ['guest'],
        };
        const currentUser = {
            active: true,
            type: 'user',
            roles: ['guest'],
        };
        yield expect((0, validateUserRoles_1.validateUserRoles)(user, currentUser)).resolves.not.toThrow();
    }));
});
describe('Operating under activeUsers Limits', () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        license_1.License.setLicenseLimitCounter('activeUsers', () => 0);
    }));
    describe('Adding a new user', () => {
        it('should not throw an error validating a regular user', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = {
                active: true,
                type: 'user',
            };
            yield expect((0, validateUserRoles_1.validateUserRoles)(user)).resolves.not.toThrow();
        }));
    });
    describe('Editing an existing user', () => {
        it('should not throw an error when we try to activate a user', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = {
                active: true,
                type: 'user',
            };
            const currentUser = {
                active: false,
                type: 'user',
            };
            yield expect((0, validateUserRoles_1.validateUserRoles)(user, currentUser)).resolves.not.toThrow();
        }));
        it('should not throw an error when we try to convert a guest to a user', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = {
                active: true,
                type: 'user',
            };
            const currentUser = {
                active: true,
                type: 'user',
                roles: ['guest'],
            };
            yield expect((0, validateUserRoles_1.validateUserRoles)(user, currentUser)).resolves.not.toThrow();
        }));
        it('should not throw an error when we try to convert a bot to a user', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = {
                active: true,
                type: 'user',
            };
            const currentUser = {
                active: true,
                type: 'bot',
            };
            yield expect((0, validateUserRoles_1.validateUserRoles)(user, currentUser)).resolves.not.toThrow();
        }));
        it('should not throw an error when we try to convert an app to a user', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = {
                active: true,
                type: 'user',
            };
            const currentUser = {
                active: true,
                type: 'app',
            };
            yield expect((0, validateUserRoles_1.validateUserRoles)(user, currentUser)).resolves.not.toThrow();
        }));
    });
});
