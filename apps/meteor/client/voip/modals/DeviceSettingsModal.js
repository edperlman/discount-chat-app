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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const CallContext_1 = require("../../contexts/CallContext");
const isSetSinkIdAvailable_1 = require("../../providers/DeviceProvider/lib/isSetSinkIdAvailable");
const DeviceSettingsModal = () => {
    var _a, _b, _c, _d;
    const setModal = (0, ui_contexts_1.useSetModal)();
    const onCancel = () => setModal();
    const isDeviceManagementEnabled = (0, ui_contexts_1.useIsDeviceManagementEnabled)();
    const t = (0, ui_contexts_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const selectedAudioDevices = (0, ui_contexts_1.useSelectedDevices)();
    const { handleSubmit, control } = (0, react_hook_form_1.useForm)({
        defaultValues: {
            inputDevice: ((_a = selectedAudioDevices === null || selectedAudioDevices === void 0 ? void 0 : selectedAudioDevices.audioInput) === null || _a === void 0 ? void 0 : _a.id) || '',
            outputDevice: ((_b = selectedAudioDevices === null || selectedAudioDevices === void 0 ? void 0 : selectedAudioDevices.audioOutput) === null || _b === void 0 ? void 0 : _b.id) || '',
        },
    });
    const [setSinkIdAvailable] = (0, react_1.useState)(() => (0, isSetSinkIdAvailable_1.isSetSinkIdAvailable)());
    const availableDevices = (0, ui_contexts_1.useAvailableDevices)();
    const changeAudioInputDevice = (0, CallContext_1.useChangeAudioInputDevice)();
    const changeAudioOutputDevice = (0, CallContext_1.useChangeAudioOutputDevice)();
    const availableInputDevices = ((_c = availableDevices === null || availableDevices === void 0 ? void 0 : availableDevices.audioInput) === null || _c === void 0 ? void 0 : _c.map((device) => [device.id, device.label])) || [];
    const availableOutputDevices = ((_d = availableDevices === null || availableDevices === void 0 ? void 0 : availableDevices.audioOutput) === null || _d === void 0 ? void 0 : _d.map((device) => [device.id, device.label])) || [];
    const onSubmit = (data) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const selectedInputDevice = data.inputDevice && ((_a = availableDevices === null || availableDevices === void 0 ? void 0 : availableDevices.audioInput) === null || _a === void 0 ? void 0 : _a.find((device) => device.id === data.inputDevice));
        const selectedOutputDevice = data.outputDevice && ((_b = availableDevices === null || availableDevices === void 0 ? void 0 : availableDevices.audioOutput) === null || _b === void 0 ? void 0 : _b.find((device) => device.id === data.outputDevice));
        try {
            selectedInputDevice && changeAudioInputDevice(selectedInputDevice);
            selectedOutputDevice && changeAudioOutputDevice(selectedOutputDevice);
            setModal();
            dispatchToastMessage({ type: 'success', message: t('Devices_Set') });
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
    });
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Modal, { wrapperFunction: (props) => (0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({ is: 'form', onSubmit: handleSubmit(onSubmit) }, props)), children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Modal.Header, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Modal.Title, { children: t('Device_settings') }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Close, { onClick: onCancel })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Modal.Content, { fontScale: 'p2', children: [!setSinkIdAvailable && ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { color: 'status-font-on-danger', display: 'flex', flexDirection: 'column', children: [t('Device_Changes_Not_Available'), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'a', href: 'https://rocket.chat/download', target: '_blank', rel: 'noopener noreferrer', children: t('Download_Destkop_App') })] })), !isDeviceManagementEnabled && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { color: 'status-font-on-danger', display: 'flex', flexDirection: 'column', children: t('Device_Changes_Not_Available_Insecure_Context') })), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('Microphone') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { w: 'full', display: 'flex', flexDirection: 'column', alignItems: 'stretch', children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'inputDevice', control: control, render: ({ field }) => ((0, jsx_runtime_1.jsx)(fuselage_1.Select, Object.assign({ disabled: !setSinkIdAvailable }, field, { options: availableInputDevices || [] }))) }) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('Speakers') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { w: 'full', display: 'flex', flexDirection: 'column', alignItems: 'stretch', children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'outputDevice', control: control, render: ({ field }) => ((0, jsx_runtime_1.jsx)(fuselage_1.Select, Object.assign({ disabled: !setSinkIdAvailable }, field, { options: availableOutputDevices || [] }))) }) })] })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Footer, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Modal.FooterControllers, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: () => setModal(), children: t('Cancel') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { disabled: !setSinkIdAvailable, primary: true, onClick: handleSubmit(onSubmit), children: t('Save') })] }) })] }));
};
exports.default = DeviceSettingsModal;
