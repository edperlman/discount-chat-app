"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDirectMessageRoomType = getDirectMessageRoomType;
function getDirectMessageRoomType(_coordinator) {
    return {
        identifier: 'd',
        route: {
            name: 'direct',
            path: '/direct/:rid/:tab?/:context?',
            link(sub) {
                return { rid: sub.rid || sub.name || '' };
            },
        },
    };
}
