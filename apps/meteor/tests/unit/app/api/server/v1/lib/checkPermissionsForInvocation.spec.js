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
const mocha_1 = require("mocha");
const proxyquire_1 = __importDefault(require("proxyquire"));
const sinon_1 = __importDefault(require("sinon"));
const userPermissions = {
    '4r3fsadfasf': ['view-all', 'view-none'],
    '4r3fsadfasf2': ['view-all', 'view-0'],
    '4r3fsadfasf3': ['view-all', 'view-1'],
    '4r3fsadfasf4': [],
};
const mocks = {
    '../../authorization/server/functions/hasPermission': {
        hasAllPermissionAsync: (userId, permissions) => {
            return permissions.every((permission) => userPermissions[userId].includes(permission));
        },
        hasAtLeastOnePermissionAsync: (userId, permissions) => {
            return permissions.some((permission) => userPermissions[userId].includes(permission));
        },
    },
    '../../lib/server/lib/deprecationWarningLogger': {
        apiDeprecationLogger: {
            endpoint: sinon_1.default.stub(),
        },
    },
};
const { checkPermissionsForInvocation } = proxyquire_1.default.noCallThru().load('../../../../../../../app/api/server/api.helpers', mocks);
(0, mocha_1.describe)('checkPermissionsForInvocation', () => {
    (0, mocha_1.it)('should return false when no permissions are provided', () => __awaiter(void 0, void 0, void 0, function* () {
        const options = {
            permissionsRequired: {},
        };
        (0, chai_1.expect)(yield checkPermissionsForInvocation('4r3fsadfasf', options.permissionsRequired, 'GET')).to.be.false;
    }));
    (0, mocha_1.it)('should return false when no config is provided for that specific method', () => __awaiter(void 0, void 0, void 0, function* () {
        const options = {
            permissionsRequired: {
                GET: {
                    operation: 'hasAll',
                    permissions: ['view-all', 'view-none'],
                },
            },
        };
        (0, chai_1.expect)(yield checkPermissionsForInvocation('4r3fsadfasf', options.permissionsRequired, 'POST')).to.be.false;
    }));
    (0, mocha_1.it)('should return true path is configured with empty permissions array', () => __awaiter(void 0, void 0, void 0, function* () {
        const options = {
            permissionsRequired: {
                GET: { permissions: [], operation: 'hasAll' },
            },
        };
        (0, chai_1.expect)(yield checkPermissionsForInvocation('4r3fsadfasf', options.permissionsRequired, 'GET')).to.be.true;
    }));
    (0, mocha_1.it)('should return true when user has all permissions', () => __awaiter(void 0, void 0, void 0, function* () {
        const options = {
            permissionsRequired: {
                GET: {
                    operation: 'hasAll',
                    permissions: ['view-all', 'view-none'],
                },
            },
        };
        (0, chai_1.expect)(yield checkPermissionsForInvocation('4r3fsadfasf', options.permissionsRequired, 'GET')).to.be.true;
    }));
    (0, mocha_1.it)('should read permissions config from * when request method provided doesnt have config', () => __awaiter(void 0, void 0, void 0, function* () {
        const options = {
            permissionsRequired: {
                'GET': {
                    operation: 'hasAll',
                    permissions: ['view-all', 'view-none'],
                },
                '*': {
                    operation: 'hasAll',
                    permissions: ['view-all', 'view-none'],
                },
            },
        };
        (0, chai_1.expect)(yield checkPermissionsForInvocation('4r3fsadfasf', options.permissionsRequired, 'PUT')).to.be.true;
    }));
    (0, mocha_1.it)('should return false when user has no permissions', () => __awaiter(void 0, void 0, void 0, function* () {
        const options = {
            permissionsRequired: {
                GET: {
                    operation: 'hasAll',
                    permissions: ['view-all', 'view-none'],
                },
            },
        };
        (0, chai_1.expect)(yield checkPermissionsForInvocation('4r3fsadfasf4', options.permissionsRequired, 'GET')).to.be.false;
    }));
    (0, mocha_1.it)('should return false when operation is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        const options = {
            permissionsRequired: {
                GET: {
                    // @ts-expect-error - for testing purposes
                    operation: 'invalid',
                    permissions: ['view-all', 'view-none'],
                },
            },
        };
        (0, chai_1.expect)(yield checkPermissionsForInvocation('4r3fsadfasf', options.permissionsRequired, 'GET')).to.be.false;
    }));
    (0, mocha_1.it)('should return true when operation is hasAny and user has at least one listed permission', () => __awaiter(void 0, void 0, void 0, function* () {
        const options = {
            permissionsRequired: {
                GET: {
                    operation: 'hasAny',
                    permissions: ['view-all', 'admin'],
                },
            },
        };
        (0, chai_1.expect)(yield checkPermissionsForInvocation('4r3fsadfasf', options.permissionsRequired, 'GET')).to.be.true;
    }));
});
