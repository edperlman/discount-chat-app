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
exports.PrioritiesPage = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const PrioritiesResetModal_1 = require("./PrioritiesResetModal");
const PrioritiesTable_1 = require("./PrioritiesTable");
const PriorityList_1 = __importDefault(require("./PriorityList"));
const Page_1 = require("../../components/Page");
const useOmnichannelPriorities_1 = require("../hooks/useOmnichannelPriorities");
const PrioritiesPage = ({ priorityId, context }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const queryClient = (0, react_query_1.useQueryClient)();
    const prioritiesRoute = (0, ui_contexts_1.useRoute)('omnichannel-priorities');
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const [isResetting, setResetting] = (0, react_1.useState)(false);
    const savePriority = (0, ui_contexts_1.useEndpoint)('PUT', `/v1/livechat/priorities/:priorityId`, { priorityId });
    const resetPriorities = (0, ui_contexts_1.useEndpoint)('POST', '/v1/livechat/priorities.reset');
    const { data: priorities, isLoading } = (0, useOmnichannelPriorities_1.useOmnichannelPriorities)();
    const isPrioritiesDirty = (0, react_1.useMemo)(() => !!priorities.length && priorities.some((p) => p.dirty), [priorities]);
    const handleReset = () => {
        const onReset = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                setResetting(true);
                setModal(null);
                yield resetPriorities();
                yield queryClient.invalidateQueries(['/v1/livechat/priorities'], { exact: true });
                prioritiesRoute.push({});
                dispatchToastMessage({ type: 'success', message: t('Priorities_restored') });
            }
            catch (error) {
                dispatchToastMessage({ type: 'error', message: error });
            }
            finally {
                setResetting(false);
            }
        });
        setModal((0, jsx_runtime_1.jsx)(PrioritiesResetModal_1.PrioritiesResetModal, { onReset: onReset, onCancel: () => setModal(null) }));
    };
    const onRowClick = (0, fuselage_hooks_1.useMutableCallback)((id) => {
        prioritiesRoute.push({ context: 'edit', id });
    });
    const onContextualbarClose = () => {
        prioritiesRoute.push({});
    };
    const onSavePriority = (_a) => __awaiter(void 0, void 0, void 0, function* () {
        var { reset } = _a, payload = __rest(_a, ["reset"]);
        yield savePriority(reset ? { reset } : payload);
        yield queryClient.invalidateQueries(['/v1/livechat/priorities']);
        dispatchToastMessage({ type: 'success', message: t('Priority_saved') });
        yield queryClient.invalidateQueries(['/v1/livechat/priorities'], { exact: true });
        prioritiesRoute.push({});
    });
    return ((0, jsx_runtime_1.jsxs)(Page_1.Page, { flexDirection: 'row', children: [(0, jsx_runtime_1.jsxs)(Page_1.Page, { children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: t('Priorities'), children: (0, jsx_runtime_1.jsx)(fuselage_1.ButtonGroup, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: handleReset, title: t('Reset'), disabled: !isPrioritiesDirty, loading: isResetting, children: t('Reset') }) }) }), (0, jsx_runtime_1.jsx)(Page_1.PageContent, { children: (0, jsx_runtime_1.jsx)(PrioritiesTable_1.PrioritiesTable, { priorities: priorities, isLoading: isLoading, onRowClick: onRowClick }) })] }), context === 'edit' && ((0, jsx_runtime_1.jsx)(PriorityList_1.default, { priorityId: priorityId, context: context, onSave: onSavePriority, onClose: onContextualbarClose }))] }));
};
exports.PrioritiesPage = PrioritiesPage;