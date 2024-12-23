"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sectionWithImage = void 0;
exports.sectionWithImage = [
    {
        type: 'section',
        text: {
            type: 'mrkdwn',
            text: 'This is a section block with an accessory image.',
        },
        accessory: {
            type: 'image',
            imageUrl: 'https://picsum.photos/200/300',
            altText: 'cute cat',
        },
    },
];
