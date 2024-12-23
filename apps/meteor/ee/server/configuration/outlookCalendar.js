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
const core_services_1 = require("@rocket.chat/core-services");
const license_1 = require("@rocket.chat/license");
const meteor_1 = require("meteor/meteor");
const outlookCalendar_1 = require("../settings/outlookCalendar");
meteor_1.Meteor.startup(() => license_1.License.onLicense('outlook-calendar', () => __awaiter(void 0, void 0, void 0, function* () {
    (0, outlookCalendar_1.addSettings)();
    yield core_services_1.Calendar.setupNextNotification();
})));
