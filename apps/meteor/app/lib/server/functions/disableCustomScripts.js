"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disableCustomScripts = void 0;
const license_1 = require("@rocket.chat/license");
const disableCustomScripts = () => {
    const license = license_1.License.getLicense();
    if (!license) {
        return false;
    }
    const isCustomScriptDisabled = process.env.DISABLE_CUSTOM_SCRIPTS === 'true';
    const isTrialLicense = license === null || license === void 0 ? void 0 : license.information.trial;
    return isCustomScriptDisabled && isTrialLicense;
};
exports.disableCustomScripts = disableCustomScripts;
