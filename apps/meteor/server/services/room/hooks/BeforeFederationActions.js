"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FederationActions = void 0;
const utils_1 = require("../../federation/utils");
class FederationActions {
    static blockIfRoomFederatedButServiceNotReady({ federated }) {
        if (!federated) {
            return;
        }
        (0, utils_1.throwIfFederationNotEnabledOrNotReady)();
    }
}
exports.FederationActions = FederationActions;
