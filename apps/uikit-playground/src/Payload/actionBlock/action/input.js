"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actionWithMultiLineInput = exports.actionWithSingleLineInput = void 0;
exports.actionWithSingleLineInput = [
    {
        type: 'actions',
        elements: [
            {
                type: 'plain_text_input',
                actionId: 'plain_text_input_1',
                placeholder: {
                    type: 'plain_text',
                    text: 'Enter name',
                    emoji: true,
                },
                initialValue: 'Vivek Srivastava',
                multiline: false,
            },
        ],
    },
];
exports.actionWithMultiLineInput = [
    {
        type: 'actions',
        elements: [
            {
                type: 'plain_text_input',
                actionId: 'plain_text_input_1',
                placeholder: {
                    type: 'plain_text',
                    text: 'Enter name',
                    emoji: true,
                },
                initialValue: 'Vivek Srivastava',
                multiline: true,
            },
        ],
    },
];
