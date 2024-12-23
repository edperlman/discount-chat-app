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
exports.processTooLongMessage = void 0;
const client_1 = require("../../../../app/settings/client");
const i18n_1 = require("../../../../app/utils/lib/i18n");
const GenericModal_1 = __importDefault(require("../../../components/GenericModal"));
const imperativeModal_1 = require("../../imperativeModal");
const toast_1 = require("../../toast");
const processTooLongMessage = (chat_1, _a) => __awaiter(void 0, [chat_1, _a], void 0, function* (chat, { msg }) {
    var _b;
    const maxAllowedSize = client_1.settings.get('Message_MaxAllowedSize');
    if (msg.length <= maxAllowedSize) {
        return false;
    }
    const fileUploadsEnabled = client_1.settings.get('FileUpload_Enabled');
    const convertLongMessagesToAttachment = client_1.settings.get('Message_AllowConvertLongMessagesToAttachment');
    if (chat.currentEditing || !fileUploadsEnabled || !convertLongMessagesToAttachment) {
        (0, toast_1.dispatchToastMessage)({ type: 'error', message: new Error((0, i18n_1.t)('Message_too_long')) });
        (_b = chat.composer) === null || _b === void 0 ? void 0 : _b.setText(msg);
        return true;
    }
    yield new Promise((resolve) => {
        const onConfirm = () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const contentType = 'text/plain';
            const messageBlob = new Blob([msg], { type: contentType });
            const fileName = `${(_b = (_a = Meteor.user()) === null || _a === void 0 ? void 0 : _a.username) !== null && _b !== void 0 ? _b : 'anonymous'} - ${new Date()}.txt`; // TODO: proper naming and formatting
            const file = new File([messageBlob], fileName, {
                type: contentType,
                lastModified: Date.now(),
            });
            imperativeModal_1.imperativeModal.close();
            yield chat.flows.uploadFiles([file]);
            resolve();
        });
        const onClose = () => {
            var _a;
            (_a = chat.composer) === null || _a === void 0 ? void 0 : _a.setText(msg);
            imperativeModal_1.imperativeModal.close();
            resolve();
        };
        imperativeModal_1.imperativeModal.open({
            component: GenericModal_1.default,
            props: {
                title: (0, i18n_1.t)('Message_too_long'),
                children: (0, i18n_1.t)('Send_it_as_attachment_instead_question'),
                onConfirm,
                onClose,
                onCancel: onClose,
                variant: 'warning',
            },
        });
    });
    return true;
});
exports.processTooLongMessage = processTooLongMessage;
