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
exports.OmnichannelSortingDisclaimer = exports.useOmnichannelSortingDisclaimer = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const core_typings_1 = require("@rocket.chat/core-typings");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const useOmnichannelEnterpriseEnabled_1 = require("../../hooks/omnichannel/useOmnichannelEnterpriseEnabled");
const useOmnichannelSortingDisclaimer = () => {
    const isOmnichannelEnabled = (0, useOmnichannelEnterpriseEnabled_1.useOmnichannelEnterpriseEnabled)();
    const sortingMechanism = (0, ui_contexts_1.useSetting)('Omnichannel_sorting_mechanism', core_typings_1.OmnichannelSortingMechanismSettingType.Timestamp);
    const [{ [sortingMechanism]: type }] = (0, react_1.useState)({
        [core_typings_1.OmnichannelSortingMechanismSettingType.Priority]: 'Priorities',
        [core_typings_1.OmnichannelSortingMechanismSettingType.SLAs]: 'SLA_Policies',
        [core_typings_1.OmnichannelSortingMechanismSettingType.Timestamp]: '',
    });
    return isOmnichannelEnabled ? type : '';
};
exports.useOmnichannelSortingDisclaimer = useOmnichannelSortingDisclaimer;
const OmnichannelSortingDisclaimer = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const type = (0, exports.useOmnichannelSortingDisclaimer)();
    if (!type) {
        return null;
    }
    return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: t('Omnichannel_sorting_disclaimer', { sortingMechanism: t(type) }) });
};
exports.OmnichannelSortingDisclaimer = OmnichannelSortingDisclaimer;
