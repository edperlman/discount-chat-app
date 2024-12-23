"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const PriorityEditFormWithData_1 = __importDefault(require("./PriorityEditFormWithData"));
const Contextualbar_1 = require("../../components/Contextualbar");
const PriorityList = ({ priorityId, onClose, onSave }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarDialog, { children: (0, jsx_runtime_1.jsxs)(Contextualbar_1.Contextualbar, { children: [(0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarHeader, { children: [(0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarTitle, { children: t('Edit_Priority') }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarClose, { onClick: onClose })] }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarScrollableContent, { height: '100%', children: (0, jsx_runtime_1.jsx)(PriorityEditFormWithData_1.default, { priorityId: priorityId, onSave: onSave, onCancel: onClose }) })] }) }));
};
exports.default = PriorityList;
