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
const react_1 = __importStar(require("react"));
const ModConsoleReportDetails_1 = __importDefault(require("./ModConsoleReportDetails"));
const ModerationConsoleTable_1 = __importDefault(require("./ModerationConsoleTable"));
const ModConsoleUsersTable_1 = __importDefault(require("./UserReports/ModConsoleUsersTable"));
const Page_1 = require("../../../components/Page");
const getPermaLink_1 = require("../../../lib/getPermaLink");
const ModerationConsolePage = ({ tab = 'messages', onSelectTab }) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const context = (0, ui_contexts_1.useRouteParameter)('context');
    const id = (0, ui_contexts_1.useRouteParameter)('id');
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const handleRedirect = (0, react_1.useCallback)((mid) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const permalink = yield (0, getPermaLink_1.getPermaLink)(mid);
            window.open(permalink, '_self');
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
    }), [dispatchToastMessage]);
    const handleTabClick = (0, react_1.useCallback)((tab) => (onSelectTab ? () => onSelectTab(tab) : undefined), [onSelectTab]);
    return ((0, jsx_runtime_1.jsxs)(Page_1.Page, { flexDirection: 'row', children: [(0, jsx_runtime_1.jsxs)(Page_1.Page, { children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: t('Moderation') }), (0, jsx_runtime_1.jsxs)(fuselage_1.Tabs, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.TabsItem, { selected: tab === 'messages', onClick: handleTabClick('messages'), children: t('Reported_Messages') }), (0, jsx_runtime_1.jsx)(fuselage_1.TabsItem, { selected: tab === 'users', onClick: handleTabClick('users'), children: t('Reported_Users') })] }), (0, jsx_runtime_1.jsxs)(Page_1.PageContent, { children: [tab === 'messages' && (0, jsx_runtime_1.jsx)(ModerationConsoleTable_1.default, {}), tab === 'users' && (0, jsx_runtime_1.jsx)(ModConsoleUsersTable_1.default, {})] })] }), context === 'info' && id && (0, jsx_runtime_1.jsx)(ModConsoleReportDetails_1.default, { userId: id, onRedirect: handleRedirect, default: tab })] }));
};
exports.default = ModerationConsolePage;
