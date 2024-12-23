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
const Page_1 = require("../../../components/Page");
const useFormatMemorySize_1 = require("../../../hooks/useFormatMemorySize");
// TODO: review inner logic
function NewImportPage() {
    const { t } = (0, react_i18next_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const handleError = (0, useErrorHandler_1.useErrorHandler)();
    const [isLoading, setLoading] = (0, fuselage_hooks_1.useSafely)((0, react_1.useState)(false));
    const [fileType, setFileType] = (0, fuselage_hooks_1.useSafely)((0, react_1.useState)('upload'));
    const listImportersEndpoint = (0, ui_contexts_1.useEndpoint)('GET', '/v1/importers.list');
    const { data: importers, isLoading: isLoadingImporters } = (0, react_query_1.useQuery)(['importers'], () => __awaiter(this, void 0, void 0, function* () { return listImportersEndpoint(); }), {
        refetchOnWindowFocus: false,
    });
    const options = (0, react_1.useMemo)(() => (importers === null || importers === void 0 ? void 0 : importers.map(({ key, name }) => [key, t(name)])) || [], [importers, t]);
    const importerKey = (0, ui_contexts_1.useRouteParameter)('importerKey');
    const importer = (0, react_1.useMemo)(() => (importers || []).find(({ key }) => key === importerKey), [importerKey, importers]);
    const maxFileSize = (0, ui_contexts_1.useSetting)('FileUpload_MaxFileSize', 0);
    const router = (0, ui_contexts_1.useRouter)();
    const uploadImportFile = (0, ui_contexts_1.useEndpoint)('POST', '/v1/uploadImportFile');
    const downloadPublicImportFile = (0, ui_contexts_1.useEndpoint)('POST', '/v1/downloadPublicImportFile');
    (0, react_1.useEffect)(() => {
        if (importerKey && !importer && !isLoadingImporters) {
            router.navigate('/admin/import/new', { replace: true });
        }
    }, [importer, importerKey, router, isLoadingImporters]);
    const formatMemorySize = (0, useFormatMemorySize_1.useFormatMemorySize)();
    const handleImporterKeyChange = (importerKey) => {
        if (typeof importerKey !== 'string') {
            return;
        }
        router.navigate({
            pattern: '/admin/import/new/:importerKey?',
            params: { importerKey },
        }, { replace: true });
    };
    const handleFileTypeChange = (fileType) => {
        if (typeof fileType !== 'string') {
            return;
        }
        setFileType(fileType);
    };
    const [files, setFiles] = (0, react_1.useState)([]);
    const isDataTransferEvent = (event) => Boolean('dataTransfer' in event && event.dataTransfer.files);
    const handleImportFileChange = (event) => __awaiter(this, void 0, void 0, function* () {
        let { files } = event.target;
        if (!files || files.length === 0) {
            if (isDataTransferEvent(event)) {
                files = event.dataTransfer.files;
            }
        }
        setFiles(Array.from(files !== null && files !== void 0 ? files : []));
    });
    const handleFileUploadChipClick = (file) => () => {
        setFiles((files) => files.filter((_file) => _file !== file));
    };
    const handleFileUploadImportButtonClick = () => __awaiter(this, void 0, void 0, function* () {
        if (!importerKey) {
            return;
        }
        setLoading(true);
        try {
            yield Promise.all(Array.from(files, (file) => new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = () => __awaiter(this, void 0, void 0, function* () {
                    const result = reader.result;
                    try {
                        yield uploadImportFile({
                            binaryContent: result.split(';base64,')[1],
                            contentType: file.type,
                            fileName: file.name,
                            importerKey,
                        });
                    }
                    catch (error) {
                        handleError(error, t('Failed_To_upload_Import_File'));
                    }
                    finally {
                        resolve();
                    }
                });
                reader.onerror = () => resolve();
            })));
            router.navigate('/admin/import/prepare');
        }
        finally {
            setLoading(false);
        }
    });
    const [fileUrl, setFileUrl] = (0, fuselage_hooks_1.useSafely)((0, react_1.useState)(''));
    const handleFileUrlChange = (event) => {
        setFileUrl(event.currentTarget.value);
    };
    const handleFileUrlImportButtonClick = () => __awaiter(this, void 0, void 0, function* () {
        if (!importerKey) {
            return;
        }
        setLoading(true);
        try {
            yield downloadPublicImportFile({ importerKey, fileUrl });
            dispatchToastMessage({ type: 'success', message: t('Import_requested_successfully') });
            router.navigate('/admin/import/prepare');
        }
        catch (error) {
            handleError(error, t('Failed_To_upload_Import_File'));
        }
        finally {
            setLoading(false);
        }
    });
    const [filePath, setFilePath] = (0, fuselage_hooks_1.useSafely)((0, react_1.useState)(''));
    const handleFilePathChange = (event) => {
        setFilePath(event.currentTarget.value);
    };
    const handleFilePathImportButtonClick = () => __awaiter(this, void 0, void 0, function* () {
        if (!importerKey) {
            return;
        }
        setLoading(true);
        try {
            yield downloadPublicImportFile({ importerKey, fileUrl: filePath });
            dispatchToastMessage({ type: 'success', message: t('Import_requested_successfully') });
            router.navigate('/admin/import/prepare');
        }
        catch (error) {
            handleError(error, t('Failed_To_upload_Import_File'));
        }
        finally {
            setLoading(false);
        }
    });
    const importerKeySelectId = (0, fuselage_hooks_1.useUniqueId)();
    const fileTypeSelectId = (0, fuselage_hooks_1.useUniqueId)();
    const fileSourceInputId = (0, fuselage_hooks_1.useUniqueId)();
    const handleImportButtonClick = (fileType === 'upload' && handleFileUploadImportButtonClick) ||
        (fileType === 'url' && handleFileUrlImportButtonClick) ||
        (fileType === 'path' && handleFilePathImportButtonClick) ||
        undefined;
    return ((0, jsx_runtime_1.jsxs)(Page_1.Page, { className: 'page-settings', children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: t('Import_New_File'), onClickBack: () => router.navigate('/admin/import'), children: (0, jsx_runtime_1.jsx)(fuselage_1.ButtonGroup, { children: importer && ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, minHeight: 'x40', loading: isLoading, onClick: handleImportButtonClick, children: t('Import') })) }) }), (0, jsx_runtime_1.jsx)(Page_1.PageScrollableContentWithShadow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { marginInline: 'auto', marginBlock: 'neg-x24', width: 'full', maxWidth: 'x580', children: (0, jsx_runtime_1.jsxs)(fuselage_1.Margins, { block: 'x24', children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Field.Label, { alignSelf: 'stretch', htmlFor: importerKeySelectId, children: t('Import_Type') }), (0, jsx_runtime_1.jsx)(fuselage_1.Field.Row, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Select, { id: importerKeySelectId, value: importerKey, disabled: isLoading, placeholder: t('Select_an_option'), onChange: handleImporterKeyChange, options: options }) }), importer && ((0, jsx_runtime_1.jsx)(fuselage_1.Field.Hint, { children: importer.key === 'csv'
                                            ? t('Importer_From_Description_CSV')
                                            : t('Importer_From_Description', { from: t(importer.name) }) }))] }), importer && ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Field.Label, { alignSelf: 'stretch', htmlFor: fileTypeSelectId, children: t('File_Type') }), (0, jsx_runtime_1.jsx)(fuselage_1.Field.Row, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Select, { id: fileTypeSelectId, value: fileType, disabled: isLoading, placeholder: t('Select_an_option'), onChange: handleFileTypeChange, options: [
                                                ['upload', t('Upload')],
                                                ['url', t('Public_URL')],
                                                ['path', t('Server_File_Path')],
                                            ] }) })] })), importer && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [fileType === 'upload' && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [maxFileSize > 0 ? ((0, jsx_runtime_1.jsx)(fuselage_1.Callout, { type: 'warning', marginBlock: 'x16', children: t('Importer_Upload_FileSize_Message', {
                                                    maxFileSize: formatMemorySize(maxFileSize),
                                                }) })) : ((0, jsx_runtime_1.jsx)(fuselage_1.Callout, { type: 'info', marginBlock: 'x16', children: t('Importer_Upload_Unlimited_FileSize') })), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Field.Label, { alignSelf: 'stretch', htmlFor: fileSourceInputId, children: t('Importer_Source_File') }), (0, jsx_runtime_1.jsx)(fuselage_1.Field.Row, { children: (0, jsx_runtime_1.jsx)(fuselage_1.InputBox, { type: 'file', id: fileSourceInputId, onChange: handleImportFileChange }) }), (files === null || files === void 0 ? void 0 : files.length) > 0 && ((0, jsx_runtime_1.jsx)(fuselage_1.Field.Row, { children: files.map((file, i) => ((0, jsx_runtime_1.jsx)(fuselage_1.Chip, { onClick: handleFileUploadChipClick(file), children: file.name }, i))) }))] })] })), fileType === 'url' && ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Field.Label, { alignSelf: 'stretch', htmlFor: fileSourceInputId, children: t('File_URL') }), (0, jsx_runtime_1.jsx)(fuselage_1.Field.Row, { children: (0, jsx_runtime_1.jsx)(fuselage_1.UrlInput, { id: fileSourceInputId, value: fileUrl, onChange: handleFileUrlChange }) })] })), fileType === 'path' && ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Field.Label, { alignSelf: 'stretch', htmlFor: fileSourceInputId, children: t('File_Path') }), (0, jsx_runtime_1.jsx)(fuselage_1.Field.Row, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, { id: fileSourceInputId, value: filePath, onChange: handleFilePathChange }) })] }))] }))] }) }) })] }));
}
exports.default = NewImportPage;
