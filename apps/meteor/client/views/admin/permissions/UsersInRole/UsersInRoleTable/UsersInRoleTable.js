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
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const UsersInRoleTableRow_1 = __importDefault(require("./UsersInRoleTableRow"));
const GenericError_1 = __importDefault(require("../../../../../components/GenericError"));
const GenericModal_1 = __importDefault(require("../../../../../components/GenericModal"));
const GenericNoResults_1 = __importDefault(require("../../../../../components/GenericNoResults"));
const GenericTable_1 = require("../../../../../components/GenericTable");
const usePagination_1 = require("../../../../../components/GenericTable/hooks/usePagination");
const UsersInRoleTable = ({ rid, roleId, roleName, description }) => {
    var _a;
    const { t } = (0, react_i18next_1.useTranslation)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const queryClient = (0, react_query_1.useQueryClient)();
    const getUsersInRoleEndpoint = (0, ui_contexts_1.useEndpoint)('GET', '/v1/roles.getUsersInRole');
    const removeUserFromRoleEndpoint = (0, ui_contexts_1.useEndpoint)('POST', '/v1/roles.removeUserFromRole');
    const _b = (0, usePagination_1.usePagination)(), { current, itemsPerPage, setItemsPerPage: onSetItemsPerPage, setCurrent: onSetCurrent } = _b, paginationProps = __rest(_b, ["current", "itemsPerPage", "setItemsPerPage", "setCurrent"]);
    const query = (0, react_1.useMemo)(() => (Object.assign(Object.assign(Object.assign({ role: roleId }, (rid && { roomId: rid })), (itemsPerPage && { count: itemsPerPage })), (current && { offset: current }))), [itemsPerPage, current, rid, roleId]);
    const { data, isLoading, isSuccess, refetch, isError } = (0, react_query_1.useQuery)(['getUsersInRole', roleId, query], () => __awaiter(void 0, void 0, void 0, function* () { return getUsersInRoleEndpoint(query); }));
    const users = ((_a = data === null || data === void 0 ? void 0 : data.users) === null || _a === void 0 ? void 0 : _a.map((user) => (Object.assign(Object.assign({}, user), { createdAt: new Date(user.createdAt), _updatedAt: new Date(user._updatedAt) })))) || [];
    const handleRemove = (0, fuselage_hooks_1.useEffectEvent)((username) => {
        const remove = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield removeUserFromRoleEndpoint({ roleId, username, scope: rid });
                dispatchToastMessage({ type: 'success', message: t('User_removed') });
                queryClient.invalidateQueries(['getUsersInRole']);
            }
            catch (error) {
                dispatchToastMessage({ type: 'error', message: error });
            }
            finally {
                setModal(null);
            }
        });
        setModal((0, jsx_runtime_1.jsx)(GenericModal_1.default, { variant: 'danger', onConfirm: remove, onCancel: () => setModal(null), confirmText: t('Delete'), children: t('The_user_s_will_be_removed_from_role_s', { postProcess: 'sprintf', sprintf: [username, description || roleName] }) }));
    });
    const headers = ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { children: t('Name') }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { children: t('Email') }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { w: 'x80' })] }));
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [isLoading && ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTable, { children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeader, { children: headers }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableBody, { children: (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableLoadingTable, { headerCells: 2 }) })] })), isSuccess && (users === null || users === void 0 ? void 0 : users.length) > 0 && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTable, { children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeader, { children: headers }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableBody, { children: users === null || users === void 0 ? void 0 : users.map((user) => (0, jsx_runtime_1.jsx)(UsersInRoleTableRow_1.default, { onRemove: handleRemove, user: user }, user === null || user === void 0 ? void 0 : user._id)) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Pagination, Object.assign({ divider: true, current: current, itemsPerPage: itemsPerPage, count: users.length || 0, onSetItemsPerPage: onSetItemsPerPage, onSetCurrent: onSetCurrent }, paginationProps))] })), (users === null || users === void 0 ? void 0 : users.length) === 0 && (0, jsx_runtime_1.jsx)(GenericNoResults_1.default, {}), isError && (0, jsx_runtime_1.jsx)(GenericError_1.default, { buttonAction: refetch })] }));
};
exports.default = UsersInRoleTable;
