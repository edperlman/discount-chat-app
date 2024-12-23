"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUserData = void 0;
const react_1 = require("react");
const shim_1 = require("use-sync-external-store/shim");
const UserPresenceContext_1 = require("../contexts/UserPresenceContext");
/**
 * Hook to fetch and subscribe users data
 *
 * @param uid - User Id
 * @returns Users data: status, statusText, username, name
 * @public
 */
const useUserData = (uid) => {
    const userPresence = (0, react_1.useContext)(UserPresenceContext_1.UserPresenceContext);
    const { subscribe, get } = (0, react_1.useMemo)(() => { var _a; return (_a = userPresence === null || userPresence === void 0 ? void 0 : userPresence.queryUserData(uid)) !== null && _a !== void 0 ? _a : { subscribe: () => () => undefined, get: () => undefined }; }, [userPresence, uid]);
    return (0, shim_1.useSyncExternalStore)(subscribe, get);
};
exports.useUserData = useUserData;
