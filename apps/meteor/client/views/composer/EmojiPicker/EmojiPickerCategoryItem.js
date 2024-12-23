"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const mapCategoryIcon = (category) => {
    switch (category) {
        case 'people':
            return 'emoji';
        case 'nature':
            return 'leaf';
        case 'food':
            return 'burger';
        case 'activity':
            return 'ball';
        case 'travel':
            return 'airplane';
        case 'objects':
            return 'lamp-bulb';
        case 'symbols':
            return 'percentage';
        case 'flags':
            return 'flag';
        case 'rocket':
            return 'rocket';
        default:
            return 'clock';
    }
};
const EmojiPickerCategoryItem = (_a) => {
    var { category, index, active, handleGoToCategory } = _a, props = __rest(_a, ["category", "index", "active", "handleGoToCategory"]);
    const { t } = (0, react_i18next_1.useTranslation)();
    const icon = mapCategoryIcon(category.key);
    return ((0, jsx_runtime_1.jsx)(fuselage_1.IconButton, Object.assign({ role: 'tab', pressed: active, title: t(category.i18n), className: category.key, small: true, "aria-label": t(category.i18n), onClick: () => handleGoToCategory(index), icon: icon }, props)));
};
exports.default = EmojiPickerCategoryItem;
