"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const FormSkeleton_1 = require("./FormSkeleton");
const Field_1 = __importDefault(require("../../components/Field"));
const Info_1 = __importDefault(require("../../components/Info"));
const Label_1 = __importDefault(require("../../components/Label"));
const usePriorityInfo_1 = require("../hooks/usePriorityInfo");
const PriorityField = ({ id }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { data, isInitialLoading, isError } = (0, usePriorityInfo_1.usePriorityInfo)(id);
    if (isInitialLoading) {
        return (0, jsx_runtime_1.jsx)(FormSkeleton_1.FormSkeleton, {});
    }
    if (isError || !data) {
        return (0, jsx_runtime_1.jsx)(fuselage_1.Box, { mbs: 16, children: t('Custom_Field_Not_Found') });
    }
    const { dirty, name, i18n } = data;
    return ((0, jsx_runtime_1.jsxs)(Field_1.default, { children: [(0, jsx_runtime_1.jsx)(Label_1.default, { children: t('Priority') }), (0, jsx_runtime_1.jsx)(Info_1.default, { children: dirty ? name : t(i18n) })] }));
};
exports.default = PriorityField;
