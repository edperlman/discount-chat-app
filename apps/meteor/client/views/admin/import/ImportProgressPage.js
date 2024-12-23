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
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const useErrorHandler_1 = require("./useErrorHandler");
const ImporterProgressStep_1 = require("../../../../app/importer/lib/ImporterProgressStep");
const stringUtils_1 = require("../../../../lib/utils/stringUtils");
const Page_1 = require("../../../components/Page");
// TODO: review inner logic
const ImportProgressPage = function ImportProgressPage() {
    const queryClient = (0, react_query_1.useQueryClient)();
    const streamer = (0, ui_contexts_1.useStream)('importers');
    const { t, i18n } = (0, react_i18next_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const handleError = (0, useErrorHandler_1.useErrorHandler)();
    const router = (0, ui_contexts_1.useRouter)();
    const getCurrentImportOperation = (0, ui_contexts_1.useEndpoint)('GET', '/v1/getCurrentImportOperation');
    const getImportProgress = (0, ui_contexts_1.useEndpoint)('GET', '/v1/getImportProgress');
    const mutation = (0, react_query_1.useMutation)({
        mutationFn: (props) => __awaiter(this, void 0, void 0, function* () {
            queryClient.setQueryData(['importers', 'progress'], props);
        }),
    });
    const currentOperation = (0, react_query_1.useQuery)(['ImportProgressPage', 'currentOperation'], () => __awaiter(this, void 0, void 0, function* () {
        const { operation } = yield getCurrentImportOperation();
        return operation;
    }), {
        refetchInterval: 1000,
        onSuccess: ({ valid, status }) => {
            if (!valid) {
                router.navigate('/admin/import');
                return;
            }
            if (status === 'importer_done') {
                dispatchToastMessage({ type: 'success', message: t('Importer_done') });
                router.navigate('/admin/import');
                return;
            }
            if (!ImporterProgressStep_1.ImportingStartedStates.includes(status)) {
                router.navigate('/admin/import/prepare');
            }
        },
        onError: (error) => {
            handleError(error, t('Failed_To_Load_Import_Data'));
            router.navigate('/admin/import');
        },
    });
    const handleProgressUpdated = (0, fuselage_hooks_1.useMutableCallback)(({ key, step, completed, total }) => {
        if (!currentOperation.isSuccess) {
            return;
        }
        if (key.toLowerCase() !== currentOperation.data.importerKey.toLowerCase()) {
            return;
        }
        const message = step[0].toUpperCase() + step.slice(1);
        switch (step) {
            case 'importer_done':
                i18n.exists(message) &&
                    dispatchToastMessage({
                        type: 'success',
                        message: t(message),
                    });
                router.navigate('/admin/import');
                return;
            case 'importer_import_failed':
            case 'importer_import_cancelled':
                i18n.exists(message) && handleError(message);
                router.navigate('/admin/import');
                return;
            default:
                mutation.mutate({ step, completed, total });
                break;
        }
    });
    const progress = (0, react_query_1.useQuery)(['importers', 'progress'], () => __awaiter(this, void 0, void 0, function* () {
        const { key, step, count: { completed = 0, total = 0 } = {} } = yield getImportProgress();
        return {
            key,
            step,
            completed,
            total,
        };
    }), {
        enabled: !!currentOperation.isSuccess,
        onSuccess: (progress) => {
            if (!progress) {
                dispatchToastMessage({ type: 'warning', message: t('Importer_not_in_progress') });
                router.navigate('/admin/import/prepare');
                return;
            }
            // do not use the endpoint data to update the completed progress, leave it to the streamer
            if (!ImporterProgressStep_1.ImportingStartedStates.includes(progress.step)) {
                handleProgressUpdated({
                    key: progress.key,
                    step: progress.step,
                    total: progress.total,
                    completed: progress.completed,
                });
            }
        },
        onError: (error) => {
            handleError(error, t('Failed_To_Load_Import_Data'));
            router.navigate('/admin/import');
        },
    });
    (0, react_1.useEffect)(() => {
        return streamer('progress', (progress) => {
            // There shouldn't be any progress update sending only the rate at this point of the process
            if (!('rate' in progress)) {
                handleProgressUpdated({
                    key: progress.key,
                    step: progress.step,
                    completed: progress.count.completed,
                    total: progress.count.total,
                });
            }
        });
    }, [handleProgressUpdated, streamer]);
    return ((0, jsx_runtime_1.jsxs)(Page_1.Page, { children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: t('Importing_Data') }), (0, jsx_runtime_1.jsx)(Page_1.PageScrollableContentWithShadow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { marginInline: 'auto', marginBlock: 'neg-x24', width: 'full', maxWidth: 'x580', children: (0, jsx_runtime_1.jsxs)(fuselage_1.Margins, { block: 24, children: [currentOperation.isLoading && (0, jsx_runtime_1.jsx)(fuselage_1.Throbber, { justifyContent: 'center' }), progress.fetchStatus !== 'idle' && progress.isLoading && (0, jsx_runtime_1.jsx)(fuselage_1.Throbber, { justifyContent: 'center' }), (currentOperation.isError || progress.isError) && (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'p', children: t('Failed_To_Load_Import_Data') }), progress.isSuccess && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'p', fontScale: 'p2', children: t((progress.data.step[0].toUpperCase() + progress.data.step.slice(1))) }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', justifyContent: 'center', children: [(0, jsx_runtime_1.jsx)(fuselage_1.ProgressBar, { percentage: (progress.data.completed / progress.data.total) * 100 }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { is: 'span', fontScale: 'p2', mis: 24, children: [(0, stringUtils_1.numberFormat)((progress.data.completed / progress.data.total) * 100, 0), "%"] })] })] }))] }) }) })] }));
};
exports.default = ImportProgressPage;
