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
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const UserContextFooter_1 = __importDefault(require("./UserContextFooter"));
const Contextualbar_1 = require("../../../../components/Contextualbar");
const GenericNoResults_1 = __importDefault(require("../../../../components/GenericNoResults"));
const UserCard_1 = require("../../../../components/UserCard");
const useFormatDate_1 = require("../../../../hooks/useFormatDate");
const ReportReason_1 = __importDefault(require("../helpers/ReportReason"));
const UserColumn_1 = __importDefault(require("../helpers/UserColumn"));
const UserReportInfo = ({ userId }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const getUserReports = (0, ui_contexts_1.useEndpoint)('GET', '/v1/moderation.user.reportsByUserId');
    const formatDateAndTime = (0, useFormatDate_1.useFormatDate)();
    const { data: report, refetch: reloadUsersReports, isLoading, isSuccess, isError, dataUpdatedAt, } = (0, react_query_1.useQuery)(['moderation', 'userReports', 'fetchDetails', userId], () => __awaiter(void 0, void 0, void 0, function* () { return getUserReports({ userId }); }));
    const userProfile = (0, react_1.useMemo)(() => {
        if (!(report === null || report === void 0 ? void 0 : report.user)) {
            return null;
        }
        const { username, name } = report.user;
        return (0, jsx_runtime_1.jsx)(UserColumn_1.default, { username: username, name: name, fontSize: 'p2', size: 'x48' }, dataUpdatedAt);
    }, [report === null || report === void 0 ? void 0 : report.user, dataUpdatedAt]);
    const userEmails = (0, react_1.useMemo)(() => {
        var _a;
        if (!((_a = report === null || report === void 0 ? void 0 : report.user) === null || _a === void 0 ? void 0 : _a.emails)) {
            return [];
        }
        return report.user.emails.map((email) => email.address);
    }, [report]);
    if (isError) {
        return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'column', alignItems: 'center', pb: 20, color: 'default', children: [(0, jsx_runtime_1.jsx)(fuselage_1.StatesIcon, { name: 'warning', variation: 'danger' }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesTitle, { children: t('Something_went_wrong') }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesActions, { children: (0, jsx_runtime_1.jsx)(fuselage_1.StatesAction, { onClick: () => reloadUsersReports(), children: t('Reload_page') }) })] }));
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarScrollableContent, { children: [isLoading && (0, jsx_runtime_1.jsx)(fuselage_1.ContextualbarSkeleton, {}), isSuccess && report.reports.length > 0 && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [report.user ? ((0, jsx_runtime_1.jsxs)(fuselage_1.FieldGroup, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: userProfile }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('Roles') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { justifyContent: 'flex-start', spacing: 1, children: report.user.roles.map((role, index) => ((0, jsx_runtime_1.jsx)(UserCard_1.UserCardRole, { children: role }, index))) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('Email') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: userEmails.join(', ') })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('Created_at') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: formatDateAndTime(report.user.createdAt) })] })] })) : ((0, jsx_runtime_1.jsx)(fuselage_1.Callout, { mbs: 8, type: 'warning', icon: 'warning', children: t('Moderation_User_deleted_warning') })), report.reports.map((report, ind) => {
                                var _a;
                                return ((0, jsx_runtime_1.jsx)(ReportReason_1.default, { ind: ind + 1, uinfo: (_a = report.reportedBy) === null || _a === void 0 ? void 0 : _a.username, msg: report.description, ts: new Date(report.ts) }, ind));
                            })] })), isSuccess && report.reports.length === 0 && (0, jsx_runtime_1.jsx)(GenericNoResults_1.default, { title: t('No_user_reports'), icon: 'user' })] }), isSuccess && report.reports.length > 0 && ((0, jsx_runtime_1.jsx)(fuselage_1.ContextualbarFooter, { children: (0, jsx_runtime_1.jsx)(UserContextFooter_1.default, { userId: userId, deleted: !report.user }) }))] }));
};
exports.default = UserReportInfo;
