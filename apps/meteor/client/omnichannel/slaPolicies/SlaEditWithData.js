"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const SlaEdit_1 = __importDefault(require("./SlaEdit"));
const Skeleton_1 = require("../../components/Skeleton");
function SlaEditWithData({ slaId, reload }) {
    const getSLA = (0, ui_contexts_1.useEndpoint)('GET', `/v1/livechat/sla/:slaId`, { slaId });
    const { data, isLoading, isError } = (0, react_query_1.useQuery)(['/v1/livechat/sla', slaId], () => getSLA());
    const { t } = (0, react_i18next_1.useTranslation)();
    if (isLoading) {
        return (0, jsx_runtime_1.jsx)(Skeleton_1.FormSkeleton, {});
    }
    if (isError || !data) {
        return ((0, jsx_runtime_1.jsx)(fuselage_1.Callout, { m: 16, type: 'danger', children: t('Not_Available') }));
    }
    return (0, jsx_runtime_1.jsx)(SlaEdit_1.default, { slaId: slaId, data: data, reload: reload });
}
exports.default = SlaEditWithData;
