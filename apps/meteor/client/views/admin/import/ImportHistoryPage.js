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
const ImportOperationSummary_1 = __importDefault(require("./ImportOperationSummary"));
const ImportOperationSummarySkeleton_1 = __importDefault(require("./ImportOperationSummarySkeleton"));
const ImporterProgressStep_1 = require("../../../../app/importer/lib/ImporterProgressStep");
const Page_1 = require("../../../components/Page");
// TODO: review inner logic
function ImportHistoryPage() {
    var _a;
    const queryClient = (0, react_query_1.useQueryClient)();
    const t = (0, ui_contexts_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const downloadPendingFiles = (0, ui_contexts_1.useEndpoint)('POST', '/v1/downloadPendingFiles');
    const downloadPendingAvatars = (0, ui_contexts_1.useEndpoint)('POST', '/v1/downloadPendingAvatars');
    const getCurrentImportOperation = (0, ui_contexts_1.useEndpoint)('GET', '/v1/getCurrentImportOperation');
    const getLatestImportOperations = (0, ui_contexts_1.useEndpoint)('GET', '/v1/getLatestImportOperations');
    const router = (0, ui_contexts_1.useRouter)();
    const currentOperation = (0, react_query_1.useQuery)(['ImportHistoryPage', 'currentOperation'], () => __awaiter(this, void 0, void 0, function* () {
        const { operation = { valid: false } } = yield getCurrentImportOperation();
        return operation;
    }), {
        onError: () => dispatchToastMessage({ type: 'error', message: t('Failed_To_Load_Import_Operation') }),
    });
    const latestOperations = (0, react_query_1.useQuery)(['ImportHistoryPage', 'latestOperations'], () => __awaiter(this, void 0, void 0, function* () {
        const operations = yield getLatestImportOperations();
        return operations;
    }), {
        onError: () => dispatchToastMessage({ type: 'error', message: t('Failed_To_Load_Import_History') }),
    });
    const isLoading = currentOperation.isLoading || latestOperations.isLoading;
    const hasAnySuccessfulImport = (0, react_1.useMemo)(() => {
        return latestOperations.isSuccess && latestOperations.data.some(({ status }) => status === ImporterProgressStep_1.ProgressStep.DONE);
    }, [latestOperations.isSuccess, latestOperations.data]);
    const handleNewImportClick = () => {
        router.navigate('/admin/import/new');
    };
    const downloadPendingFilesResult = (0, react_query_1.useMutation)({
        mutationFn: () => __awaiter(this, void 0, void 0, function* () { return downloadPendingFiles(); }),
        onError: (error) => {
            console.error(error);
            dispatchToastMessage({ type: 'error', message: t('Failed_To_Download_Files') });
        },
        onSuccess: ({ count }) => {
            queryClient.invalidateQueries(['ImportHistoryPage', 'currentOperation']);
            queryClient.invalidateQueries(['ImportHistoryPage', 'latestOperations']);
            if (!count) {
                dispatchToastMessage({ type: 'info', message: t('No_files_left_to_download') });
                return;
            }
            dispatchToastMessage({ type: 'info', message: t('File_Downloads_Started') });
            router.navigate('/admin/import/progress');
        },
    });
    const downloadPendingAvatarsResult = (0, react_query_1.useMutation)({
        mutationFn: () => __awaiter(this, void 0, void 0, function* () { return downloadPendingAvatars(); }),
        onError: (error) => {
            console.error(error);
            dispatchToastMessage({ type: 'error', message: t('Failed_To_Download_Files') });
        },
        onSuccess: ({ count }) => {
            queryClient.invalidateQueries(['ImportHistoryPage', 'currentOperation']);
            queryClient.invalidateQueries(['ImportHistoryPage', 'latestOperations']);
            if (!count) {
                dispatchToastMessage({ type: 'info', message: t('No_files_left_to_download') });
                return;
            }
            dispatchToastMessage({ type: 'info', message: t('File_Downloads_Started') });
            router.navigate('/admin/import/progress');
        },
    });
    const small = (0, fuselage_hooks_1.useMediaQuery)('(max-width: 768px)');
    return ((0, jsx_runtime_1.jsxs)(Page_1.Page, { children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: t('Import'), children: (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, disabled: isLoading, onClick: handleNewImportClick, children: t('Import_New_File') }), hasAnySuccessfulImport && ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { loading: downloadPendingFilesResult.isLoading, disabled: downloadPendingAvatarsResult.isLoading, onClick: () => downloadPendingFilesResult.mutate(), children: t('Download_Pending_Files') })), hasAnySuccessfulImport && ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { loading: downloadPendingAvatarsResult.isLoading, disabled: downloadPendingFilesResult.isLoading, onClick: () => downloadPendingAvatarsResult.mutate(), children: t('Download_Pending_Avatars') }))] }) }), (0, jsx_runtime_1.jsx)(Page_1.PageScrollableContentWithShadow, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Table, { fixed: true, "data-qa-id": 'ImportTable', children: [(0, jsx_runtime_1.jsxs)(fuselage_1.TableHead, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.TableRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { is: 'th', rowSpan: 2, width: 'x140', children: t('Import_Type') }), (0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { is: 'th', rowSpan: 2, children: t('Last_Updated') }), !small && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { is: 'th', rowSpan: 2, children: t('Last_Status') }), (0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { is: 'th', rowSpan: 2, children: t('File') }), (0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { is: 'th', align: 'center', colSpan: 4, width: 'x320', children: t('Counters') })] }))] }), !small && ((0, jsx_runtime_1.jsxs)(fuselage_1.TableRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { is: 'th', align: 'center', children: t('Users') }), (0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { is: 'th', align: 'center', children: t('Contacts') }), (0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { is: 'th', align: 'center', children: t('Channels') }), (0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { is: 'th', align: 'center', children: t('Messages') }), (0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { is: 'th', align: 'center', children: t('Total') })] }))] }), (0, jsx_runtime_1.jsxs)(fuselage_1.TableBody, { children: [isLoading && ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: Array.from({ length: 20 }, (_, i) => ((0, jsx_runtime_1.jsx)(ImportOperationSummarySkeleton_1.default, { small: small }, i))) })), currentOperation.isSuccess && currentOperation.data.valid && ((0, jsx_runtime_1.jsx)(ImportOperationSummary_1.default, Object.assign({}, currentOperation.data, { small: small }))), currentOperation.isSuccess && latestOperations.isSuccess && ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (_a = latestOperations.data
                                        .filter(({ _id }) => !currentOperation.data.valid || currentOperation.data._id !== _id)) === null || _a === void 0 ? void 0 : _a.map((operation) => (0, jsx_runtime_1.jsx)(ImportOperationSummary_1.default, Object.assign({}, operation, { valid: false, small: small }), operation._id)) }))] })] }) })] }));
}
exports.default = ImportHistoryPage;
