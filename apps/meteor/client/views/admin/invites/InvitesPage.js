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
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const InviteRow_1 = __importDefault(require("./InviteRow"));
const GenericModal_1 = __importDefault(require("../../../components/GenericModal"));
const GenericNoResults_1 = __importDefault(require("../../../components/GenericNoResults"));
const GenericTable_1 = require("../../../components/GenericTable");
const Page_1 = require("../../../components/Page");
const InvitesPage = () => {
    const t = (0, ui_contexts_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const getInvites = (0, ui_contexts_1.useEndpoint)('GET', '/v1/listInvites');
    const { data, isLoading, refetch, isSuccess, isError } = (0, react_query_1.useQuery)(['invites'], () => __awaiter(void 0, void 0, void 0, function* () {
        const invites = yield getInvites();
        return invites;
    }), {
        onError: (error) => {
            dispatchToastMessage({ type: 'error', message: error });
        },
    });
    const onRemove = (removeInvite) => {
        const confirmRemove = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield removeInvite();
                dispatchToastMessage({ type: 'success', message: t('Invite_removed') });
                refetch();
            }
            catch (error) {
                if (typeof error === 'string' || error instanceof Error) {
                    dispatchToastMessage({ type: 'error', message: error });
                }
            }
            finally {
                setModal();
            }
        });
        setModal((0, jsx_runtime_1.jsx)(GenericModal_1.default, { title: t('Are_you_sure'), children: t('Are_you_sure_you_want_to_delete_this_record'), variant: 'danger', confirmText: t('Yes'), cancelText: t('No'), onClose: () => setModal(), onCancel: () => setModal(), onConfirm: confirmRemove }));
    };
    const notSmall = (0, fuselage_hooks_1.useMediaQuery)('(min-width: 768px)');
    const headers = (0, react_1.useMemo)(() => ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { w: notSmall ? '20%' : '80%', children: t('Token') }), notSmall && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { w: '35%', children: t('Created_at') }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { w: '20%', children: t('Expiration') }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { w: '10%', children: t('Uses') }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { w: '10%', children: t('Uses_left') }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, {})] }))] })), [notSmall, t]);
    return ((0, jsx_runtime_1.jsxs)(Page_1.Page, { children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: t('Invites') }), (0, jsx_runtime_1.jsx)(Page_1.PageContent, { children: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [isLoading && ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTable, { children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeader, { children: headers }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableBody, { children: (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableLoadingTable, { headerCells: 4 }) })] })), isSuccess && data && data.length > 0 && ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTable, { children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeader, { children: headers }), (0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTableBody, { children: [isLoading && (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableLoadingTable, { headerCells: notSmall ? 4 : 1 }), data.map((invite) => ((0, jsx_runtime_1.jsx)(InviteRow_1.default, Object.assign({}, invite, { onRemove: onRemove }), invite._id)))] })] })), isSuccess && data && data.length === 0 && (0, jsx_runtime_1.jsx)(GenericNoResults_1.default, {}), isError && ((0, jsx_runtime_1.jsxs)(fuselage_1.States, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.StatesIcon, { name: 'warning', variation: 'danger' }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesTitle, { children: t('Something_went_wrong') }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesActions, { children: (0, jsx_runtime_1.jsx)(fuselage_1.StatesAction, { onClick: () => refetch(), children: t('Reload_page') }) })] }))] }) })] }));
};
exports.default = InvitesPage;
