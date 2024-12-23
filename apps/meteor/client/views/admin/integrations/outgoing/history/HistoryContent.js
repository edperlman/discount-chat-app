"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const HistoryItem_1 = __importDefault(require("./HistoryItem"));
const HistoryContent = ({ data, isLoading }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    if (isLoading) {
        return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { w: 'full', pb: 24, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { mbe: 4 }), (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { mbe: 8 }), (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { mbe: 4 }), (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { mbe: 8 }), (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { mbe: 4 }), (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { mbe: 8 })] }));
    }
    if (data.length < 1) {
        return (0, jsx_runtime_1.jsx)(fuselage_1.Box, { mbs: 16, children: t('Integration_Outgoing_WebHook_No_History') });
    }
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', alignItems: 'center', flexDirection: 'column', children: (0, jsx_runtime_1.jsx)(fuselage_1.Accordion, { w: 'full', maxWidth: 'x600', alignSelf: 'center', children: data.map((current) => ((0, jsx_runtime_1.jsx)(HistoryItem_1.default, { data: current }, current._id))) }, 'content') }));
};
exports.default = HistoryContent;
