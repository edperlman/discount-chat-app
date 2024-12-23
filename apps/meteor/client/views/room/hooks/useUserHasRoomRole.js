"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUserHasRoomRole = void 0;
const react_1 = require("react");
const client_1 = require("../../../../app/models/client");
const useReactiveValue_1 = require("../../../hooks/useReactiveValue");
const useUserHasRoomRole = (uid, rid, role) => (0, useReactiveValue_1.useReactiveValue)((0, react_1.useCallback)(() => !!client_1.RoomRoles.findOne({ rid, 'u._id': uid, 'roles': role }), [uid, rid, role]));
exports.useUserHasRoomRole = useUserHasRoomRole;
