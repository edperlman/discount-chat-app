"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingleBusinessHourBehavior = void 0;
class SingleBusinessHourBehavior {
    getView() {
        return 'livechatBusinessHoursForm';
    }
    showCustomTemplate() {
        return false;
    }
    showBackButton() {
        return false;
    }
}
exports.SingleBusinessHourBehavior = SingleBusinessHourBehavior;
