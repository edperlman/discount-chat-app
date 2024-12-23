"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtrRoomState = void 0;
var OtrRoomState;
(function (OtrRoomState) {
    OtrRoomState["DISABLED"] = "DISABLED";
    OtrRoomState["NOT_STARTED"] = "NOT_STARTED";
    OtrRoomState["REQUESTED"] = "REQUESTED";
    OtrRoomState["ESTABLISHING"] = "ESTABLISHING";
    OtrRoomState["ESTABLISHED"] = "ESTABLISHED";
    OtrRoomState["ERROR"] = "ERROR";
    OtrRoomState["TIMEOUT"] = "TIMEOUT";
    OtrRoomState["DECLINED"] = "DECLINED";
})(OtrRoomState || (exports.OtrRoomState = OtrRoomState = {}));
