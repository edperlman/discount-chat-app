"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicRoomType = getPublicRoomType;
function getPublicRoomType(_coordinator) {
    return {
        identifier: 'c',
        route: {
            name: 'channel',
            path: '/channel/:name/:tab?/:context?',
        },
    };
}
