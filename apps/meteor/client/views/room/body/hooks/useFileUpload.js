"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFileUpload = void 0;
const react_1 = require("react");
const shim_1 = require("use-sync-external-store/shim");
const useFileUploadDropTarget_1 = require("./useFileUploadDropTarget");
const ChatContext_1 = require("../../contexts/ChatContext");
const useFileUpload = () => {
    const chat = (0, ChatContext_1.useChat)();
    if (!chat) {
        throw new Error('No ChatContext provided');
    }
    (0, react_1.useEffect)(() => {
        chat.uploads.wipeFailedOnes();
    }, [chat]);
    const uploads = (0, shim_1.useSyncExternalStore)(chat.uploads.subscribe, chat.uploads.get);
    const handleUploadProgressClose = (0, react_1.useCallback)((id) => {
        chat.uploads.cancel(id);
    }, [chat]);
    const handleUploadFiles = (0, react_1.useCallback)((files) => {
        chat.flows.uploadFiles(files);
    }, [chat]);
    return {
        uploads,
        handleUploadProgressClose,
        handleUploadFiles,
        targeDrop: (0, useFileUploadDropTarget_1.useFileUploadDropTarget)(),
    };
};
exports.useFileUpload = useFileUpload;
