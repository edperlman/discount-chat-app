"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAccessiblityPreferencesValues = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const useAccessiblityPreferencesValues = () => {
    var _a;
    const themeAppearence = (0, ui_contexts_1.useUserPreference)('themeAppearence') || 'auto';
    const fontSize = (0, ui_contexts_1.useUserPreference)('fontSize') || '100%';
    const mentionsWithSymbol = (0, ui_contexts_1.useUserPreference)('mentionsWithSymbol') || false;
    const clockMode = (_a = (0, ui_contexts_1.useUserPreference)('clockMode')) !== null && _a !== void 0 ? _a : 0;
    const hideUsernames = (0, ui_contexts_1.useUserPreference)('hideUsernames');
    const hideRoles = (0, ui_contexts_1.useUserPreference)('hideRoles');
    return {
        themeAppearence,
        fontSize,
        mentionsWithSymbol,
        clockMode,
        hideUsernames,
        hideRoles,
    };
};
exports.useAccessiblityPreferencesValues = useAccessiblityPreferencesValues;
