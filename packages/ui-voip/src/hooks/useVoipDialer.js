"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useVoipDialer = void 0;
const useVoipAPI_1 = require("./useVoipAPI");
const useVoipEvent_1 = require("./useVoipEvent");
const useVoipDialer = () => {
    const { openDialer, closeDialer } = (0, useVoipAPI_1.useVoipAPI)();
    const { open } = (0, useVoipEvent_1.useVoipEvent)('dialer', { open: false });
    return {
        open,
        openDialer: openDialer || (() => undefined),
        closeDialer: closeDialer || (() => undefined),
    };
};
exports.useVoipDialer = useVoipDialer;
