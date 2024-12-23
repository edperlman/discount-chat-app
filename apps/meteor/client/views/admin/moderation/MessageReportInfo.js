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
const ReportReason_1 = __importDefault(require("./helpers/ReportReason"));
const MessageReportInfo = ({ msgId }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const getReportsByMessage = (0, ui_contexts_1.useEndpoint)('GET', `/v1/moderation.reports`);
    const useRealName = (0, ui_contexts_1.useSetting)('UI_Use_Real_Name', false);
    const { data: reportsByMessage, isLoading: isLoadingReportsByMessage, isSuccess: isSuccessReportsByMessage, isError: isErrorReportsByMessage, } = (0, react_query_1.useQuery)(['moderation', 'msgReports', 'fetchReasons', { msgId }], () => __awaiter(void 0, void 0, void 0, function* () {
        const reports = yield getReportsByMessage({ msgId });
        return reports;
    }), {
        onError: (error) => {
            dispatchToastMessage({ type: 'error', message: error });
        },
    });
    if (isLoadingReportsByMessage) {
        return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', flexDirection: 'column', width: 'full', height: 'full', overflow: 'hidden', children: (0, jsx_runtime_1.jsx)(fuselage_1.Message, { children: t('Loading') }) }));
    }
    if (isErrorReportsByMessage) {
        return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', flexDirection: 'column', width: 'full', height: 'full', overflow: 'hidden', children: (0, jsx_runtime_1.jsx)(fuselage_1.Message, { children: t('Error') }) }));
    }
    const { reports } = reportsByMessage;
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: isSuccessReportsByMessage && (reportsByMessage === null || reportsByMessage === void 0 ? void 0 : reportsByMessage.reports) && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', flexDirection: 'column', width: 'full', height: 'full', overflowX: 'hidden', overflowY: 'auto', children: reports.map((report, index) => {
                var _a, _b;
                return ((0, jsx_runtime_1.jsx)(ReportReason_1.default, { ind: index + 1, uinfo: useRealName ? (_a = report.reportedBy) === null || _a === void 0 ? void 0 : _a.name : (_b = report.reportedBy) === null || _b === void 0 ? void 0 : _b.username, msg: report.description, ts: new Date(report.ts) }, report._id));
            }) })) }));
};
exports.default = MessageReportInfo;
