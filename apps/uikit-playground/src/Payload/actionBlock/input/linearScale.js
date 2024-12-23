"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputWithLinearSelect = void 0;
exports.inputWithLinearSelect = [
    {
        type: 'input',
        element: {
            type: 'linear_scale',
            appId: 'app-id',
            blockId: 'block-id',
            actionId: 'action-id',
            minValue: 0,
            maxValue: 8,
            initialValue: 5,
        },
        label: {
            type: 'plain_text',
            text: 'Label',
            emoji: true,
        },
    },
];
