"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.conditional = void 0;
exports.conditional = [
    {
        type: 'conditional',
        when: {
            engine: ['rocket.chat'],
        },
        render: [
            {
                type: 'section',
                text: {
                    type: 'plain_text',
                    text: 'This is a plain text section block.',
                    emoji: true,
                },
            },
        ],
    },
];
