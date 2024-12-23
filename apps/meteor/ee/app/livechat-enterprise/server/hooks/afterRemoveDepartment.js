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
const logger_1 = require("../lib/logger");
const afterRemoveDepartment = (options) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(options === null || options === void 0 ? void 0 : options.department)) {
        logger_1.cbLogger.warn('No department found in options', options);
        return options;
    }
    const { department } = options;
    logger_1.cbLogger.debug({
        msg: 'Post removal actions on EE code for department',
        department,
    });
    yield Promise.all([
        models_1.LivechatDepartment.removeDepartmentFromForwardListById(department._id),
        ...(department.parentId ? [models_1.LivechatUnit.decrementDepartmentsCount(department.parentId)] : []),
    ]);
    return options;
});
callbacks_1.callbacks.add('livechat.afterRemoveDepartment', (options) => afterRemoveDepartment(options), callbacks_1.callbacks.priority.HIGH, 'livechat-after-remove-department');
