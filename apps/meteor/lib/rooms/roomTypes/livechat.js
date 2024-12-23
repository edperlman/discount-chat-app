"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLivechatRoomType = getLivechatRoomType;
function getLivechatRoomType(_coordinator) {
    return {
        identifier: 'l',
        route: {
            name: 'live',
            path: '/live/:id/:tab?/:context?',
            link({ rid, tab }) {
                return { id: rid || '', tab: tab !== null && tab !== void 0 ? tab : 'room-info' };
            },
        },
    };
}
