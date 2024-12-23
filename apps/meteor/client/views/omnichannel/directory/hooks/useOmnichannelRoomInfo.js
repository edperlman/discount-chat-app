"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOmnichannelRoomInfo = void 0;
const useRoomInfoEndpoint_1 = require("../../../../hooks/useRoomInfoEndpoint");
const useOmnichannelRoomInfo = (roomId) => {
    const _a = (0, useRoomInfoEndpoint_1.useRoomInfoEndpoint)(roomId), { data: roomData } = _a, props = __rest(_a, ["data"]);
    const room = roomData === null || roomData === void 0 ? void 0 : roomData.room;
    return Object.assign({ data: room }, props);
};
exports.useOmnichannelRoomInfo = useOmnichannelRoomInfo;
