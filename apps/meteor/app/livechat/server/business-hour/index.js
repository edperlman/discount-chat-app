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
exports.businessHourManager = void 0;
const cron_1 = require("@rocket.chat/cron");
const accounts_base_1 = require("meteor/accounts-base");
const meteor_1 = require("meteor/meteor");
const BusinessHourManager_1 = require("./BusinessHourManager");
const Default_1 = require("./Default");
const Single_1 = require("./Single");
const callbacks_1 = require("../../../../lib/callbacks");
exports.businessHourManager = new BusinessHourManager_1.BusinessHourManager(cron_1.cronJobs);
meteor_1.Meteor.startup(() => __awaiter(void 0, void 0, void 0, function* () {
    const { BusinessHourBehaviorClass } = yield callbacks_1.callbacks.run('on-business-hour-start', {
        BusinessHourBehaviorClass: Single_1.SingleBusinessHourBehavior,
    });
    exports.businessHourManager.registerBusinessHourBehavior(new BusinessHourBehaviorClass());
    exports.businessHourManager.registerBusinessHourType(new Default_1.DefaultBusinessHour());
    accounts_base_1.Accounts.onLogin(({ user }) => {
        var _a, _b;
        void (((_a = user === null || user === void 0 ? void 0 : user.roles) === null || _a === void 0 ? void 0 : _a.includes('livechat-agent')) && !((_b = user === null || user === void 0 ? void 0 : user.roles) === null || _b === void 0 ? void 0 : _b.includes('bot')) && exports.businessHourManager.onLogin(user._id));
    });
}));
