"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVoipRoomType = getVoipRoomType;
function getVoipRoomType(_coordinator) {
    return {
        identifier: 'v',
        route: {
            name: 'voip',
            path: '/voip/:id/:tab?/:context?',
            link({ rid }) {
                return { id: rid || '', tab: 'voip-room-info' };
            },
        },
    };
}
