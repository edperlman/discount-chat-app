"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUserBanners = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const useDismissUserBannerMutation_1 = require("./useDismissUserBannerMutation");
const banners = __importStar(require("../../../lib/banners"));
const useUserBanners = () => {
    const user = (0, ui_contexts_1.useUser)();
    const { t, i18n } = (0, react_i18next_1.useTranslation)();
    const { mutate: dismissUserBanner } = (0, useDismissUserBannerMutation_1.useDismissUserBannerMutation)();
    (0, react_1.useEffect)(() => {
        if (!(user === null || user === void 0 ? void 0 : user.banners) || Object.keys(user.banners).length === 0) {
            return;
        }
        const firstBanner = Object.values(user.banners)
            .filter((b) => b.read !== true)
            .sort((a, b) => b.priority - a.priority)[0];
        if (!firstBanner) {
            return;
        }
        banners.open({
            id: firstBanner.id,
            title: i18n.exists(firstBanner.title) ? t(firstBanner.title) : firstBanner.title,
            text: i18n.exists(firstBanner.text) ? t(firstBanner.text, firstBanner.textArguments) : firstBanner.text,
            modifiers: firstBanner.modifiers,
            action() {
                if (firstBanner.link) {
                    window.open(firstBanner.link, '_system');
                }
            },
            onClose() {
                dismissUserBanner({ id: firstBanner.id });
            },
        });
    }, [dismissUserBanner, i18n, t, user === null || user === void 0 ? void 0 : user.banners]);
};
exports.useUserBanners = useUserBanners;
