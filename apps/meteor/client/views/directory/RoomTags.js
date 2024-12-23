"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const RoomTags = ({ room }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { mi: 4, alignItems: 'center', display: 'flex', withTruncatedText: true, children: (0, jsx_runtime_1.jsxs)(fuselage_1.Margins, { inline: 2, children: [room.default && (0, jsx_runtime_1.jsx)(fuselage_1.Tag, { variant: 'secondary', children: t('default') }), room.featured && (0, jsx_runtime_1.jsx)(fuselage_1.Tag, { variant: 'secondary', children: t('featured') })] }) }));
};
exports.default = RoomTags;
