"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRoomToolbox = exports.RoomToolboxContext = void 0;
const react_1 = require("react");
exports.RoomToolboxContext = (0, react_1.createContext)({
    actions: [],
    openTab: () => undefined,
    closeTab: () => undefined,
});
const useRoomToolbox = () => (0, react_1.useContext)(exports.RoomToolboxContext);
exports.useRoomToolbox = useRoomToolbox;
