"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePermissionsAndRoles = void 0;
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const string_helpers_1 = require("@rocket.chat/string-helpers");
const react_1 = require("react");
const lib_1 = require("../../../../../app/authorization/lib");
const client_1 = require("../../../../../app/models/client");
const useReactiveValue_1 = require("../../../../hooks/useReactiveValue");
const usePermissionsAndRoles = (type = 'permissions', filter = '', limit = 25, skip = 0) => {
    const getFilter = (0, react_1.useCallback)(() => {
        const filterRegExp = new RegExp((0, string_helpers_1.escapeRegExp)(filter), 'i');
        return {
            level: type === 'permissions' ? { $ne: lib_1.CONSTANTS.SETTINGS_LEVEL } : lib_1.CONSTANTS.SETTINGS_LEVEL,
            _id: filterRegExp,
        };
    }, [type, filter]);
    const getPermissions = (0, react_1.useCallback)(() => client_1.Permissions.find(getFilter(), {
        sort: {
            _id: 1,
        },
        skip,
        limit,
    }), [limit, skip, getFilter]);
    const getTotalPermissions = (0, react_1.useCallback)(() => client_1.Permissions.find(getFilter()).count(), [getFilter]);
    const permissions = (0, useReactiveValue_1.useReactiveValue)(getPermissions);
    const permissionsTotal = (0, useReactiveValue_1.useReactiveValue)(getTotalPermissions);
    const getRoles = (0, fuselage_hooks_1.useMutableCallback)(() => client_1.Roles.find().fetch());
    const roles = (0, useReactiveValue_1.useReactiveValue)(getRoles);
    return { permissions: permissions.fetch(), total: permissionsTotal, roleList: roles, reload: getRoles };
};
exports.usePermissionsAndRoles = usePermissionsAndRoles;
