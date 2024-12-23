"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWebRtcServers = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const parseStringToIceServers_1 = require("../utils/parseStringToIceServers");
const useWebRtcServers = () => {
    const servers = (0, ui_contexts_1.useSetting)('WebRTC_Servers');
    return (0, react_1.useMemo)(() => {
        if (typeof servers !== 'string' || !servers.trim()) {
            return [];
        }
        return (0, parseStringToIceServers_1.parseStringToIceServers)(servers);
    }, [servers]);
};
exports.useWebRtcServers = useWebRtcServers;
