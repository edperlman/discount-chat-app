"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDevicesMenuOption = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const useHasLicenseModule_1 = require("./useHasLicenseModule");
const DeviceSettingsModal_1 = __importDefault(require("../voip/modals/DeviceSettingsModal"));
const useDevicesMenuOption = () => {
    const isEnterprise = (0, useHasLicenseModule_1.useHasLicenseModule)('voip-enterprise');
    const { t } = (0, react_i18next_1.useTranslation)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const option = {
        label: ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { alignItems: 'center', display: 'flex', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Icon, { mie: 4, name: 'customize', size: 'x16' }), t('Device_settings')] })),
        action: () => setModal((0, jsx_runtime_1.jsx)(DeviceSettingsModal_1.default, {})),
    };
    return isEnterprise ? option : null;
};
exports.useDevicesMenuOption = useDevicesMenuOption;
