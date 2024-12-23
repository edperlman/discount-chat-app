"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contextDefinitions = void 0;
exports.contextDefinitions = {
    ROOM: {
        type: 'room',
        isRoom(event) {
            return !!event.context.roomId;
        },
        contextQuery(roomId) {
            return { roomId };
        },
    },
    defineType(event) {
        if (this.ROOM.isRoom(event)) {
            return this.ROOM.type;
        }
        return 'undefined';
    },
};
