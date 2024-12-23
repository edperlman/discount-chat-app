"use strict";
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
const meteor_1 = require("meteor/meteor");
const client_1 = require("../../license/client");
const BusinessHours_1 = require("../../livechat/client/views/app/business-hours/BusinessHours");
const Single_1 = require("../../livechat/client/views/app/business-hours/Single");
const client_2 = require("../../settings/client");
const Multiple_1 = require("./views/business-hours/Multiple");
const businessHours = {
    multiple: new Multiple_1.MultipleBusinessHoursBehavior(),
    single: new Single_1.SingleBusinessHourBehavior(),
};
meteor_1.Meteor.startup(() => {
    Tracker.autorun(() => __awaiter(void 0, void 0, void 0, function* () {
        const bhType = client_2.settings.get('Livechat_business_hour_type');
        if (bhType && (yield (0, client_1.hasLicense)('livechat-enterprise'))) {
            BusinessHours_1.businessHourManager.registerBusinessHourBehavior(businessHours[bhType.toLowerCase()]);
        }
    }));
});
