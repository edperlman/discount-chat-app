"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const core_typings_1 = require("@rocket.chat/core-typings");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const MessageToolbarItem_1 = __importDefault(require("../../MessageToolbarItem"));
const ReplyInThreadMessageAction = ({ message, room, subscription }) => {
    const router = (0, ui_contexts_1.useRouter)();
    const threadsEnabled = (0, ui_contexts_1.useSetting)('Threads_enabled', true);
    const { t } = (0, react_i18next_1.useTranslation)();
    if (!threadsEnabled || (0, core_typings_1.isOmnichannelRoom)(room) || !subscription) {
        return null;
    }
    return ((0, jsx_runtime_1.jsx)(MessageToolbarItem_1.default, { id: 'reply-in-thread', icon: 'thread', title: t('Reply_in_thread'), qa: 'Reply_in_thread', onClick: (event) => {
            event.stopPropagation();
            const routeName = router.getRouteName();
            if (routeName) {
                router.navigate({
                    name: routeName,
                    params: Object.assign(Object.assign({}, router.getRouteParameters()), { tab: 'thread', context: message.tmid || message._id }),
                });
            }
        } }));
};
exports.default = ReplyInThreadMessageAction;
