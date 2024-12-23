"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputWithDatePicker = void 0;
exports.inputWithDatePicker = [
    {
        type: 'input',
        element: {
            type: 'datepicker',
            appId: 'app-id',
            blockId: 'block-id',
            actionId: 'action-id',
            initialDate: '1990-04-28',
            placeholder: {
                type: 'plain_text',
                text: 'Select a date',
                emoji: true,
            },
        },
        label: {
            type: 'plain_text',
            text: 'Label',
            emoji: true,
        },
    },
];
