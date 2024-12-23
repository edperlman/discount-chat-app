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
exports.calculateOnHoldTimeForRoom = void 0;
const models_1 = require("@rocket.chat/models");
const calculateOnHoldTimeForRoom = (room, closedAt) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!room.callUniqueId) {
        return 0;
    }
    const events = yield models_1.PbxEvents.findByEvents(room.callUniqueId, ['Hold', 'Unhold']).toArray();
    if (!events.length) {
        // if there's no events, that means no hold time
        return 0;
    }
    if (events.length === 1 && events[0].event === 'Unhold') {
        // if the only event is an unhold event, something bad happened
        return 0;
    }
    if (events.length === 1 && events[0].event === 'Hold') {
        // if the only event is a hold event, the call was ended while on hold
        // hold time = room.closedAt - event.ts
        return closedAt.getTime() - events[0].ts.getTime();
    }
    let currentOnHoldTime = 0;
    for (let i = 0; i < events.length; i += 2) {
        const onHold = events[i].ts;
        const unHold = ((_a = events[i + 1]) === null || _a === void 0 ? void 0 : _a.ts) || closedAt;
        currentOnHoldTime += unHold.getTime() - onHold.getTime();
    }
    return currentOnHoldTime;
});
exports.calculateOnHoldTimeForRoom = calculateOnHoldTimeForRoom;
