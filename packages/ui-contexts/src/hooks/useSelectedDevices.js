"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSelectedDevices = void 0;
const react_1 = require("react");
const DeviceContext_1 = require("../DeviceContext");
const useSelectedDevices = () => {
    const context = (0, react_1.useContext)(DeviceContext_1.DeviceContext);
    if (!(0, DeviceContext_1.isDeviceContextEnabled)(context)) {
        console.warn('Device Management is disabled on unsecure contexts, see https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts/features_restricted_to_secure_contexts');
        return null;
    }
    return {
        audioInput: context.selectedAudioInputDevice,
        audioOutput: context.selectedAudioOutputDevice,
    };
};
exports.useSelectedDevices = useSelectedDevices;
