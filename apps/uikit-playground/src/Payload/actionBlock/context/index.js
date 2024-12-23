"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contextWithAllElements = exports.contextWithImage = exports.contextWithMrkdwn = exports.contextWithPlainText = void 0;
exports.contextWithPlainText = [
    {
        type: 'context',
        elements: [
            {
                type: 'plain_text',
                text: 'Author: Vivek Srivastava',
                emoji: true,
            },
        ],
    },
];
exports.contextWithMrkdwn = [
    {
        type: 'context',
        elements: [
            {
                type: 'mrkdwn',
                text: '*This* is :smile: markdown',
            },
        ],
    },
];
exports.contextWithImage = [
    {
        type: 'context',
        elements: [
            {
                type: 'image',
                imageUrl: 'https://picsum.photos/200/300',
                altText: 'An image',
            },
        ],
    },
];
exports.contextWithAllElements = [
    {
        type: 'context',
        elements: [
            {
                type: 'plain_text',
                text: 'Author: Vivek Srivastava',
                emoji: true,
            },
            {
                type: 'image',
                imageUrl: 'https://picsum.photos/200/300',
                altText: 'An image',
            },
            {
                type: 'mrkdwn',
                text: '*This* is :smile: markdown',
            },
        ],
    },
];
