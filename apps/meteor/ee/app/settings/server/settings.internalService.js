"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnterpriseSettings = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const settings_1 = require("./settings");
class EnterpriseSettings extends core_services_1.ServiceClassInternal {
    constructor() {
        super(...arguments);
        this.name = 'ee-settings';
        this.internal = true;
    }
    changeSettingValue(record) {
        return (0, settings_1.changeSettingValue)(record);
    }
}
exports.EnterpriseSettings = EnterpriseSettings;
