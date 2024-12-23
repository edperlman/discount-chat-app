"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUserCustomFields = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const useUserCustomFields = (customFields) => {
    const customFieldsToShowSetting = (0, ui_contexts_1.useSetting)('Accounts_CustomFieldsToShowInUserInfo');
    let customFieldsToShowObj;
    try {
        customFieldsToShowObj = JSON.parse(customFieldsToShowSetting);
    }
    catch (error) {
        customFieldsToShowObj = undefined;
    }
    if (!customFieldsToShowObj) {
        return undefined;
    }
    const customFieldsToShow = customFieldsToShowObj.map((value) => {
        if (!value) {
            return undefined;
        }
        const [customFieldLabel] = Object.keys(value);
        const [customFieldValue] = Object.values(value);
        const fieldValue = customFields === null || customFields === void 0 ? void 0 : customFields[customFieldValue];
        return { label: customFieldLabel, value: fieldValue !== '' ? fieldValue : undefined };
    });
    return customFieldsToShow;
};
exports.useUserCustomFields = useUserCustomFields;
