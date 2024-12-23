"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputWithMultiStaticSelect = exports.inputWithSingleStaticSelect = void 0;
exports.inputWithSingleStaticSelect = [
    {
        type: 'input',
        element: {
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
        label: {
            type: 'plain_text',
            text: 'Label',
            emoji: true,
        },
    },
];
exports.inputWithMultiStaticSelect = [
    {
        type: 'input',
        element: {
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
        label: {
            type: 'plain_text',
            text: 'Label',
            emoji: true,
        },
    },
];
