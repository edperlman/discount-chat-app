"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidRoleScope = void 0;
const isValidRoleScope = (scope) => ['Users', 'Subscriptions'].includes(scope);
exports.isValidRoleScope = isValidRoleScope;
