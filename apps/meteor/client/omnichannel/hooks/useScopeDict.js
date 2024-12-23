"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useScopeDict = void 0;
const react_i18next_1 = require("react-i18next");
const useScopeDict = (scope, departmentName) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const dict = {
        global: t('Public'),
        user: t('Private'),
    };
    return dict[scope] || departmentName;
};
exports.useScopeDict = useScopeDict;
