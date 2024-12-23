"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actionsWithDatePicker = exports.actionsWithButtonAsLink = exports.actionsWithButton = exports.actionsWithInitializedSelects = exports.actionsWithFilteredConversationsSelect = exports.actionsWithAllSelects = void 0;
exports.actionsWithAllSelects = [
    {
        type: 'actions',
        elements: [
            {
                appId: 'dummy-app-id',
                blockId: 'dummy-block-id',
                actionId: 'dummy-action-id',
                type: 'conversations_select',
                // placeholder: {
                //   type: 'plain_text',
                //   text: 'Select a conversation',
                //   emoji: true,
                // },
            },
            {
                appId: 'dummy-app-id',
                blockId: 'dummy-block-id',
                actionId: 'dummy-action-id',
                type: 'channels_select',
                placeholder: {
                    type: 'plain_text',
                    text: 'Select a channel',
                    emoji: true,
                },
            },
            {
                appId: 'dummy-app-id',
                blockId: 'dummy-block-id',
                actionId: 'dummy-action-id',
                type: 'users_select',
                placeholder: {
                    type: 'plain_text',
                    text: 'Select a user',
                    emoji: true,
                },
            },
            {
                appId: 'dummy-app-id',
                blockId: 'dummy-block-id',
                actionId: 'dummy-action-id',
                type: 'static_select',
                placeholder: {
                    type: 'plain_text',
                    text: 'Select an item',
                    emoji: true,
                },
                options: [
                    {
                        text: {
                            type: 'plain_text',
                            text: '*this is plain_text text*',
                            emoji: true,
                        },
                        value: 'value-0',
                    },
                    {
                        text: {
                            type: 'plain_text',
                            text: '*this is plain_text text*',
                            emoji: true,
                        },
                        value: 'value-1',
                    },
                    {
                        text: {
                            type: 'plain_text',
                            text: '*this is plain_text text*',
                            emoji: true,
                        },
                        value: 'value-2',
                    },
                ],
            },
        ],
    },
];
exports.actionsWithFilteredConversationsSelect = [
    {
        type: 'actions',
        elements: [
            {
                appId: 'dummy-app-id',
                blockId: 'dummy-block-id',
                actionId: 'dummy-action-id',
                type: 'conversations_select',
                // placeholder: {
                //   type: 'plain_text',
                //   text: 'Select private conversation',
                //   emoji: true,
                // },
                // filter: {
                //   include: ['private'],
                // },
            },
        ],
    },
];
exports.actionsWithInitializedSelects = [
    {
        type: 'actions',
        elements: [
            {
                appId: 'dummy-app-id',
                blockId: 'dummy-block-id',
                actionId: 'dummy-action-id',
                type: 'conversations_select',
                // placeholder: {
                //   type: 'plain_text',
                //   text: 'Select a conversation',
                //   emoji: true,
                // },
                // initialConversation: 'D123',
            },
            {
                appId: 'dummy-app-id',
                blockId: 'dummy-block-id',
                actionId: 'dummy-action-id',
                type: 'users_select',
                placeholder: {
                    type: 'plain_text',
                    text: 'Select a user',
                    emoji: true,
                },
                // initialUser: 'U123',
            },
            {
                appId: 'dummy-app-id',
                blockId: 'dummy-block-id',
                actionId: 'dummy-action-id',
                type: 'channels_select',
                // placeholder: {
                //   type: 'plain_text',
                //   text: 'Select a channel',
                //   emoji: true,
                // },
                // initialChannel: 'C123',
            },
        ],
    },
];
exports.actionsWithButton = [
    {
        type: 'actions',
        elements: [
            {
                appId: 'dummy-app-id',
                blockId: 'dummy-block-id',
                actionId: 'dummy-action-id',
                type: 'button',
                text: {
                    type: 'plain_text',
                    text: 'Click Me',
                    emoji: true,
                },
                value: 'click_me_123',
            },
        ],
    },
];
exports.actionsWithButtonAsLink = [
    {
        type: 'actions',
        elements: [
            {
                appId: 'dummy-app-id',
                blockId: 'dummy-block-id',
                actionId: 'dummy-action-id',
                type: 'button',
                text: {
                    type: 'plain_text',
                    text: 'Click Me',
                    emoji: true,
                },
                url: 'https://rocket.chat',
                value: 'click_me_123',
            },
        ],
    },
];
exports.actionsWithDatePicker = [
    {
        type: 'actions',
        elements: [
            {
                appId: 'dummy-app-id',
                blockId: 'dummy-block-id',
                actionId: 'dummy-action-id',
                type: 'datepicker',
                initialDate: '1990-04-28',
                placeholder: {
                    type: 'plain_text',
                    text: 'Select a date',
                    emoji: true,
                },
            },
            {
                appId: 'dummy-app-id',
                blockId: 'dummy-block-id',
                actionId: 'dummy-action-id',
                type: 'datepicker',
                initialDate: '1990-04-28',
                placeholder: {
                    type: 'plain_text',
                    text: 'Select a date',
                    emoji: true,
                },
            },
        ],
    },
];
