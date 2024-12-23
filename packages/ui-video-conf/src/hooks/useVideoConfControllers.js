"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useVideoConfControllers = void 0;
const react_1 = require("react");
const useVideoConfControllers = (initialPreferences = { mic: true, cam: false }) => {
    const [controllersConfig, setControllersConfig] = (0, react_1.useState)(initialPreferences);
    const handleToggleMic = (0, react_1.useCallback)(() => setControllersConfig((prevState) => (Object.assign(Object.assign({}, prevState), { mic: !prevState.mic }))), []);
    const handleToggleCam = (0, react_1.useCallback)(() => setControllersConfig((prevState) => (Object.assign(Object.assign({}, prevState), { cam: !prevState.cam }))), []);
    return {
        controllersConfig,
        handleToggleMic,
        handleToggleCam,
    };
};
exports.useVideoConfControllers = useVideoConfControllers;
