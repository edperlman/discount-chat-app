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
exports.requestMessageDeletion = void 0;
const i18n_1 = require("../../../../app/utils/lib/i18n");
const GenericModal_1 = __importDefault(require("../../../components/GenericModal"));
const imperativeModal_1 = require("../../imperativeModal");
const toast_1 = require("../../toast");
const requestMessageDeletion = (chat, message) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(yield chat.data.canDeleteMessage(message))) {
        (0, toast_1.dispatchToastMessage)({ type: 'error', message: (0, i18n_1.t)('Message_deleting_blocked') });
        return;
    }
    const room = message.drid ? yield chat.data.getDiscussionByID(message.drid) : undefined;
    yield new Promise((resolve, reject) => {
        const onConfirm = () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            try {
                if (!(yield chat.data.canDeleteMessage(message))) {
                    (0, toast_1.dispatchToastMessage)({ type: 'error', message: (0, i18n_1.t)('Message_deleting_blocked') });
                    return;
                }
                yield chat.data.deleteMessage(message);
                imperativeModal_1.imperativeModal.close();
                if (((_a = chat.currentEditing) === null || _a === void 0 ? void 0 : _a.mid) === message._id) {
                    chat.currentEditing.stop();
                }
                (_b = chat.composer) === null || _b === void 0 ? void 0 : _b.focus();
                (0, toast_1.dispatchToastMessage)({ type: 'success', message: (0, i18n_1.t)('Your_entry_has_been_deleted') });
                resolve();
            }
            catch (error) {
                (0, toast_1.dispatchToastMessage)({ type: 'error', message: error });
                reject(error);
            }
        });
        const onCloseModal = () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            imperativeModal_1.imperativeModal.close();
            if (((_a = chat.currentEditing) === null || _a === void 0 ? void 0 : _a.mid) === message._id) {
                chat.currentEditing.stop();
            }
            (_b = chat.composer) === null || _b === void 0 ? void 0 : _b.focus();
            resolve();
        });
        imperativeModal_1.imperativeModal.open({
            component: GenericModal_1.default,
            props: {
                title: (0, i18n_1.t)('Are_you_sure'),
                children: room ? (0, i18n_1.t)('The_message_is_a_discussion_you_will_not_be_able_to_recover') : (0, i18n_1.t)('You_will_not_be_able_to_recover'),
                variant: 'danger',
                confirmText: (0, i18n_1.t)('Yes_delete_it'),
                onConfirm,
                onClose: onCloseModal,
                onCancel: onCloseModal,
            },
        });
    });
});
exports.requestMessageDeletion = requestMessageDeletion;
