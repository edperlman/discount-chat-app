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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCopyAction = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_i18next_1 = require("react-i18next");
const getMainMessageText = (message) => {
    var _a, _b, _c, _d, _e, _f;
    const newMessage = Object.assign({}, message);
    newMessage.msg = newMessage.msg || ((_b = (_a = newMessage.attachments) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.description) || ((_d = (_c = newMessage.attachments) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.title) || '';
    newMessage.md = newMessage.md || ((_f = (_e = newMessage.attachments) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.descriptionMd) || undefined;
    return Object.assign({}, newMessage);
};
const useCopyAction = (message, { subscription }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    if (!subscription) {
        return null;
    }
    return {
        id: 'copy',
        icon: 'copy',
        label: 'Copy_text',
        context: ['message', 'message-mobile', 'threads', 'federated'],
        type: 'duplication',
        action() {
            return __awaiter(this, void 0, void 0, function* () {
                const msgText = getMainMessageText(message).msg;
                yield navigator.clipboard.writeText(msgText);
                dispatchToastMessage({ type: 'success', message: t('Copied') });
            });
        },
        order: 6,
        group: 'menu',
    };
};
exports.useCopyAction = useCopyAction;
