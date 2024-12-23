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
const callbacks_1 = require("../../../lib/callbacks");
const afterLogoutCleanUpCallback_1 = require("../../../lib/callbacks/afterLogoutCleanUpCallback");
const fireGlobalEvent_1 = require("../../lib/utils/fireGlobalEvent");
meteor_1.Meteor.startup(() => {
    afterLogoutCleanUpCallback_1.afterLogoutCleanUpCallback.add(() => __awaiter(void 0, void 0, void 0, function* () { return (0, fireGlobalEvent_1.fireGlobalEvent)('Custom_Script_On_Logout'); }), callbacks_1.callbacks.priority.LOW, 'custom-script-on-logout');
});
