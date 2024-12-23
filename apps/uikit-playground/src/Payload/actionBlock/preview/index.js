"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.previewWithImageAndUrl = exports.previewWithUrl = exports.previewWithImage = exports.previewPlain = void 0;
exports.previewPlain = [
    {
        type: 'preview',
        title: [
            {
                type: 'plain_text',
                text: 'Vivek',
                emoji: true,
            },
        ],
        description: [
            {
                type: 'plain_text',
                text: 'I Need a Description',
                emoji: true,
            },
        ],
        footer: {
            type: 'context',
            elements: [
                {
                    type: 'plain_text',
                    text: 'Srivastava',
                },
            ],
        },
    },
];
exports.previewWithImage = [
    {
        type: 'preview',
        title: [
            {
                type: 'plain_text',
                text: 'Vivek',
                emoji: true,
            },
        ],
        description: [
            {
                type: 'plain_text',
                text: 'I Need a Description',
                emoji: true,
            },
        ],
        thumb: { url: 'https://picsum.photos/200/300' },
        footer: {
            type: 'context',
            elements: [
                {
                    type: 'plain_text',
                    text: 'Srivastava',
                },
            ],
        },
    },
];
exports.previewWithUrl = [
    {
        type: 'preview',
        title: [
            {
                type: 'plain_text',
                text: 'Vivek',
                emoji: true,
            },
        ],
        description: [
            {
                type: 'plain_text',
                text: 'I Need a Description',
                emoji: true,
            },
        ],
        footer: {
            type: 'context',
            elements: [
                {
                    type: 'plain_text',
                    text: 'Srivastava',
                },
            ],
        },
        externalUrl: 'https://rocket.chat',
    },
];
exports.previewWithImageAndUrl = [
    {
        type: 'preview',
        title: [
            {
                type: 'plain_text',
                text: 'Vivek',
                emoji: true,
            },
        ],
        description: [
            {
                type: 'plain_text',
                text: 'I Need a Description',
                emoji: true,
            },
        ],
        thumb: { url: 'https://picsum.photos/200/300' },
        footer: {
            type: 'context',
            elements: [
                {
                    type: 'plain_text',
                    text: 'Srivastava',
                },
            ],
        },
        // externalUrl: 'https://rocket.chat',
    },
];
