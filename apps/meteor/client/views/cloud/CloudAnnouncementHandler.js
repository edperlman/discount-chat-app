"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const exhaustiveCheck_1 = require("../../../lib/utils/exhaustiveCheck");
const useUiKitActionManager_1 = require("../../uikit/hooks/useUiKitActionManager");
const CloudAnnouncementHandler = ({ dictionary = {}, surface, view }) => {
    const { i18n } = (0, react_i18next_1.useTranslation)();
    (0, react_1.useEffect)(() => {
        const appNs = `app-cloud-announcements-core`;
        if (!dictionary) {
            return;
        }
        for (const [language, translations] of Object.entries(dictionary)) {
            i18n.addResources(language, appNs, translations);
        }
    }, [i18n, dictionary]);
    const actionManager = (0, useUiKitActionManager_1.useUiKitActionManager)();
    const viewRef = (0, react_1.useRef)(Object.assign(Object.assign({}, view), { appId: view.appId || 'cloud-announcements-core' }));
    viewRef.current = Object.assign(Object.assign({}, view), { appId: view.appId || 'cloud-announcements-core' });
    (0, react_1.useEffect)(() => {
        switch (surface) {
            case 'modal': {
                // TODO fixme
                const modalView = viewRef.current;
                actionManager.openView('modal', modalView);
                return () => {
                    actionManager.disposeView(modalView.id);
                };
            }
            case 'banner': {
                const bannerView = viewRef.current;
                actionManager.openView('banner', Object.assign({}, bannerView));
                return () => {
                    actionManager.disposeView(bannerView.viewId);
                };
            }
            default:
                (0, exhaustiveCheck_1.exhaustiveCheck)(surface);
        }
    }, [actionManager, surface]);
    return null;
};
exports.default = CloudAnnouncementHandler;
