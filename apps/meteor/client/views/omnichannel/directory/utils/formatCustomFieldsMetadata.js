"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatCustomFieldsMetadata = void 0;
const formatCustomFieldsMetadata = (customFields, scope) => {
    if (!customFields) {
        return [];
    }
    return customFields
        .filter((field) => field.visibility === 'visible' && field.scope === scope)
        .map(({ _id, label, options, defaultValue, required }) => ({
        name: _id,
        label,
        type: options ? 'select' : 'text',
        required,
        defaultValue,
        options: options === null || options === void 0 ? void 0 : options.split(',').map((item) => [item.trim(), item.trim()]),
    }));
};
exports.formatCustomFieldsMetadata = formatCustomFieldsMetadata;
