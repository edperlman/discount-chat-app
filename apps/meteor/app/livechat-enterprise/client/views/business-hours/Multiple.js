"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultipleBusinessHoursBehavior = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
class MultipleBusinessHoursBehavior {
    getView() {
        return 'livechatBusinessHours';
    }
    showCustomTemplate(businessHourData) {
        return !businessHourData._id || businessHourData.type !== core_typings_1.LivechatBusinessHourTypes.DEFAULT;
    }
    showBackButton() {
        return true;
    }
}
exports.MultipleBusinessHoursBehavior = MultipleBusinessHoursBehavior;
