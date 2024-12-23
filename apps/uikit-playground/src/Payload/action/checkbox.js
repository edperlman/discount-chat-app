"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actionWithCheckbox = void 0;
exports.actionWithCheckbox = [
    {
        type: 'actions',
        elements: [
            {
                type: 'checkbox',
                appId: 'app-id',
                blockId: 'block-id',
                actionId: 'action-id',
                options: [
                    {
                        text: {
                            type: 'plain_text',
                            text: 'Option 1',
                        },
                        value: 'value-1',
                    },
                    {
                        text: {
                            type: 'plain_text',
                            text: 'Option initial',
                        },
                        value: 'value-2',
                    },
                ],
                initialOptions: [
                    {
                        text: {
                            type: 'plain_text',
                            text: 'Option initial',
                        },
                        value: 'value-2',
                    },
                ],
            },
        ],
    },
];
