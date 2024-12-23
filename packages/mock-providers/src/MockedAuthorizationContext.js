"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockedAuthorizationContext = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const MockedAuthorizationContext = ({ permissions = [], roles = [], children, }) => {
    return ((0, jsx_runtime_1.jsx)(ui_contexts_1.AuthorizationContext.Provider, { value: {
            queryPermission: (id) => [() => () => undefined, () => permissions.includes(id)],
            queryAtLeastOnePermission: (ids) => [
                () => () => undefined,
                () => ids.some((id) => permissions.includes(id)),
            ],
            queryAllPermissions: (ids) => [() => () => undefined, () => ids.every((id) => permissions.includes(id))],
            queryRole: (id) => [() => () => undefined, () => roles.includes(id)],
            roleStore: {
                roles: {},
                emit: () => undefined,
                on: () => () => undefined,
                off: () => undefined,
                events: () => ['change'],
                has: () => false,
                once: () => () => undefined,
            },
        }, children: children }));
};
exports.MockedAuthorizationContext = MockedAuthorizationContext;
