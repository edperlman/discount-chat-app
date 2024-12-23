"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const core_typings_1 = require("@rocket.chat/core-typings");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_client_1 = require("@rocket.chat/ui-client");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const useCopyAction_1 = require("./useCopyAction");
const useDeleteMessageAction_1 = require("./useDeleteMessageAction");
const useEditMessageAction_1 = require("./useEditMessageAction");
const useFollowMessageAction_1 = require("./useFollowMessageAction");
const useMarkAsUnreadMessageAction_1 = require("./useMarkAsUnreadMessageAction");
const useMessageActionAppsActionButtons_1 = require("./useMessageActionAppsActionButtons");
const useNewDiscussionMessageAction_1 = require("./useNewDiscussionMessageAction");
const usePermalinkAction_1 = require("./usePermalinkAction");
const usePinMessageAction_1 = require("./usePinMessageAction");
const useReadReceiptsDetailsAction_1 = require("./useReadReceiptsDetailsAction");
const useReplyInDMAction_1 = require("./useReplyInDMAction");
const useReportMessageAction_1 = require("./useReportMessageAction");
const useShowMessageReactionsAction_1 = require("./useShowMessageReactionsAction");
const useStarMessageAction_1 = require("./useStarMessageAction");
const useTranslateAction_1 = require("./useTranslateAction");
const useUnFollowMessageAction_1 = require("./useUnFollowMessageAction");
const useUnpinMessageAction_1 = require("./useUnpinMessageAction");
const useUnstarMessageAction_1 = require("./useUnstarMessageAction");
const useViewOriginalTranslationAction_1 = require("./useViewOriginalTranslationAction");
const useWebDAVMessageAction_1 = require("./useWebDAVMessageAction");
const isTruthy_1 = require("../../../../lib/isTruthy");
const MessageToolbarActionMenu = ({ message, context, room, subscription, onChangeMenuVisibility }) => {
    var _a;
    // TODO: move this to another place
    const menuItems = [
        (0, useWebDAVMessageAction_1.useWebDAVMessageAction)(message, { subscription }),
        (0, useNewDiscussionMessageAction_1.useNewDiscussionMessageAction)(message, { room, subscription }),
        (0, useUnpinMessageAction_1.useUnpinMessageAction)(message, { room, subscription }),
        (0, usePinMessageAction_1.usePinMessageAction)(message, { room, subscription }),
        (0, useStarMessageAction_1.useStarMessageAction)(message, { room }),
        (0, useUnstarMessageAction_1.useUnstarMessageAction)(message, { room }),
        (0, usePermalinkAction_1.usePermalinkAction)(message, { id: 'permalink-star', context: ['starred'], order: 10 }),
        (0, usePermalinkAction_1.usePermalinkAction)(message, { id: 'permalink-pinned', context: ['pinned'], order: 5 }),
        (0, usePermalinkAction_1.usePermalinkAction)(message, {
            id: 'permalink',
            context: ['message', 'message-mobile', 'threads', 'federated', 'videoconf', 'videoconf-threads'],
            type: 'duplication',
            order: 5,
        }),
        (0, useFollowMessageAction_1.useFollowMessageAction)(message, { room, context }),
        (0, useUnFollowMessageAction_1.useUnFollowMessageAction)(message, { room, context }),
        (0, useMarkAsUnreadMessageAction_1.useMarkAsUnreadMessageAction)(message, { room, subscription }),
        (0, useTranslateAction_1.useTranslateAction)(message, { room, subscription }),
        (0, useViewOriginalTranslationAction_1.useViewOriginalTranslationAction)(message, { room, subscription }),
        (0, useReplyInDMAction_1.useReplyInDMAction)(message, { room, subscription }),
        (0, useCopyAction_1.useCopyAction)(message, { subscription }),
        (0, useEditMessageAction_1.useEditMessageAction)(message, { room, subscription }),
        (0, useDeleteMessageAction_1.useDeleteMessageAction)(message, { room, subscription }),
        (0, useReportMessageAction_1.useReportMessageAction)(message, { room, subscription }),
        (0, useShowMessageReactionsAction_1.useShowMessageReactionsAction)(message),
        (0, useReadReceiptsDetailsAction_1.useReadReceiptsDetailsAction)(message),
    ];
    const hiddenActions = (0, ui_contexts_1.useLayoutHiddenActions)().messageToolbox;
    const data = menuItems
        .filter(isTruthy_1.isTruthy)
        .filter((button) => button.group === 'menu')
        .filter((button) => !button.context || button.context.includes(context))
        .filter((action) => !hiddenActions.includes(action.id))
        .sort((a, b) => { var _a, _b; return ((_a = a.order) !== null && _a !== void 0 ? _a : 0) - ((_b = b.order) !== null && _b !== void 0 ? _b : 0); });
    const actionButtonApps = (0, useMessageActionAppsActionButtons_1.useMessageActionAppsActionButtons)(message, context);
    const id = (0, fuselage_hooks_1.useUniqueId)();
    const { t } = (0, react_i18next_1.useTranslation)();
    if (data.length === 0) {
        return null;
    }
    const isMessageEncrypted = (0, core_typings_1.isE2EEMessage)(message);
    const groupOptions = [...data, ...((_a = actionButtonApps.data) !== null && _a !== void 0 ? _a : [])]
        .map((option) => (Object.assign(Object.assign({ variant: option.color === 'alert' ? 'danger' : '', id: option.id, icon: option.icon, content: t(option.label), onClick: option.action, type: option.type }, (typeof option.disabled === 'boolean' && { disabled: option.disabled })), (typeof option.disabled === 'boolean' &&
        option.disabled && { tooltip: t('Action_not_available_encrypted_content', { action: t(option.label) }) }))))
        .reduce((acc, option) => {
        const group = option.type ? option.type : '';
        const section = acc.find((section) => section.id === group);
        if (section) {
            section.items.push(option);
            return acc;
        }
        const newSection = { id: group, title: group === 'apps' ? t('Apps') : '', items: [option] };
        acc.push(newSection);
        return acc;
    }, [])
        .map((section) => {
        if (section.id !== 'apps') {
            return section;
        }
        if (!isMessageEncrypted) {
            return section;
        }
        return {
            id: 'apps',
            title: t('Apps'),
            items: [
                {
                    content: t('Unavailable'),
                    type: 'apps',
                    id,
                    disabled: true,
                    gap: false,
                    tooltip: t('Action_not_available_encrypted_content', { action: t('Apps') }),
                },
            ],
        };
    });
    return ((0, jsx_runtime_1.jsx)(ui_client_1.GenericMenu, { onOpenChange: onChangeMenuVisibility, detached: true, title: t('More'), "data-qa-id": 'menu', "data-qa-type": 'message-action-menu-options', sections: groupOptions, placement: 'bottom-end' }));
};
exports.default = MessageToolbarActionMenu;
