"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputWithMultiLineInput = exports.inputWithSingleLineInput = void 0;
exports.inputWithSingleLineInput = [
    {
        type: 'input',
        element: {
            type: 'plain_text_input',
            appId: 'app-id',
            blockId: 'block-id',
            actionId: 'action-id',
            placeholder: {
                type: 'plain_text',
                text: 'Enter name',
                emoji: true,
            },
            initialValue: 'Vivek Srivastava',
            multiline: false,
        },
        label: {
            type: 'plain_text',
            text: 'Label',
            emoji: true,
        },
    },
];
exports.inputWithMultiLineInput = [
    {
        type: 'input',
        element: {
            type: 'plain_text_input',
            appId: 'app-id',
            blockId: 'block-id',
            actionId: 'action-id',
            placeholder: {
                type: 'plain_text',
                text: 'Enter name',
                emoji: true,
            },
            initialValue: 'Vivek Srivastava',
            multiline: true,
        },
        label: {
            type: 'plain_text',
            text: 'Label',
            emoji: true,
        },
    },
];
