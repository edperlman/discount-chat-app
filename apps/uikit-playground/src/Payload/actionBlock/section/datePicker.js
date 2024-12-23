"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sectionWithdatePicker = void 0;
exports.sectionWithdatePicker = [
    {
        type: 'section',
        text: {
            type: 'mrkdwn',
            text: 'Pick a date for the deadline.',
        },
        accessory: {
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
    },
];
