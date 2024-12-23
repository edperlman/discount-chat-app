"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.previewWithExternalUrl = exports.preview = void 0;
const img_1 = __importDefault(require("./img"));
exports.preview = [
    {
        type: 'preview',
        title: [
            {
                type: 'plain_text',
                text: 'I Need a Marg',
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
        thumb: { url: img_1.default },
        footer: {
            type: 'context',
            elements: [
                {
                    type: 'plain_text',
                    text: 'google.com',
                },
            ],
        },
    },
];
exports.previewWithExternalUrl = [
    {
        type: 'preview',
        title: [
            {
                type: 'plain_text',
                text: 'I Need a Marg',
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
        // thumb: { url: img },
        footer: {
            type: 'context',
            elements: [
                {
                    type: 'plain_text',
                    text: 'google.com',
                },
            ],
        },
        externalUrl: 'https://rocketchat.github.io/Rocket.Chat.Fuselage/?path=/story/*',
    },
];
