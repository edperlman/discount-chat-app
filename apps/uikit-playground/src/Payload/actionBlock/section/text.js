"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sectionWithTextFields = exports.sectionWithMrkdwn = exports.sectionWithPlainText = void 0;
exports.sectionWithPlainText = [
    {
        type: 'section',
        text: {
            type: 'plain_text',
            text: 'This is a plain text section block.',
            emoji: true,
        },
    },
];
exports.sectionWithMrkdwn = [
    {
        type: 'section',
        text: {
            type: 'mrkdwn',
            text: 'This is a mrkdwn section block :ghost: *this is bold*, and ~this is crossed out~, and <https://google.com|this is a link>',
        },
    },
];
exports.sectionWithTextFields = [
    {
        type: 'section',
        fields: [
            {
                type: 'plain_text',
                text: '*this is plain_text text*',
                emoji: true,
            },
            {
                type: 'plain_text',
                text: '*this is plain_text text*',
                emoji: true,
            },
            {
                type: 'plain_text',
                text: '*this is plain_text text*',
                emoji: true,
            },
            {
                type: 'plain_text',
                text: '*this is plain_text text*',
                emoji: true,
            },
            {
                type: 'plain_text',
                text: '*this is plain_text text*',
                emoji: true,
            },
        ],
    },
];
