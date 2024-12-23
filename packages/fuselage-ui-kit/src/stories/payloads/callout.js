"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calloutWithAction = exports.callout = void 0;
exports.callout = [
    {
        type: 'callout',
        title: {
            type: 'plain_text',
            text: 'Callout',
        },
        text: {
            type: 'plain_text',
            text: 'This is a callout',
        },
        variant: 'info',
    },
];
exports.calloutWithAction = [
    {
        type: 'callout',
        title: {
            type: 'plain_text',
            text: 'Callout',
        },
        text: {
            type: 'plain_text',
            text: 'This is a callout',
        },
        variant: 'info',
        accessory: {
            appId: 'dummy-app-id',
            blockId: 'dummy-block-id',
            actionId: 'dummy-action-id',
            type: 'button',
            text: {
                type: 'plain_text',
                text: 'Action',
            },
        },
    },
];
