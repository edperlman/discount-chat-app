"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrivateRoomType = getPrivateRoomType;
function getPrivateRoomType(_coordinator) {
    return {
        identifier: 'p',
        route: {
            name: 'group',
            path: '/group/:name/:tab?/:context?',
        },
    };
}
