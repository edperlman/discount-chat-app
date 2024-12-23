"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const RoomEdit_1 = __importDefault(require("./RoomEdit"));
const components_1 = require("../../../components");
const useOmnichannelRoomInfo_1 = require("../../../hooks/useOmnichannelRoomInfo");
const useVisitorInfo_1 = require("../../../hooks/useVisitorInfo");
function RoomEditWithData({ id: roomId, reload, reloadInfo, onClose }) {
    var _a;
    const { t } = (0, react_i18next_1.useTranslation)();
    const { data: room, isLoading: isRoomLoading, isError: isRoomError } = (0, useOmnichannelRoomInfo_1.useOmnichannelRoomInfo)(roomId);
    const { _id: visitorId } = (_a = room === null || room === void 0 ? void 0 : room.v) !== null && _a !== void 0 ? _a : {};
    const { data: visitor, isInitialLoading: isVisitorLoading, isError: isVisitorError, } = (0, useVisitorInfo_1.useVisitorInfo)(visitorId, { enabled: !!visitorId });
    if (isRoomLoading || isVisitorLoading) {
        return (0, jsx_runtime_1.jsx)(components_1.FormSkeleton, {});
    }
    if (isRoomError || !room) {
        return (0, jsx_runtime_1.jsx)(fuselage_1.Box, { mbs: 16, children: t('Room_not_found') });
    }
    if (isVisitorError || !visitor) {
        return (0, jsx_runtime_1.jsx)(fuselage_1.Box, { mbs: 16, children: t('Visitor_not_found') });
    }
    return (0, jsx_runtime_1.jsx)(RoomEdit_1.default, { room: room, visitor: visitor, reload: reload, reloadInfo: reloadInfo, onClose: onClose });
}
exports.default = RoomEditWithData;
