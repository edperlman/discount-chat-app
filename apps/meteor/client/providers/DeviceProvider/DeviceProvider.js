"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceProvider = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const isSetSinkIdAvailable_1 = require("./lib/isSetSinkIdAvailable");
const DeviceProvider = ({ children }) => {
    const [enabled] = (0, react_1.useState)(typeof isSecureContext && isSecureContext);
    const [availableAudioOutputDevices, setAvailableAudioOutputDevices] = (0, react_1.useState)([]);
    const [availableAudioInputDevices, setAvailableAudioInputDevices] = (0, react_1.useState)([]);
    const [selectedAudioOutputDevice, setSelectedAudioOutputDevice] = (0, react_1.useState)({
        id: 'default',
        label: '',
        type: 'audio',
    });
    const [selectedAudioInputDevice, setSelectedAudioInputDevice] = (0, react_1.useState)({
        id: 'default',
        label: '',
        type: 'audio',
    });
    const setAudioInputDevice = (device) => {
        if (!isSecureContext) {
            throw new Error('Device Changes are not available on insecure contexts');
        }
        setSelectedAudioInputDevice(device);
    };
    const setAudioOutputDevice = (0, fuselage_hooks_1.useMutableCallback)(({ outputDevice, HTMLAudioElement }) => {
        if (!(0, isSetSinkIdAvailable_1.isSetSinkIdAvailable)()) {
            throw new Error('setSinkId is not available in this browser');
        }
        if (!enabled) {
            throw new Error('Device Changes are not available on insecure contexts');
        }
        setSelectedAudioOutputDevice(outputDevice);
        HTMLAudioElement.setSinkId(outputDevice.id);
    });
    (0, react_1.useEffect)(() => {
        var _a;
        if (!enabled) {
            return;
        }
        const setMediaDevices = () => {
            var _a;
            (_a = navigator.mediaDevices) === null || _a === void 0 ? void 0 : _a.enumerateDevices().then((devices) => {
                const audioInput = [];
                const audioOutput = [];
                devices.forEach((device) => {
                    const mediaDevice = {
                        id: device.deviceId,
                        label: device.label,
                        type: device.kind,
                    };
                    if (device.kind === 'audioinput') {
                        audioInput.push(mediaDevice);
                    }
                    else if (device.kind === 'audiooutput') {
                        audioOutput.push(mediaDevice);
                    }
                });
                setAvailableAudioOutputDevices(audioOutput);
                setAvailableAudioInputDevices(audioInput);
            });
        };
        (_a = navigator.mediaDevices) === null || _a === void 0 ? void 0 : _a.addEventListener('devicechange', setMediaDevices);
        setMediaDevices();
        return () => {
            var _a;
            (_a = navigator.mediaDevices) === null || _a === void 0 ? void 0 : _a.removeEventListener('devicechange', setMediaDevices);
        };
    }, [enabled]);
    const contextValue = (0, react_1.useMemo)(() => {
        if (!enabled) {
            return {
                enabled,
            };
        }
        return {
            enabled,
            availableAudioOutputDevices,
            availableAudioInputDevices,
            selectedAudioOutputDevice,
            selectedAudioInputDevice,
            setAudioOutputDevice,
            setAudioInputDevice,
        };
    }, [
        availableAudioInputDevices,
        availableAudioOutputDevices,
        enabled,
        selectedAudioInputDevice,
        selectedAudioOutputDevice,
        setAudioOutputDevice,
    ]);
    return (0, jsx_runtime_1.jsx)(ui_contexts_1.DeviceContext.Provider, { value: contextValue, children: children });
};
exports.DeviceProvider = DeviceProvider;
