"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePresence = void 0;
const react_1 = require("react");
const shim_1 = require("use-sync-external-store/shim");
const presence_1 = require("../lib/presence");
/**
 * @deprecated
 * Hook to fetch and subscribe users presence
 *
 * @param uid - User Id
 * @returns UserPresence
 * @public
 */
const usePresence = (uid) => {
    const subscribe = (0, react_1.useCallback)((callback) => {
        uid && presence_1.Presence.listen(uid, callback);
        return () => {
            uid && presence_1.Presence.stop(uid, callback);
        };
    }, [uid]);
    const getSnapshot = () => (uid ? presence_1.Presence.store.get(uid) : undefined);
    return (0, shim_1.useSyncExternalStore)(subscribe, getSnapshot);
};
exports.usePresence = usePresence;
