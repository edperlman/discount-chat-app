"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isWidget = void 0;
const cookie_1 = require("cookie");
const isWidget = (headers = {}) => {
    const { rc_room_type: roomType, rc_is_widget: isWidget } = (0, cookie_1.parse)(headers.cookie || '');
    const isLivechatRoom = roomType && roomType === 'l';
    return !!(isLivechatRoom && isWidget === 't');
};
exports.isWidget = isWidget;
