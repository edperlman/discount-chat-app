"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useVoipDeviceSettings = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_i18next_1 = require("react-i18next");
const useVoipAPI_1 = require("../../../hooks/useVoipAPI");
const useVoipDeviceSettings = () => {
    var _a, _b;
    const { t } = (0, react_i18next_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const { changeAudioInputDevice, changeAudioOutputDevice } = (0, useVoipAPI_1.useVoipAPI)();
    const availableDevices = (0, ui_contexts_1.useAvailableDevices)();
    const selectedAudioDevices = (0, ui_contexts_1.useSelectedDevices)();
    const changeInputDevice = (0, react_query_1.useMutation)({
        mutationFn: changeAudioInputDevice,
        onSuccess: () => dispatchToastMessage({ type: 'success', message: t('Devices_Set') }),
        onError: (error) => dispatchToastMessage({ type: 'error', message: error }),
    });
    const changeOutputDevice = (0, react_query_1.useMutation)({
        mutationFn: changeAudioOutputDevice,
        onSuccess: () => dispatchToastMessage({ type: 'success', message: t('Devices_Set') }),
        onError: (error) => dispatchToastMessage({ type: 'error', message: error }),
    });
    const availableInputDevice = ((_a = availableDevices === null || availableDevices === void 0 ? void 0 : availableDevices.audioInput) === null || _a === void 0 ? void 0 : _a.map((device) => {
        var _a;
        return ({
            id: device.id,
            content: ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'span', title: device.label, fontSize: 14, children: device.label })),
            addon: (0, jsx_runtime_1.jsx)(fuselage_1.RadioButton, { onChange: () => changeInputDevice.mutate(device), checked: device.id === ((_a = selectedAudioDevices === null || selectedAudioDevices === void 0 ? void 0 : selectedAudioDevices.audioInput) === null || _a === void 0 ? void 0 : _a.id) }),
        });
    })) || [];
    const availableOutputDevice = ((_b = availableDevices === null || availableDevices === void 0 ? void 0 : availableDevices.audioOutput) === null || _b === void 0 ? void 0 : _b.map((device) => {
        var _a;
        return ({
            id: device.id,
            content: ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'span', title: device.label, fontSize: 14, children: device.label })),
            addon: ((0, jsx_runtime_1.jsx)(fuselage_1.RadioButton, { onChange: () => changeOutputDevice.mutate(device), checked: device.id === ((_a = selectedAudioDevices === null || selectedAudioDevices === void 0 ? void 0 : selectedAudioDevices.audioOutput) === null || _a === void 0 ? void 0 : _a.id) })),
            onClick(e) {
                e === null || e === void 0 ? void 0 : e.preventDefault();
                e === null || e === void 0 ? void 0 : e.stopPropagation();
            },
        });
    })) || [];
    const micSection = {
        title: t('Microphone'),
        items: availableInputDevice,
    };
    const speakerSection = {
        title: t('Speaker'),
        items: availableOutputDevice,
    };
    const disabled = !micSection.items.length || !speakerSection.items.length;
    return {
        disabled,
        title: disabled ? t('Device_settings_not_supported_by_browser') : t('Device_settings'),
        sections: [micSection, speakerSection],
    };
};
exports.useVoipDeviceSettings = useVoipDeviceSettings;
