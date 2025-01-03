"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const EditTrigger_1 = __importDefault(require("./EditTrigger"));
const Contextualbar_1 = require("../../../components/Contextualbar");
const EditTriggerWithData = ({ triggerId }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const getTriggersById = (0, ui_contexts_1.useEndpoint)('GET', '/v1/livechat/triggers/:_id', { _id: triggerId });
    const { data, isLoading, isError } = (0, react_query_1.useQuery)(['livechat-getTriggersById', triggerId], () => __awaiter(void 0, void 0, void 0, function* () { return getTriggersById(); }), {
        refetchOnWindowFocus: false,
    });
    if (isLoading) {
        return (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarSkeleton, {});
    }
    if (isError) {
        return (0, jsx_runtime_1.jsx)(fuselage_1.Callout, { children: t('Error') });
    }
    return (0, jsx_runtime_1.jsx)(EditTrigger_1.default, { triggerData: data.trigger });
};
exports.default = EditTriggerWithData;