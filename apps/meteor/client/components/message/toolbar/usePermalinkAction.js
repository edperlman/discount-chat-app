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
exports.usePermalinkAction = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_i18next_1 = require("react-i18next");
const getPermaLink_1 = require("../../../lib/getPermaLink");
const usePermalinkAction = (message, { id, context, type, order }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const encrypted = (0, core_typings_1.isE2EEMessage)(message);
    return {
        id,
        icon: 'permalink',
        label: 'Copy_link',
        context,
        type,
        action() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const permalink = yield (0, getPermaLink_1.getPermaLink)(message._id);
                    navigator.clipboard.writeText(permalink);
                    dispatchToastMessage({ type: 'success', message: t('Copied') });
                }
                catch (e) {
                    dispatchToastMessage({ type: 'error', message: e });
                }
            });
        },
        order,
        group: 'menu',
        disabled: encrypted,
    };
};
exports.usePermalinkAction = usePermalinkAction;
