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
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
function ComposerBoxPopup({ title, items, focused, select, renderItem = ({ item }) => (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: JSON.stringify(item) }), }) {
    const { t } = (0, react_i18next_1.useTranslation)();
    const id = (0, fuselage_hooks_1.useUniqueId)();
    const composerBoxPopupRef = (0, react_1.useRef)(null);
    const popupSizes = (0, fuselage_hooks_1.useContentBoxSize)(composerBoxPopupRef);
    const variant = popupSizes && popupSizes.inlineSize < 480 ? 'small' : 'large';
    const getOptionTitle = (item) => {
        if (variant !== 'small') {
            return undefined;
        }
        if (item.outside) {
            return t('Not_in_channel');
        }
        if (item.suggestion) {
            return t('Suggestion_from_recent_messages');
        }
        if (item.disabled) {
            return t('Unavailable_in_encrypted_channels');
        }
    };
    const itemsFlat = (0, react_1.useMemo)(() => items
        .flatMap((item) => {
        if (item.isSuccess) {
            return item.data;
        }
        return [];
    })
        .sort((a, b) => (('sort' in a && a.sort) || 0) - (('sort' in b && b.sort) || 0)), [items]);
    const isLoading = items.some((item) => item.isLoading && item.fetchStatus !== 'idle');
    (0, react_1.useEffect)(() => {
        if (focused) {
            const element = document.getElementById(`popup-item-${focused._id}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    }, [focused]);
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { position: 'relative', children: (0, jsx_runtime_1.jsxs)(fuselage_1.Tile, { ref: composerBoxPopupRef, padding: 0, role: 'menu', mbe: 8, overflow: 'hidden', "aria-labelledby": id, children: [title && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { bg: 'tint', pi: 16, pb: 8, id: id, children: title })), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { pb: 8, maxHeight: 'x320', children: [!isLoading && itemsFlat.length === 0 && (0, jsx_runtime_1.jsx)(fuselage_1.Option, { children: t('No_results_found') }), isLoading && (0, jsx_runtime_1.jsx)(fuselage_1.OptionSkeleton, {}), itemsFlat.map((item, index) => {
                            return ((0, jsx_runtime_1.jsx)(fuselage_1.Option, { title: getOptionTitle(item), onClick: () => select(item), selected: item === focused, id: `popup-item-${item._id}`, tabIndex: item === focused ? 0 : -1, "aria-selected": item === focused, disabled: item.disabled, children: renderItem({ item: Object.assign(Object.assign({}, item), { variant }) }) }, index));
                        })] })] }) }));
}
exports.default = (0, react_1.memo)(ComposerBoxPopup);
