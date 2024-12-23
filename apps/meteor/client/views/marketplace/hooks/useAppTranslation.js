"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAppTranslation = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const Utilities_1 = require("../../../../ee/lib/misc/Utilities");
const useAppTranslation = (appId) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const tApp = (0, react_1.useCallback)((key, ...args) => {
        if (!key) {
            return '';
        }
        const appKey = Utilities_1.Utilities.getI18nKeyForApp(key, appId);
        if (t.has(appKey)) {
            return t(appKey, ...args);
        }
        if (t.has(key)) {
            return t(key, ...args);
        }
        return key;
    }, [t, appId]);
    return Object.assign(tApp, {
        has: (0, react_1.useCallback)((key) => {
            if (!key) {
                return false;
            }
            return t.has(Utilities_1.Utilities.getI18nKeyForApp(key, appId)) || t.has(key);
        }, [t, appId]),
    });
};
exports.useAppTranslation = useAppTranslation;
