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
const RemoveDepartmentModal_1 = __importDefault(require("./RemoveDepartmentModal"));
const ARCHIVE_DEPARTMENT_ENDPOINTS = {
    archive: '/v1/livechat/department/:_id/archive',
    unarchive: '/v1/livechat/department/:_id/unarchive',
};
const DepartmentItemMenu = ({ department, archived }) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const queryClient = (0, react_query_1.useQueryClient)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const route = (0, ui_contexts_1.useRoute)('omnichannel-departments');
    const departmentRemovalEnabled = (0, ui_contexts_1.useSetting)('Omnichannel_enable_department_removal');
    const { _id, name } = department;
    const toggleArchive = (0, ui_contexts_1.useEndpoint)('POST', archived ? ARCHIVE_DEPARTMENT_ENDPOINTS.unarchive : ARCHIVE_DEPARTMENT_ENDPOINTS.archive, {
        _id,
    });
    const handleEdit = (0, fuselage_hooks_1.useMutableCallback)(() => {
        route.push({ context: 'edit', id: _id });
    });
    const handleReload = (0, react_1.useCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield queryClient.invalidateQueries(['livechat-departments']);
    }), [queryClient]);
    const handleToggleArchive = (0, fuselage_hooks_1.useMutableCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield toggleArchive();
            dispatchToastMessage({ type: 'success', message: archived ? t('Department_unarchived') : t('Department_archived') });
            queryClient.removeQueries(['/v1/livechat/department/:_id', department._id]);
            handleReload();
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
    }));
    const handlePermanentDepartmentRemoval = (0, fuselage_hooks_1.useMutableCallback)(() => {
        setModal((0, jsx_runtime_1.jsx)(RemoveDepartmentModal_1.default, { _id: _id, reset: handleReload, onClose: () => setModal(null), name: name }));
    });
    const menuOptions = Object.assign(Object.assign({}, (!archived && {
        edit: {
            label: ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'edit', size: 'x16', mie: 4 }), t('Edit')] })),
            action: () => handleEdit(),
        },
    })), { [archived ? 'unarchive' : 'archive']: {
            label: ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: archived ? 'undo' : 'arrow-down-box', size: 'x16', mie: 4 }), archived ? t('Unarchive') : t('Archive')] })),
            action: () => handleToggleArchive(),
        }, delete: {
            label: ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { "data-tooltip": !departmentRemovalEnabled ? t('Department_Removal_Disabled') : undefined, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'trash', size: 'x16', mie: 4 }), t('Delete')] })),
            action: () => handlePermanentDepartmentRemoval(),
            disabled: !departmentRemovalEnabled,
        } });
    return (0, jsx_runtime_1.jsx)(fuselage_1.Menu, { options: menuOptions });
};
exports.default = DepartmentItemMenu;
