"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOmnichannelRoomIcon = exports.OmnichannelRoomIconContext = void 0;
const react_1 = require("react");
const shim_1 = require("use-sync-external-store/shim");
const AsyncStatePhase_1 = require("../../../../lib/asyncState/AsyncStatePhase");
exports.OmnichannelRoomIconContext = (0, react_1.createContext)({
    queryIcon: () => [
        () => () => undefined,
        () => ({
            phase: AsyncStatePhase_1.AsyncStatePhase.LOADING,
            value: undefined,
            error: undefined,
        }),
    ],
});
const useOmnichannelRoomIcon = (app, icon) => {
    const { queryIcon } = (0, react_1.useContext)(exports.OmnichannelRoomIconContext);
    const [subscribe, getSnapshot] = (0, react_1.useMemo)(() => queryIcon(app, icon), [app, queryIcon, icon]);
    return (0, shim_1.useSyncExternalStore)(subscribe, getSnapshot);
};
exports.useOmnichannelRoomIcon = useOmnichannelRoomIcon;
