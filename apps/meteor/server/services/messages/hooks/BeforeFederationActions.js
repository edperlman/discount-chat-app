"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FederationActions = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const utils_1 = require("../../federation/utils");
class FederationActions {
    static shouldPerformAction(message, room) {
        if ((0, core_typings_1.isMessageFromMatrixFederation)(message) || (0, core_typings_1.isRoomFederated)(room)) {
            return (0, utils_1.isFederationEnabled)() && (0, utils_1.isFederationReady)();
        }
        return true;
    }
}
exports.FederationActions = FederationActions;
