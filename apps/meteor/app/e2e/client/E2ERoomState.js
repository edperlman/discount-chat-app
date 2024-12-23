"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.E2ERoomState = void 0;
var E2ERoomState;
(function (E2ERoomState) {
    E2ERoomState["NO_PASSWORD_SET"] = "NO_PASSWORD_SET";
    E2ERoomState["NOT_STARTED"] = "NOT_STARTED";
    E2ERoomState["DISABLED"] = "DISABLED";
    E2ERoomState["HANDSHAKE"] = "HANDSHAKE";
    E2ERoomState["ESTABLISHING"] = "ESTABLISHING";
    E2ERoomState["CREATING_KEYS"] = "CREATING_KEYS";
    E2ERoomState["WAITING_KEYS"] = "WAITING_KEYS";
    E2ERoomState["KEYS_RECEIVED"] = "KEYS_RECEIVED";
    E2ERoomState["READY"] = "READY";
    E2ERoomState["ERROR"] = "ERROR";
})(E2ERoomState || (exports.E2ERoomState = E2ERoomState = {}));
