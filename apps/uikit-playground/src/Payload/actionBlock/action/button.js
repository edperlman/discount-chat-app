"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actionWithButtonAsLink = exports.actionWithButtonSecondaryWithVariant = exports.actionWithButtonWarning = exports.actionWithButtonSuccess = exports.actionWithButtonDanger = exports.actionWithButtonSecondary = exports.actionWithButtonPrimary = exports.actionWithButtonDefault = void 0;
exports.actionWithButtonDefault = [
    {
        type: 'actions',
        elements: [
            {
                type: 'button',
                appId: 'app-id',
                blockId: 'block-id',
                actionId: 'action-id',
                text: {
                    type: 'plain_text',
                    text: 'Click Me',
                    emoji: true,
                },
            },
        ],
    },
];
exports.actionWithButtonPrimary = [
    {
        type: 'actions',
        elements: [
            {
                type: 'button',
                appId: 'app-id',
                blockId: 'block-id',
                actionId: 'action-id',
                text: {
                    type: 'plain_text',
                    text: 'Click Me',
                    emoji: true,
                },
                style: 'primary',
            },
        ],
    },
];
exports.actionWithButtonSecondary = [
    {
        type: 'actions',
        elements: [
            {
                type: 'button',
                appId: 'app-id',
                blockId: 'block-id',
                actionId: 'action-id',
                text: {
                    type: 'plain_text',
                    text: 'Click Me',
                    emoji: true,
                },
                secondary: true,
            },
        ],
    },
];
exports.actionWithButtonDanger = [
    {
        type: 'actions',
        elements: [
            {
                type: 'button',
                appId: 'app-id',
                blockId: 'block-id',
                actionId: 'action-id',
                text: {
                    type: 'plain_text',
                    text: 'Click Me',
                    emoji: true,
                },
                style: 'danger',
            },
        ],
    },
];
exports.actionWithButtonSuccess = [
    {
        type: 'actions',
        elements: [
            {
                type: 'button',
                appId: 'app-id',
                blockId: 'block-id',
                actionId: 'action-id',
                text: {
                    type: 'plain_text',
                    text: 'Click Me',
                    emoji: true,
                },
                style: 'success',
            },
        ],
    },
];
exports.actionWithButtonWarning = [
    {
        type: 'actions',
        elements: [
            {
                type: 'button',
                appId: 'app-id',
                blockId: 'block-id',
                actionId: 'action-id',
                text: {
                    type: 'plain_text',
                    text: 'Click Me',
                    emoji: true,
                },
                style: 'warning',
            },
        ],
    },
];
exports.actionWithButtonSecondaryWithVariant = [
    {
        type: 'actions',
        elements: [
            {
                type: 'button',
                appId: 'app-id',
                blockId: 'block-id',
                actionId: 'action-id',
                text: {
                    type: 'plain_text',
                    text: 'Click Me',
                    emoji: true,
                },
                style: 'danger',
                secondary: true,
            },
        ],
    },
];
exports.actionWithButtonAsLink = [
    {
        type: 'actions',
        elements: [
            {
                type: 'button',
                appId: 'app-id',
                blockId: 'block-id',
                actionId: 'action-id',
                text: {
                    type: 'plain_text',
                    text: 'Click Me',
                    emoji: true,
                },
                url: 'https://rocket.chat',
            },
        ],
    },
];
