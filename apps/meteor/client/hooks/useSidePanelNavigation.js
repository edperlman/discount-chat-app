"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSidePanelNavigationScreenSize = exports.useSidePanelNavigation = void 0;
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_client_1 = require("@rocket.chat/ui-client");
const useSidePanelNavigation = () => {
    const isSidepanelFeatureEnabled = (0, ui_client_1.useFeaturePreview)('sidepanelNavigation');
    // ["xs", "sm", "md", "lg", "xl", xxl"]
    return (0, exports.useSidePanelNavigationScreenSize)() && isSidepanelFeatureEnabled;
};
exports.useSidePanelNavigation = useSidePanelNavigation;
const useSidePanelNavigationScreenSize = () => {
    const breakpoints = (0, fuselage_hooks_1.useBreakpoints)();
    // ["xs", "sm", "md", "lg", "xl", xxl"]
    return breakpoints.includes('lg');
};
exports.useSidePanelNavigationScreenSize = useSidePanelNavigationScreenSize;
