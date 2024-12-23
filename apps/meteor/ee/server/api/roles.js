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
exports.isRoleUpdateProps = exports.isRoleCreateProps = void 0;
const license_1 = require("@rocket.chat/license");
const models_1 = require("@rocket.chat/models");
const ajv_1 = __importDefault(require("ajv"));
const api_1 = require("../../../app/api/server/api");
const hasPermission_1 = require("../../../app/authorization/server/functions/hasPermission");
const index_1 = require("../../../app/settings/server/index");
const insertRole_1 = require("../lib/roles/insertRole");
const updateRole_1 = require("../lib/roles/updateRole");
const ajv = new ajv_1.default({
    coerceTypes: true,
});
const roleCreatePropsSchema = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
        },
        description: {
            type: 'string',
            nullable: true,
        },
        scope: {
            type: 'string',
            enum: ['Users', 'Subscriptions'],
            nullable: true,
        },
        mandatory2fa: {
            type: 'boolean',
            nullable: true,
        },
    },
    required: ['name'],
    additionalProperties: false,
};
exports.isRoleCreateProps = ajv.compile(roleCreatePropsSchema);
const roleUpdatePropsSchema = {
    type: 'object',
    properties: {
        roleId: {
            type: 'string',
        },
        name: {
            type: 'string',
        },
        description: {
            type: 'string',
            nullable: true,
        },
        scope: {
            type: 'string',
            enum: ['Users', 'Subscriptions'],
            nullable: true,
        },
        mandatory2fa: {
            type: 'boolean',
            nullable: true,
        },
    },
    required: ['roleId', 'name'],
    additionalProperties: false,
};
exports.isRoleUpdateProps = ajv.compile(roleUpdatePropsSchema);
api_1.API.v1.addRoute('roles.create', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!license_1.License.hasModule('custom-roles')) {
                throw new Meteor.Error('error-action-not-allowed', 'This is an enterprise feature');
            }
            if (!(0, exports.isRoleCreateProps)(this.bodyParams)) {
                throw new Meteor.Error('error-invalid-role-properties', 'The role properties are invalid.');
            }
            const userId = Meteor.userId();
            if (!userId || !(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'access-permissions'))) {
                throw new Meteor.Error('error-action-not-allowed', 'Accessing permissions is not allowed');
            }
            const { name, scope, description, mandatory2fa } = this.bodyParams;
            if (yield models_1.Roles.findOneByIdOrName(name)) {
                throw new Meteor.Error('error-duplicate-role-names-not-allowed', 'Role name already exists');
            }
            const roleData = Object.assign(Object.assign({ description: description || '' }, (mandatory2fa !== undefined && { mandatory2fa })), { name, scope: scope || 'Users', protected: false });
            const options = {
                broadcastUpdate: index_1.settings.get('UI_DisplayRoles'),
            };
            const role = yield (0, insertRole_1.insertRoleAsync)(roleData, options);
            return api_1.API.v1.success({ role });
        });
    },
});
api_1.API.v1.addRoute('roles.update', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, exports.isRoleUpdateProps)(this.bodyParams)) {
                throw new Meteor.Error('error-invalid-role-properties', 'The role properties are invalid.');
            }
            if (!(yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'access-permissions'))) {
                throw new Meteor.Error('error-action-not-allowed', 'Accessing permissions is not allowed');
            }
            const { roleId, name, scope, description, mandatory2fa } = this.bodyParams;
            const role = yield models_1.Roles.findOne(roleId);
            if (!license_1.License.hasModule('custom-roles') && !(role === null || role === void 0 ? void 0 : role.protected)) {
                throw new Meteor.Error('error-action-not-allowed', 'This is an enterprise feature');
            }
            const roleData = Object.assign(Object.assign({ description: description || '' }, (mandatory2fa !== undefined && { mandatory2fa })), { name, scope: scope || 'Users', protected: false });
            const options = {
                broadcastUpdate: index_1.settings.get('UI_DisplayRoles'),
            };
            const updatedRole = yield (0, updateRole_1.updateRole)(roleId, roleData, options);
            return api_1.API.v1.success({ role: updatedRole });
        });
    },
});
