"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sectionWithButtonAsLink = exports.sectionWithButtonSecondaryWithVariant = exports.sectionWithButtonWarning = exports.sectionWithButtonSuccess = exports.sectionWithButtonDanger = exports.sectionWithButtonPrimary = exports.sectionWithButtonDefault = void 0;
exports.sectionWithButtonDefault = [
    {
        type: 'section',
        text: {
            type: 'mrkdwn',
            text: 'This is a section block with a button.',
        },
        accessory: {
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
    },
];
exports.sectionWithButtonPrimary = [
    {
        type: 'section',
        text: {
            type: 'mrkdwn',
            text: 'This is a section block with a button.',
        },
        accessory: {
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
    },
];
exports.sectionWithButtonDanger = [
    {
        type: 'section',
        text: {
            type: 'mrkdwn',
            text: 'This is a section block with a button.',
        },
        accessory: {
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
    },
];
exports.sectionWithButtonSuccess = [
    {
        type: 'section',
        text: {
            type: 'mrkdwn',
            text: 'This is a section block with a button.',
        },
        accessory: {
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
    },
];
exports.sectionWithButtonWarning = [
    {
        type: 'section',
        text: {
            type: 'mrkdwn',
            text: 'This is a section block with a button.',
        },
        accessory: {
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
    },
];
exports.sectionWithButtonSecondaryWithVariant = [
    {
        type: 'section',
        text: {
            type: 'mrkdwn',
            text: 'This is a section block with a button.',
        },
        accessory: {
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
    },
];
exports.sectionWithButtonAsLink = [
    {
        type: 'section',
        text: {
            type: 'mrkdwn',
            text: 'This is a section block with a button.',
        },
        accessory: {
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
    },
];
