"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actionWithTimePicker = void 0;
exports.actionWithTimePicker = [
    {
        type: 'actions',
        elements: [
            {
                type: 'time_picker',
                initialTime: '10:30',
                appId: 'app-id',
                blockId: 'block-id',
                actionId: 'action-id',
                placeholder: {
                    type: 'plain_text',
                    text: 'Select a time',
                    emoji: true,
                },
            },
        ],
    },
];
