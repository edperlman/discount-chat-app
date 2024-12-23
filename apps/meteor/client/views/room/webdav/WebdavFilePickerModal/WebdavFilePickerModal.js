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
const react_1 = __importStar(require("react"));
const FilePickerBreadcrumbs_1 = __importDefault(require("./FilePickerBreadcrumbs"));
const WebdavFilePickerGrid_1 = __importDefault(require("./WebdavFilePickerGrid"));
const WebdavFilePickerTable_1 = __importDefault(require("./WebdavFilePickerTable"));
const sortWebdavNodes_1 = require("./lib/sortWebdavNodes");
const client_1 = require("../../../../../app/utils/client");
const FilterByText_1 = __importDefault(require("../../../../components/FilterByText"));
const useSort_1 = require("../../../../components/GenericTable/hooks/useSort");
const FileUploadModal_1 = __importDefault(require("../../modals/FileUploadModal"));
const WebdavFilePickerModal = ({ onUpload, onClose, account }) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const getWebdavFilePreview = (0, ui_contexts_1.useMethod)('getWebdavFilePreview');
    const getWebdavFileList = (0, ui_contexts_1.useMethod)('getWebdavFileList');
    const getFileFromWebdav = (0, ui_contexts_1.useMethod)('getFileFromWebdav');
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const [typeView, setTypeView] = (0, react_1.useState)('list');
    const { sortBy, sortDirection, setSort } = (0, useSort_1.useSort)('name');
    const [currentFolder, setCurrentFolder] = (0, react_1.useState)('/');
    const [parentFolders, setParentFolders] = (0, react_1.useState)([]);
    const [webdavNodes, setWebdavNodes] = (0, react_1.useState)([]);
    const [filterText, setFilterText] = (0, react_1.useState)('');
    const debouncedFilter = (0, fuselage_hooks_1.useDebouncedValue)('', 500);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const showFilePreviews = (0, fuselage_hooks_1.useMutableCallback)((accountId, nodes) => __awaiter(void 0, void 0, void 0, function* () {
        if (!Array.isArray(nodes) || !nodes.length) {
            return;
        }
        const promises = nodes
            .map((node, index) => {
            if (node.type !== 'file') {
                return;
            }
            return getWebdavFilePreview(accountId, node.filename)
                .then((res) => {
                if (!(res === null || res === void 0 ? void 0 : res.data)) {
                    return;
                }
                const blob = new Blob([res === null || res === void 0 ? void 0 : res.data], { type: 'image/png' });
                const imgURL = URL.createObjectURL(blob);
                nodes[index].preview = imgURL;
            })
                .catch((e) => e);
        })
            .filter(Boolean);
        return Promise.all(promises)
            .then(() => nodes)
            .catch((e) => e);
    }));
    const handleFilterNodes = (0, react_1.useCallback)((webdavNodes) => {
        const regex = new RegExp(`\\b${debouncedFilter}`, 'i');
        const filteredNodes = webdavNodes.filter(({ basename }) => basename.match(regex));
        return setWebdavNodes(filteredNodes);
    }, [debouncedFilter]);
    const handleGetWebdavFileList = (0, react_1.useCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        setIsLoading(true);
        let result;
        try {
            result = yield getWebdavFileList(account._id, currentFolder);
            handleFilterNodes(result.data);
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
            onClose();
        }
        finally {
            setIsLoading(false);
            const nodesWithPreviews = yield showFilePreviews(account._id, result === null || result === void 0 ? void 0 : result.data);
            if (Array.isArray(nodesWithPreviews) && nodesWithPreviews.length) {
                handleFilterNodes(nodesWithPreviews);
            }
        }
    }), [account._id, currentFolder, dispatchToastMessage, getWebdavFileList, onClose, showFilePreviews, handleFilterNodes]);
    const handleBreadcrumb = (e) => {
        const { index } = e.currentTarget.dataset;
        const parentFolders = currentFolder.split('/').filter((s) => s);
        // determine parent directory to go to
        let targetFolder = '/';
        for (let i = 0; i <= Number(index); i++) {
            targetFolder += parentFolders[i];
            targetFolder += '/';
        }
        setCurrentFolder(targetFolder);
    };
    const handleBack = () => {
        let newCurrentFolder = currentFolder;
        // determine parent directory to go back
        let parentFolder = '/';
        if (newCurrentFolder && newCurrentFolder !== '/') {
            if (newCurrentFolder[newCurrentFolder.length - 1] === '/') {
                newCurrentFolder = newCurrentFolder.slice(0, -1);
            }
            parentFolder = newCurrentFolder.substr(0, newCurrentFolder.lastIndexOf('/') + 1);
        }
        setCurrentFolder(parentFolder);
    };
    const handleNodeClick = (webdavNode) => {
        if (webdavNode.type === 'directory') {
            return setCurrentFolder(webdavNode.filename);
        }
        return handleUpload(webdavNode);
    };
    const handleUpload = (webdavNode) => __awaiter(void 0, void 0, void 0, function* () {
        setIsLoading(true);
        const uploadFile = (file, description) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield (onUpload === null || onUpload === void 0 ? void 0 : onUpload(file, description));
            }
            catch (error) {
                return dispatchToastMessage({ type: 'error', message: error });
            }
            finally {
                setIsLoading(false);
                onClose();
            }
        });
        try {
            const { data } = yield getFileFromWebdav(account._id, webdavNode);
            const blob = new Blob([data]);
            const file = new File([blob], webdavNode.basename, { type: webdavNode.mime });
            setModal((0, jsx_runtime_1.jsx)(FileUploadModal_1.default, { fileName: webdavNode.basename, onSubmit: (_, description) => uploadFile(file, description), file: file, onClose: () => setModal(null), invalidContentType: Boolean(file.type && !(0, client_1.fileUploadIsValidContentType)(file.type)) }));
        }
        catch (error) {
            return dispatchToastMessage({ type: 'error', message: error });
        }
    });
    (0, react_1.useEffect)(() => {
        handleGetWebdavFileList();
    }, [handleGetWebdavFileList]);
    (0, react_1.useEffect)(() => {
        setParentFolders((currentFolder === null || currentFolder === void 0 ? void 0 : currentFolder.split('/').filter((s) => s)) || []);
    }, [currentFolder]);
    const options = [
        ['name', 'Name'],
        ['size', 'Size'],
        ['dataModified', 'Data Modified'],
    ];
    const handleSort = (sortBy, sortDirection) => {
        setSort(sortBy);
        const sortedNodes = (0, sortWebdavNodes_1.sortWebdavNodes)(webdavNodes, sortBy, sortDirection);
        return setWebdavNodes(sortedNodes);
    };
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Modal, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Modal.Header, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Modal.Title, { children: t('Upload_From', { name: account.name }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Close, { title: t('Close'), onClick: onClose })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Modal.Content, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', justifyContent: 'space-between', children: [(0, jsx_runtime_1.jsx)(FilePickerBreadcrumbs_1.default, { parentFolders: parentFolders, handleBreadcrumb: handleBreadcrumb, handleBack: handleBack }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { children: [typeView === 'list' && (0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { icon: 'squares', small: true, title: t('Grid_view'), onClick: () => setTypeView('grid') }), typeView === 'grid' && (0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { icon: 'th-list', small: true, title: t('List_view'), onClick: () => setTypeView('list') })] })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', flexDirection: 'column', children: (0, jsx_runtime_1.jsx)(FilterByText_1.default, { value: filterText, onChange: (event) => setFilterText(event.target.value), children: typeView === 'grid' && ((0, jsx_runtime_1.jsx)(fuselage_1.Select, { value: sortBy, onChange: (value) => handleSort(value), options: options })) }) }), typeView === 'list' && ((0, jsx_runtime_1.jsx)(WebdavFilePickerTable_1.default, { webdavNodes: webdavNodes, sortBy: sortBy, sortDirection: sortDirection, onSort: handleSort, onNodeClick: handleNodeClick, isLoading: isLoading })), typeView === 'grid' && (0, jsx_runtime_1.jsx)(WebdavFilePickerGrid_1.default, { webdavNodes: webdavNodes, onNodeClick: handleNodeClick, isLoading: isLoading })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Footer, {})] }));
};
exports.default = WebdavFilePickerModal;
