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
exports.checkPermissionsForInvocation = checkPermissionsForInvocation;
exports.checkPermissions = checkPermissions;
exports.parseDeprecation = parseDeprecation;
const hasPermission_1 = require("../../authorization/server/functions/hasPermission");
const deprecationWarningLogger_1 = require("../../lib/server/lib/deprecationWarningLogger");
const isLegacyPermissionsPayload = (permissionsPayload) => {
    return Array.isArray(permissionsPayload);
};
const isLightPermissionsPayload = (permissionsPayload) => {
    return (typeof permissionsPayload === 'object' &&
        Object.keys(permissionsPayload).some((key) => ['GET', 'POST', 'PUT', 'DELETE', '*'].includes(key.toUpperCase())) &&
        Object.values(permissionsPayload).every((value) => Array.isArray(value)));
};
const isPermissionsPayload = (permissionsPayload) => {
    return (typeof permissionsPayload === 'object' &&
        Object.keys(permissionsPayload).some((key) => ['GET', 'POST', 'PUT', 'DELETE', '*'].includes(key.toUpperCase())) &&
        Object.values(permissionsPayload).every((value) => typeof value === 'object' && value.operation && value.permissions));
};
function checkPermissionsForInvocation(userId, permissionsPayload, requestMethod) {
    return __awaiter(this, void 0, void 0, function* () {
        const permissions = permissionsPayload[requestMethod] || permissionsPayload['*'];
        if (!permissions) {
            // how we reached here in the first place?
            return false;
        }
        if (permissions.permissions.length === 0) {
            // You can pass an empty array of permissions to allow access to the method
            return true;
        }
        if (permissions.operation === 'hasAll') {
            return (0, hasPermission_1.hasAllPermissionAsync)(userId, permissions.permissions);
        }
        if (permissions.operation === 'hasAny') {
            return (0, hasPermission_1.hasAtLeastOnePermissionAsync)(userId, permissions.permissions);
        }
        return false;
    });
}
// We'll assume options only contains permissionsRequired, as we don't care of the other elements
function checkPermissions(options) {
    if (!options.permissionsRequired) {
        return false;
    }
    if (isPermissionsPayload(options.permissionsRequired)) {
        // No modifications needed
        return true;
    }
    if (isLegacyPermissionsPayload(options.permissionsRequired)) {
        options.permissionsRequired = {
            '*': {
                operation: 'hasAll',
                permissions: options.permissionsRequired,
            },
        };
        return true;
    }
    if (isLightPermissionsPayload(options.permissionsRequired)) {
        Object.keys(options.permissionsRequired).forEach((method) => {
            const methodKey = method;
            // @ts-expect-error -- we know the type of the value but ts refuses to infer it
            options.permissionsRequired[methodKey] = {
                operation: 'hasAll',
                // @ts-expect-error -- we know the type of the value but ts refuses to infer it
                permissions: options.permissionsRequired[methodKey],
            };
        });
        return true;
    }
    // If reached here, options.permissionsRequired contained an invalid payload
    return false;
}
function parseDeprecation(methodThis, { alternatives, version }) {
    const infoMessage = (alternatives === null || alternatives === void 0 ? void 0 : alternatives.length) ? ` Please use the alternative(s): ${alternatives.join(',')}` : '';
    deprecationWarningLogger_1.apiDeprecationLogger.endpoint(methodThis.request.route, version, methodThis.response, infoMessage);
}
