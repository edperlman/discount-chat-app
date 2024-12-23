"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useE2EERoomState = void 0;
const react_1 = require("react");
const shim_1 = require("use-sync-external-store/shim");
const useE2EERoom_1 = require("./useE2EERoom");
const useE2EERoomState = (rid) => {
    const e2eRoom = (0, useE2EERoom_1.useE2EERoom)(rid);
    const subscribeE2EERoomState = (0, react_1.useMemo)(() => [
        (callback) => (e2eRoom ? e2eRoom.onStateChange(callback) : () => undefined),
        () => (e2eRoom ? e2eRoom.getState() : undefined),
    ], [e2eRoom]);
    return (0, shim_1.useSyncExternalStore)(...subscribeE2EERoomState);
};
exports.useE2EERoomState = useE2EERoomState;
