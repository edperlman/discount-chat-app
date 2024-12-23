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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const FileExport_1 = __importDefault(require("./FileExport"));
const MailExportForm_1 = __importDefault(require("./MailExportForm"));
const Contextualbar_1 = require("../../../../components/Contextualbar");
const roomCoordinator_1 = require("../../../../lib/rooms/roomCoordinator");
const RoomContext_1 = require("../../contexts/RoomContext");
const RoomToolboxContext_1 = require("../../contexts/RoomToolboxContext");
const ExportMessages = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const room = (0, RoomContext_1.useRoom)();
    const { closeTab } = (0, RoomToolboxContext_1.useRoomToolbox)();
    const roomName = (room === null || room === void 0 ? void 0 : room.t) && roomCoordinator_1.roomCoordinator.getRoomName(room.t, room);
    const methods = (0, react_hook_form_1.useForm)({
        mode: 'onBlur',
        defaultValues: {
            type: 'email',
            dateFrom: '',
            dateTo: '',
            toUsers: [],
            additionalEmails: '',
            messagesCount: 0,
            subject: t('Mail_Messages_Subject', {
                postProcess: 'sprintf',
                sprintf: [roomName],
            }),
            format: 'html',
        },
    });
    const exportOptions = (0, react_1.useMemo)(() => [
        ['email', t('Send_via_email')],
        ['file', t('Export_as_file')],
    ], [t]);
    const formId = (0, fuselage_hooks_1.useUniqueId)();
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarHeader, { children: [(0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarIcon, { name: 'mail' }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarTitle, { id: `${formId}-title`, children: t('Export_Messages') }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarClose, { onClick: closeTab })] }), (0, jsx_runtime_1.jsxs)(react_hook_form_1.FormProvider, Object.assign({}, methods, { children: [methods.watch('type') === 'email' && ((0, jsx_runtime_1.jsx)(MailExportForm_1.default, { formId: formId, rid: room._id, exportOptions: exportOptions, onCancel: closeTab })), methods.watch('type') === 'file' && ((0, jsx_runtime_1.jsx)(FileExport_1.default, { formId: formId, rid: room._id, exportOptions: exportOptions, onCancel: closeTab }))] }))] }));
};
exports.default = ExportMessages;
