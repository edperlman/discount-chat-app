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
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const useRecordList_1 = require("../../../hooks/lists/useRecordList");
const useAsyncState_1 = require("../../../hooks/useAsyncState");
const AutoCompleteAgent_1 = __importDefault(require("../../AutoCompleteAgent"));
const useDepartmentsList_1 = require("../hooks/useDepartmentsList");
const ForwardChatModal = (_a) => {
    var _b;
    var { onForward, onCancel, room } = _a, props = __rest(_a, ["onForward", "onCancel", "room"]);
    const { t } = (0, react_i18next_1.useTranslation)();
    const getUserData = (0, ui_contexts_1.useEndpoint)('GET', '/v1/users.info');
    const idleAgentsAllowedForForwarding = (0, ui_contexts_1.useSetting)('Livechat_enabled_when_agent_idle', true);
    const { getValues, handleSubmit, register, setFocus, setValue, watch, formState: { isSubmitting }, } = (0, react_hook_form_1.useForm)();
    (0, react_1.useEffect)(() => {
        setFocus('comment');
    }, [setFocus]);
    const department = watch('department');
    const username = watch('username');
    const [departmentsFilter, setDepartmentsFilter] = (0, react_1.useState)('');
    const debouncedDepartmentsFilter = (0, fuselage_hooks_1.useDebouncedValue)(departmentsFilter, 500);
    const { itemsList: departmentsList, loadMoreItems: loadMoreDepartments } = (0, useDepartmentsList_1.useDepartmentsList)((0, react_1.useMemo)(() => ({ filter: debouncedDepartmentsFilter, enabled: true }), [debouncedDepartmentsFilter]));
    const { phase: departmentsPhase, items: departments, itemCount: departmentsTotal } = (0, useRecordList_1.useRecordList)(departmentsList);
    const endReached = (0, react_1.useCallback)((start) => {
        if (departmentsPhase !== useAsyncState_1.AsyncStatePhase.LOADING) {
            loadMoreDepartments(start, Math.min(50, departmentsTotal));
        }
    }, [departmentsPhase, departmentsTotal, loadMoreDepartments]);
    const onSubmit = (0, react_1.useCallback)((_a) => __awaiter(void 0, [_a], void 0, function* ({ department: departmentId, username, comment }) {
        let uid;
        if (username) {
            const { user } = yield getUserData({ username });
            uid = user === null || user === void 0 ? void 0 : user._id;
        }
        yield onForward(departmentId, uid, comment);
    }), [getUserData, onForward]);
    (0, react_1.useEffect)(() => {
        register('department');
        register('username');
    }, [register]);
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Modal, Object.assign({ wrapperFunction: (props) => (0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({ is: 'form', onSubmit: handleSubmit(onSubmit) }, props)) }, props, { "data-qa-id": 'forward-chat-modal', children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Modal.Header, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Modal.Icon, { name: 'baloon-arrow-top-right' }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Title, { children: t('Forward_chat') }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Close, { onClick: onCancel })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Content, { fontScale: 'p2', children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldGroup, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('Forward_to_department') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.PaginatedSelectFiltered, { withTitle: false, filter: departmentsFilter, setFilter: setDepartmentsFilter, options: departments, maxWidth: '100%', placeholder: t('Select_an_option'), "data-qa-id": 'forward-to-department', onChange: (value) => {
                                            setValue('department', value);
                                        }, flexGrow: 1, endReached: endReached, renderItem: (_a) => {
                                            var { label } = _a, props = __rest(_a, ["label"]);
                                            return (0, jsx_runtime_1.jsx)(fuselage_1.Option, Object.assign({}, props, { label: (0, jsx_runtime_1.jsx)("span", { style: { whiteSpace: 'normal' }, children: label }) }));
                                        } }) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Divider, { p: 0, children: t('or') }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('Forward_to_user') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(AutoCompleteAgent_1.default, { withTitle: true, onlyAvailable: true, value: getValues().username, excludeId: (_b = room.servedBy) === null || _b === void 0 ? void 0 : _b._id, showIdleAgents: idleAgentsAllowedForForwarding, placeholder: t('Username_name_email'), onChange: (value) => {
                                            setValue('username', value);
                                        } }) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { marginBlock: 15, children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldLabel, { children: [t('Leave_a_comment'), ' ', (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { is: 'span', color: 'annotation', children: ["(", t('Optional'), ")"] })] }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextAreaInput, Object.assign({ "data-qa-id": 'ForwardChatModalTextAreaInputComment' }, register('comment'), { rows: 8, flexGrow: 1 })) })] })] }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Footer, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Modal.FooterControllers, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: onCancel, children: t('Cancel') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { type: 'submit', disabled: !username && !department, primary: true, loading: isSubmitting, children: t('Forward') })] }) })] })));
};
exports.default = ForwardChatModal;
