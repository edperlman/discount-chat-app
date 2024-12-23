"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useVoipFooterMenu = void 0;
const react_1 = require("react");
const useDevicesMenuOption_1 = require("./useDevicesMenuOption");
const useVoipFooterMenu = () => {
    const deviceMenuOption = (0, useDevicesMenuOption_1.useDevicesMenuOption)();
    const options = (0, react_1.useMemo)(() => deviceMenuOption && {
        deviceSettings: deviceMenuOption,
    }, [deviceMenuOption]);
    return options;
};
exports.useVoipFooterMenu = useVoipFooterMenu;
