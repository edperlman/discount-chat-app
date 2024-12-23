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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const AccountTokensRow_1 = __importDefault(require("./AccountTokensRow"));
const AddToken_1 = __importDefault(require("./AddToken"));
const GenericModal_1 = __importDefault(require("../../../../components/GenericModal"));
const GenericNoResults_1 = __importDefault(require("../../../../components/GenericNoResults"));
const GenericTable_1 = require("../../../../components/GenericTable");
const usePagination_1 = require("../../../../components/GenericTable/hooks/usePagination");
const useEndpointData_1 = require("../../../../hooks/useEndpointData");
const useResizeInlineBreakpoint_1 = require("../../../../hooks/useResizeInlineBreakpoint");
const asyncState_1 = require("../../../../lib/asyncState");
const AccountTokensTable = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const userId = (0, ui_contexts_1.useUserId)();
    const regenerateToken = (0, ui_contexts_1.useMethod)('personalAccessTokens:regenerateToken');
    const removeToken = (0, ui_contexts_1.useMethod)('personalAccessTokens:removeToken');
    const { value: data, phase, error, reload } = (0, useEndpointData_1.useEndpointData)('/v1/users.getPersonalAccessTokens');
    const [ref, isMedium] = (0, useResizeInlineBreakpoint_1.useResizeInlineBreakpoint)([600], 200);
    const _a = (0, usePagination_1.usePagination)(), { current, itemsPerPage, setItemsPerPage: onSetItemsPerPage, setCurrent: onSetCurrent } = _a, paginationProps = __rest(_a, ["current", "itemsPerPage", "setItemsPerPage", "setCurrent"]);
    const filteredTokens = (0, react_1.useMemo)(() => {
        if (!(data === null || data === void 0 ? void 0 : data.tokens)) {
            return null;
        }
        const sliceStart = current > (data === null || data === void 0 ? void 0 : data.tokens.length) ? (data === null || data === void 0 ? void 0 : data.tokens.length) - itemsPerPage : current;
        return data === null || data === void 0 ? void 0 : data.tokens.slice(sliceStart, sliceStart + itemsPerPage);
    }, [current, data === null || data === void 0 ? void 0 : data.tokens, itemsPerPage]);
    const closeModal = (0, react_1.useCallback)(() => setModal(null), [setModal]);
    const headers = (0, react_1.useMemo)(() => [
        (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { children: t('API_Personal_Access_Token_Name') }, 'name'),
        isMedium && (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { children: t('Created_at') }, 'createdAt'),
        (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { children: t('Last_token_part') }, 'lastTokenPart'),
        (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { children: t('Two Factor Authentication') }, '2fa'),
        (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, {}, 'actions'),
    ].filter(Boolean), [isMedium, t]);
    const handleRegenerate = (0, react_1.useCallback)((name) => {
        const onConfirm = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                setModal(null);
                const token = yield regenerateToken({ tokenName: name });
                setModal((0, jsx_runtime_1.jsx)(GenericModal_1.default, { title: t('API_Personal_Access_Token_Generated'), onConfirm: closeModal, children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { dangerouslySetInnerHTML: {
                            __html: t('API_Personal_Access_Token_Generated_Text_Token_s_UserId_s', {
                                token,
                                userId,
                            }),
                        } }) }));
                reload();
            }
            catch (error) {
                setModal(null);
                dispatchToastMessage({ type: 'error', message: error });
            }
        });
        setModal((0, jsx_runtime_1.jsx)(GenericModal_1.default, { variant: 'warning', confirmText: t('API_Personal_Access_Tokens_Regenerate_It'), onConfirm: onConfirm, onCancel: closeModal, onClose: closeModal, children: t('API_Personal_Access_Tokens_Regenerate_Modal') }));
    }, [closeModal, dispatchToastMessage, regenerateToken, reload, setModal, t, userId]);
    const handleRemove = (0, react_1.useCallback)((name) => {
        const onConfirm = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield removeToken({ tokenName: name });
                dispatchToastMessage({ type: 'success', message: t('Token_has_been_removed') });
                reload();
                closeModal();
            }
            catch (error) {
                dispatchToastMessage({ type: 'error', message: error });
            }
        });
        setModal((0, jsx_runtime_1.jsx)(GenericModal_1.default, { variant: 'danger', confirmText: t('Remove'), onConfirm: onConfirm, onCancel: closeModal, onClose: closeModal, children: t('API_Personal_Access_Tokens_Remove_Modal') }));
    }, [closeModal, dispatchToastMessage, reload, removeToken, setModal, t]);
    if (phase === asyncState_1.AsyncStatePhase.REJECTED) {
        return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', children: (0, jsx_runtime_1.jsxs)(fuselage_1.States, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.StatesIcon, { name: 'warning', variation: 'danger' }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesTitle, { children: t('Something_went_wrong') }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesSubtitle, { children: t('We_Could_not_retrive_any_data') }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesSubtitle, { children: error === null || error === void 0 ? void 0 : error.message }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesActions, { children: (0, jsx_runtime_1.jsx)(fuselage_1.StatesAction, { onClick: reload, children: t('Retry') }) })] }) }));
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(AddToken_1.default, { reload: reload }), phase === asyncState_1.AsyncStatePhase.LOADING && ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTable, { "aria-busy": true, children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeader, { children: headers }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableBody, { children: phase === asyncState_1.AsyncStatePhase.LOADING && (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableLoadingTable, { headerCells: 5 }) })] })), filteredTokens && (filteredTokens === null || filteredTokens === void 0 ? void 0 : filteredTokens.length) > 0 && phase === asyncState_1.AsyncStatePhase.RESOLVED && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTable, { ref: ref, children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeader, { children: headers }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableBody, { children: phase === asyncState_1.AsyncStatePhase.RESOLVED &&
                                    filteredTokens &&
                                    filteredTokens.map((filteredToken) => ((0, jsx_runtime_1.jsx)(AccountTokensRow_1.default, Object.assign({ onRegenerate: handleRegenerate, onRemove: handleRemove, isMedium: isMedium }, filteredToken), filteredToken.createdAt))) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Pagination, Object.assign({ divider: true, current: current, itemsPerPage: itemsPerPage, count: (data === null || data === void 0 ? void 0 : data.tokens.length) || 0, onSetItemsPerPage: onSetItemsPerPage, onSetCurrent: onSetCurrent }, paginationProps))] })), phase === asyncState_1.AsyncStatePhase.RESOLVED && (filteredTokens === null || filteredTokens === void 0 ? void 0 : filteredTokens.length) === 0 && (0, jsx_runtime_1.jsx)(GenericNoResults_1.default, {})] }));
};
exports.default = AccountTokensTable;
