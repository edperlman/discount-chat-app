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
const models_1 = require("@rocket.chat/models");
const callbacks_1 = require("../../../../../lib/callbacks");
callbacks_1.callbacks.add('livechat.onLoadForwardDepartmentRestrictions', (options) => __awaiter(void 0, void 0, void 0, function* () {
    const { departmentId } = options;
    if (!departmentId) {
        return options;
    }
    const department = yield models_1.LivechatDepartment.findOneById(departmentId, {
        projection: { departmentsAllowedToForward: 1 },
    });
    if (!department) {
        return options;
    }
    const { departmentsAllowedToForward } = department;
    if (!departmentsAllowedToForward) {
        return options;
    }
    return Object.assign({ restrictions: { _id: { $in: departmentsAllowedToForward } } }, options);
}), callbacks_1.callbacks.priority.MEDIUM, 'livechat-on-load-forward-department-restrictions');
