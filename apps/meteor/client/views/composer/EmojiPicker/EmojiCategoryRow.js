"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_client_1 = require("@rocket.chat/ui-client");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const EmojiElement_1 = __importDefault(require("./EmojiElement"));
const client_1 = require("../../../../app/emoji/client");
const EmojiCategoryRow = ({ categoryKey, categoriesPosition, i18n, emojis, customItemsLimit, handleLoadMore, handleSelectEmoji, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const categoryRowStyle = (0, css_in_js_1.css) `
		button {
			margin-right: 0.25rem;
			margin-bottom: 0.25rem;
			&:nth-child(9n) {
				margin-right: 0;
			}
		}
	`;
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { mbe: 12, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'h4', fontScale: 'c1', mbe: 12, id: `emoji-list-category-${categoryKey}`, ref: (element) => {
                    categoriesPosition.current.push({ el: element, top: element === null || element === void 0 ? void 0 : element.offsetTop });
                    return element;
                }, children: t(i18n) }), emojis.list.length > 0 && ((0, jsx_runtime_1.jsx)(ui_client_1.EmojiPickerCategoryWrapper, { className: [categoryRowStyle, `emoji-category-${categoryKey}`].filter(Boolean), children: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [categoryKey === client_1.CUSTOM_CATEGORY &&
                            emojis.list.map(({ emoji, image }, index = 1) => index < customItemsLimit && ((0, jsx_runtime_1.jsx)(EmojiElement_1.default, { emoji: emoji, image: image, onClick: handleSelectEmoji }, emoji + categoryKey))), !(categoryKey === client_1.CUSTOM_CATEGORY) &&
                            emojis.list.map(({ emoji, image }) => ((0, jsx_runtime_1.jsx)(EmojiElement_1.default, { emoji: emoji, image: image, onClick: handleSelectEmoji }, emoji + categoryKey)))] }) })), emojis.limit && (emojis === null || emojis === void 0 ? void 0 : emojis.limit) > 0 && emojis.list.length > emojis.limit && ((0, jsx_runtime_1.jsx)(ui_client_1.EmojiPickerLoadMore, { onClick: handleLoadMore, children: t('Load_more') })), emojis.list.length === 0 && (0, jsx_runtime_1.jsx)(ui_client_1.EmojiPickerNotFound, { children: t('No_emojis_found') })] }));
};
exports.default = EmojiCategoryRow;
