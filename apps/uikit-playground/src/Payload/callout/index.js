"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calloutWithAction = exports.callout = void 0;
exports.callout = [
    {
        type: 'callout',
        title: {
            type: 'plain_text',
            text: 'Callout Title',
        },
        text: {
            type: 'plain_text',
            text: 'Callout Text',
        },
    },
];
exports.calloutWithAction = [
    {
        type: 'callout',
        title: {
            type: 'plain_text',
            text: 'Callout Title',
        },
        text: {
            type: 'plain_text',
            text: 'Callout Text',
        },
        accessory: {
            type: 'button',
            text: {
                type: 'plain_text',
                text: 'Callout Action',
            },
            actionId: 'callout-action',
            blockId: 'callout-action',
            appId: 'A',
        },
    },
];
