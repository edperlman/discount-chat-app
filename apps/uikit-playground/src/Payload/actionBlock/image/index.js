"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageWithoutTitle = exports.imageWithTitle = void 0;
exports.imageWithTitle = [
    {
        type: 'image',
        title: {
            type: 'plain_text',
            text: 'I Need a Marg',
            emoji: true,
        },
        imageUrl: 'https://picsum.photos/200/300',
        altText: 'marg',
    },
];
exports.imageWithoutTitle = [
    {
        type: 'image',
        imageUrl: 'https://picsum.photos/200/300',
        altText: 'inspiration',
    },
];
