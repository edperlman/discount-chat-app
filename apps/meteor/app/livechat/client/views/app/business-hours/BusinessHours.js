"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.businessHourManager = void 0;
const Single_1 = require("./Single");
class BusinessHoursManager {
    constructor(businessHour) {
        this.setBusinessHourBehavior(businessHour);
    }
    setBusinessHourBehavior(businessHour) {
        this.registerBusinessHourBehavior(businessHour);
    }
    registerBusinessHourBehavior(behavior) {
        this.behavior = behavior;
    }
    getTemplate() {
        return this.behavior.getView();
    }
    showCustomTemplate(businessHourData) {
        return this.behavior.showCustomTemplate(businessHourData);
    }
    showBackButton() {
        return this.behavior.showBackButton();
    }
}
exports.businessHourManager = new BusinessHoursManager(new Single_1.SingleBusinessHourBehavior());
