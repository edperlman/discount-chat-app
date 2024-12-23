"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWebDAVMessageAction = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const client_1 = require("../../../../app/utils/client");
const useWebDAVAccountIntegrationsQuery_1 = require("../../../hooks/webdav/useWebDAVAccountIntegrationsQuery");
const SaveToWebdavModal_1 = __importDefault(require("../../../views/room/webdav/SaveToWebdavModal"));
const useWebDAVMessageAction = (message, { subscription }) => {
    const enabled = (0, ui_contexts_1.useSetting)('Webdav_Integration_Enabled', false);
    const { data } = (0, useWebDAVAccountIntegrationsQuery_1.useWebDAVAccountIntegrationsQuery)({ enabled });
    const setModal = (0, ui_contexts_1.useSetModal)();
    if (!enabled || !subscription || !(data === null || data === void 0 ? void 0 : data.length) || !message.file) {
        return null;
    }
    return {
        id: 'webdav-upload',
        icon: 'upload',
        label: 'Save_To_Webdav',
        action() {
            const [attachment] = message.attachments || [];
            const url = (0, client_1.getURL)(attachment.title_link, { full: true });
            setModal((0, jsx_runtime_1.jsx)(SaveToWebdavModal_1.default, { data: { attachment, url }, onClose: () => {
                    setModal(null);
                } }));
        },
        order: 100,
        group: 'menu',
    };
};
exports.useWebDAVMessageAction = useWebDAVMessageAction;
