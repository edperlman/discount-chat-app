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
const moment_1 = __importDefault(require("moment"));
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const AutoCompleteAgent_1 = __importDefault(require("../../../components/AutoCompleteAgent"));
const AutoCompleteDepartment_1 = __importDefault(require("../../../components/AutoCompleteDepartment"));
const GenericModal_1 = __importDefault(require("../../../components/GenericModal"));
const additionalForms_1 = require("../additionalForms");
const Label_1 = __importDefault(require("./Label"));
const RemoveAllClosed_1 = __importDefault(require("./RemoveAllClosed"));
const FilterByText = (_a) => {
    var { setFilter, reload, customFields, setCustomFields, hasCustomFields } = _a, props = __rest(_a, ["setFilter", "reload", "customFields", "setCustomFields", "hasCustomFields"]);
    const setModal = (0, ui_contexts_1.useSetModal)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const statusOptions = [
        ['all', t('All')],
        ['closed', t('Closed')],
        ['opened', t('Room_Status_Open')],
        ['onhold', t('On_Hold_Chats')],
        ['queued', t('Queued')],
    ];
    const [guest, setGuest] = (0, fuselage_hooks_1.useLocalStorage)('guest', '');
    const [servedBy, setServedBy] = (0, fuselage_hooks_1.useLocalStorage)('servedBy', 'all');
    const [status, setStatus] = (0, fuselage_hooks_1.useLocalStorage)('status', 'all');
    const [department, setDepartment] = (0, fuselage_hooks_1.useLocalStorage)('department', 'all');
    const [from, setFrom] = (0, fuselage_hooks_1.useLocalStorage)('from', '');
    const [to, setTo] = (0, fuselage_hooks_1.useLocalStorage)('to', '');
    const [tags, setTags] = (0, fuselage_hooks_1.useLocalStorage)('tags', []);
    const handleGuest = (0, fuselage_hooks_1.useMutableCallback)((e) => setGuest(e.target.value));
    const handleServedBy = (0, fuselage_hooks_1.useMutableCallback)((e) => setServedBy(e));
    const handleStatus = (0, fuselage_hooks_1.useMutableCallback)((e) => setStatus(e));
    const handleDepartment = (0, fuselage_hooks_1.useMutableCallback)((e) => setDepartment(e));
    const handleFrom = (0, fuselage_hooks_1.useMutableCallback)((e) => setFrom(e.target.value));
    const handleTo = (0, fuselage_hooks_1.useMutableCallback)((e) => setTo(e.target.value));
    const handleTags = (0, fuselage_hooks_1.useMutableCallback)((e) => setTags(e));
    const reset = (0, fuselage_hooks_1.useMutableCallback)(() => {
        setGuest('');
        setServedBy('all');
        setStatus('all');
        setDepartment('all');
        setFrom('');
        setTo('');
        setTags([]);
        setCustomFields(undefined);
    });
    const onSubmit = (0, fuselage_hooks_1.useMutableCallback)((e) => e.preventDefault());
    (0, react_1.useEffect)(() => {
        setFilter((data) => (Object.assign(Object.assign({}, data), { guest,
            servedBy,
            status, department: department && department !== 'all' ? department : '', from: from && (0, moment_1.default)(new Date(from)).utc().format('YYYY-MM-DDTHH:mm:ss'), to: to && (0, moment_1.default)(new Date(to)).utc().format('YYYY-MM-DDTHH:mm:ss'), tags: tags.map((tag) => tag.label), customFields })));
    }, [setFilter, guest, servedBy, status, department, from, to, tags, customFields]);
    const handleClearFilters = (0, fuselage_hooks_1.useMutableCallback)(() => {
        reset();
    });
    const removeClosedChats = (0, ui_contexts_1.useMethod)('livechat:removeAllClosedRooms');
    const handleRemoveClosed = (0, fuselage_hooks_1.useMutableCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        const onDeleteAll = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield removeClosedChats();
                reload === null || reload === void 0 ? void 0 : reload();
                dispatchToastMessage({ type: 'success', message: t('Chat_removed') });
            }
            catch (error) {
                dispatchToastMessage({ type: 'error', message: error });
            }
            setModal(null);
        });
        const handleClose = () => {
            setModal(null);
        };
        setModal((0, jsx_runtime_1.jsx)(GenericModal_1.default, { variant: 'danger', "data-qa-id": 'current-chats-modal-remove-all-closed', onConfirm: onDeleteAll, onClose: handleClose, onCancel: handleClose, confirmText: t('Delete') }));
    }));
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, Object.assign({ mb: 16, is: 'form', onSubmit: onSubmit, display: 'flex', flexDirection: 'column' }, props, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, Object.assign({ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }, props, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', mie: 8, flexGrow: 1, flexDirection: 'column', children: [(0, jsx_runtime_1.jsx)(Label_1.default, { mb: 4, children: t('Guest') }), (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, { placeholder: t('Guest'), onChange: handleGuest, value: guest, "data-qa": 'current-chats-guest' })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', mie: 8, flexGrow: 1, flexDirection: 'column', "data-qa": 'current-chats-servedBy', children: [(0, jsx_runtime_1.jsx)(Label_1.default, { mb: 4, children: t('Served_By') }), (0, jsx_runtime_1.jsx)(AutoCompleteAgent_1.default, { haveAll: true, value: servedBy, onChange: handleServedBy })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', mie: 8, flexGrow: 1, flexDirection: 'column', children: [(0, jsx_runtime_1.jsx)(Label_1.default, { mb: 4, id: 'current-chats-status', children: t('Status') }), (0, jsx_runtime_1.jsx)(fuselage_1.Select, { options: statusOptions, value: status, onChange: handleStatus, placeholder: t('Status'), "aria-labelledby": 'current-chats-status', "data-qa": 'current-chats-status' })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', mie: 8, flexGrow: 0, flexDirection: 'column', children: [(0, jsx_runtime_1.jsx)(Label_1.default, { mb: 4, children: t('From') }), (0, jsx_runtime_1.jsx)(fuselage_1.InputBox, { type: 'date', placeholder: t('From'), onChange: handleFrom, value: from, "data-qa": 'current-chats-from', color: 'default' })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', mie: 8, flexGrow: 0, flexDirection: 'column', children: [(0, jsx_runtime_1.jsx)(Label_1.default, { mb: 4, children: t('To') }), (0, jsx_runtime_1.jsx)(fuselage_1.InputBox, { type: 'date', placeholder: t('To'), onChange: handleTo, value: to, "data-qa": 'current-chats-to', color: 'default' })] }), (0, jsx_runtime_1.jsx)(RemoveAllClosed_1.default, { handleClearFilters: handleClearFilters, handleRemoveClosed: handleRemoveClosed, hasCustomFields: hasCustomFields })] })), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', marginBlockStart: 8, flexGrow: 1, flexDirection: 'column', children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', mie: 8, flexGrow: 1, flexDirection: 'column', children: [(0, jsx_runtime_1.jsx)(Label_1.default, { mb: 4, children: t('Department') }), (0, jsx_runtime_1.jsx)(AutoCompleteDepartment_1.default, { haveAll: true, showArchived: true, value: department, onChange: handleDepartment, onlyMyDepartments: true })] }) }), additionalForms_1.CurrentChatTags && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({ display: 'flex', flexDirection: 'row', marginBlockStart: 8 }, props, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', mie: 8, flexGrow: 1, flexDirection: 'column', "data-qa": 'current-chats-tags', children: [(0, jsx_runtime_1.jsx)(Label_1.default, { mb: 4, children: t('Tags') }), (0, jsx_runtime_1.jsx)(additionalForms_1.CurrentChatTags, { value: tags, handler: handleTags, viewAll: true })] }) })))] })));
};
exports.default = FilterByText;
