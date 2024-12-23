"use strict";
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
exports.useWebdavActions = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const useWebDAVAccountIntegrationsQuery_1 = require("../../../../../../hooks/webdav/useWebDAVAccountIntegrationsQuery");
const ChatContext_1 = require("../../../../contexts/ChatContext");
const AddWebdavAccountModal_1 = __importDefault(require("../../../../webdav/AddWebdavAccountModal"));
const WebdavFilePickerModal_1 = __importDefault(require("../../../../webdav/WebdavFilePickerModal"));
const useWebdavActions = () => {
    const enabled = (0, ui_contexts_1.useSetting)('Webdav_Integration_Enabled', false);
    const { isSuccess, data } = (0, useWebDAVAccountIntegrationsQuery_1.useWebDAVAccountIntegrationsQuery)({ enabled });
    const chat = (0, ChatContext_1.useChat)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const handleAddWebDav = () => setModal((0, jsx_runtime_1.jsx)(AddWebdavAccountModal_1.default, { onClose: () => setModal(null), onConfirm: () => setModal(null) }));
    const handleUpload = (file, description) => __awaiter(void 0, void 0, void 0, function* () {
        return chat === null || chat === void 0 ? void 0 : chat.uploads.send(file, {
            description,
        });
    });
    const handleOpenWebdav = (account) => setModal((0, jsx_runtime_1.jsx)(WebdavFilePickerModal_1.default, { account: account, onUpload: handleUpload, onClose: () => setModal(null) }));
    return [
        {
            id: 'webdav-add',
            content: t('Add_Server'),
            icon: 'cloud-plus',
            disabled: !isSuccess,
            onClick: handleAddWebDav,
        },
        ...(isSuccess
            ? data.map((account) => ({
                id: account._id,
                content: account.name,
                icon: 'cloud-plus',
                onClick: () => handleOpenWebdav(account),
            }))
            : []),
    ];
};
exports.useWebdavActions = useWebdavActions;
