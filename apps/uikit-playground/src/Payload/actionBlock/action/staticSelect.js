"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actionWithMultiStaticSelect = exports.actionWithSingleStaticSelect = void 0;
exports.actionWithSingleStaticSelect = [
    {
        type: 'actions',
        elements: [
            {
                type: 'static_select',
                appId: 'app-id',
                blockId: 'block-id',
                actionId: 'action-id',
                initialValue: 'option_2',
                options: [
                    {
                        value: 'option_1',
                        text: {
                            type: 'plain_text',
                            text: 'lorem ipsum 🚀',
                            emoji: true,
                        },
                    },
                    {
                        value: 'option_2',
                        text: {
                            type: 'plain_text',
                            text: 'lorem ipsum 🚀',
                            emoji: true,
                        },
                    },
                ],
                placeholder: {
                    type: 'plain_text',
                    text: 'Select an item',
                },
            },
        ],
    },
];
exports.actionWithMultiStaticSelect = [
    {
        type: 'actions',
        elements: [
            {
                type: 'multi_static_select',
                appId: 'app-id',
                blockId: 'block-id',
                actionId: 'action-id',
                initialValue: ['option_1', 'option_2'],
                options: [
                    {
                        value: 'option_1',
                        text: {
                            type: 'plain_text',
                            text: 'lorem ipsum 🚀',
                            emoji: true,
                        },
                    },
                    {
                        value: 'option_2',
                        text: {
                            type: 'plain_text',
                            text: 'lorem ipsum 🚀',
                            emoji: true,
                        },
                    },
                ],
                placeholder: {
                    type: 'plain_text',
                    text: 'Select an item',
                },
            },
        ],
    },
];
