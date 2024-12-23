"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const beforeCreateRoomCallback_1 = require("../../../lib/callbacks/beforeCreateRoomCallback");
const server_1 = require("../../settings/server");
beforeCreateRoomCallback_1.beforeCreateRoomCallback.add(({ type, extraData }) => {
    var _a;
    if (server_1.settings.get('E2E_Enable') &&
        ((type === 'd' && server_1.settings.get('E2E_Enabled_Default_DirectRooms')) ||
            (type === 'p' && server_1.settings.get('E2E_Enabled_Default_PrivateRooms')))) {
        extraData.encrypted = (_a = extraData.encrypted) !== null && _a !== void 0 ? _a : true;
    }
});
