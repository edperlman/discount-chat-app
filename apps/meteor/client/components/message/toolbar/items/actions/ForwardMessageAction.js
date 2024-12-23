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
const jsx_runtime_1 = require("react/jsx-runtime");
const core_typings_1 = require("@rocket.chat/core-typings");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const getPermaLink_1 = require("../../../../../lib/getPermaLink");
const ForwardMessageModal_1 = __importDefault(require("../../../../../views/room/modals/ForwardMessageModal"));
const MessageToolbarItem_1 = __importDefault(require("../../MessageToolbarItem"));
const ForwardMessageAction = ({ message }) => {
    const setModal = (0, ui_contexts_1.useSetModal)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const encrypted = (0, core_typings_1.isE2EEMessage)(message);
    return ((0, jsx_runtime_1.jsx)(MessageToolbarItem_1.default, { id: 'forward-message', icon: 'arrow-forward', title: encrypted ? t('Action_not_available_encrypted_content', { action: t('Forward_message') }) : t('Forward_message'), qa: 'Forward_message', disabled: encrypted, onClick: () => __awaiter(void 0, void 0, void 0, function* () {
            const permalink = yield (0, getPermaLink_1.getPermaLink)(message._id);
            setModal((0, jsx_runtime_1.jsx)(ForwardMessageModal_1.default, { message: message, permalink: permalink, onClose: () => {
                    setModal(null);
                } }));
        }) }));
};
exports.default = ForwardMessageAction;
