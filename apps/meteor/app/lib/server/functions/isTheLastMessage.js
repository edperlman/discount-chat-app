"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTheLastMessage = void 0;
const server_1 = require("../../../settings/server");
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const isTheLastMessage = (room, message) => server_1.settings.get('Store_Last_Message') && (!room.lastMessage || room.lastMessage._id === message._id);
exports.isTheLastMessage = isTheLastMessage;
