"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useValidCustomFields = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const useCustomFieldsQuery_1 = require("./useCustomFieldsQuery");
const checkIsVisibleAndScopeVisitor = (key, customFields) => {
    const field = customFields === null || customFields === void 0 ? void 0 : customFields.find(({ _id }) => _id === key);
    return (field === null || field === void 0 ? void 0 : field.visibility) === 'visible' && (field === null || field === void 0 ? void 0 : field.scope) === 'visitor';
};
const useValidCustomFields = (userCustomFields) => {
    const { data, isError } = (0, useCustomFieldsQuery_1.useCustomFieldsQuery)();
    const canViewCustomFields = (0, ui_contexts_1.usePermission)('view-livechat-room-customfields');
    const customFieldEntries = (0, react_1.useMemo)(() => {
        if (!canViewCustomFields || !userCustomFields || !(data === null || data === void 0 ? void 0 : data.customFields) || isError) {
            return [];
        }
        return Object.entries(userCustomFields).filter(([key, value]) => checkIsVisibleAndScopeVisitor(key, data === null || data === void 0 ? void 0 : data.customFields) && value);
    }, [data === null || data === void 0 ? void 0 : data.customFields, userCustomFields, canViewCustomFields, isError]);
    return customFieldEntries;
};
exports.useValidCustomFields = useValidCustomFields;
