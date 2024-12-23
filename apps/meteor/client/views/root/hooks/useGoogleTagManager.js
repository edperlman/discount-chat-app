"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGoogleTagManager = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const useGoogleTagManager = () => {
    const i = (0, ui_contexts_1.useSetting)('GoogleTagManager_id', '');
    (0, react_1.useEffect)(() => {
        var _a;
        if (typeof i !== 'string' || i.trim() === '') {
            return;
        }
        const w = window;
        w.dataLayer = w.dataLayer || [];
        w.dataLayer.push({
            'gtm.start': new Date().getTime(),
            'event': 'gtm.js',
        });
        const f = document.getElementsByTagName('script')[0];
        const j = document.createElement('script');
        j.async = true;
        j.src = `//www.googletagmanager.com/gtm.js?id=${i}`;
        (_a = f.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(j, f);
        return () => {
            var _a;
            (_a = f.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(j);
        };
    }, [i]);
};
exports.useGoogleTagManager = useGoogleTagManager;
