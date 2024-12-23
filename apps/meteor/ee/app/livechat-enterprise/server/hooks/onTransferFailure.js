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
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const Helper_1 = require("../../../../../app/livechat/server/lib/Helper");
const server_1 = require("../../../../../app/settings/server");
const callbacks_1 = require("../../../../../lib/callbacks");
const logger_1 = require("../lib/logger");
const onTransferFailure = (room_1, _a) => __awaiter(void 0, [room_1, _a], void 0, function* (room, { guest, transferData, department, }) {
    var _b;
    if (!(0, core_typings_1.isOmnichannelRoom)(room)) {
        return false;
    }
    if (!((_b = department === null || department === void 0 ? void 0 : department.fallbackForwardDepartment) === null || _b === void 0 ? void 0 : _b.length)) {
        return false;
    }
    // TODO: find enabled not archived here
    const fallbackDepartment = yield models_1.LivechatDepartment.findOneById(department.fallbackForwardDepartment, {
        projection: { name: 1, _id: 1 },
    });
    if (!fallbackDepartment) {
        return false;
    }
    const { hops: currentHops = 1 } = transferData;
    const maxHops = server_1.settings.get('Omnichannel_max_fallback_forward_depth');
    if (currentHops > maxHops) {
        logger_1.cbLogger.debug({
            msg: 'Max fallback forward depth reached. Chat wont be transfered',
            roomId: room._id,
            hops: currentHops,
            maxHops,
            departmentId: department._id,
        });
        return false;
    }
    const transferDataFallback = Object.assign(Object.assign({}, transferData), { usingFallbackDep: true, prevDepartment: department.name, departmentId: department.fallbackForwardDepartment, department: fallbackDepartment, hops: currentHops + 1 });
    const forwardSuccess = yield (0, Helper_1.forwardRoomToDepartment)(room, guest, transferDataFallback);
    if (!forwardSuccess) {
        logger_1.cbLogger.debug({
            msg: 'Fallback forward failed',
            departmentId: department._id,
            roomId: room._id,
            fallbackDepartmentId: department.fallbackForwardDepartment,
        });
        return false;
    }
    logger_1.cbLogger.info({
        msg: 'Fallback forward success',
        departmentId: department._id,
        roomId: room._id,
        fallbackDepartmentId: department.fallbackForwardDepartment,
    });
    return true;
});
callbacks_1.callbacks.add('livechat:onTransferFailure', onTransferFailure, callbacks_1.callbacks.priority.HIGH);
