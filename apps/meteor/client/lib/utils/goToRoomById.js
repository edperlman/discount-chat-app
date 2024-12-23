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
exports.goToRoomById = void 0;
const memo_1 = require("@rocket.chat/memo");
const callWithErrorHandling_1 = require("./callWithErrorHandling");
const client_1 = require("../../../app/models/client");
const RouterProvider_1 = require("../../providers/RouterProvider");
const roomCoordinator_1 = require("../rooms/roomCoordinator");
const getRoomById = (0, memo_1.memoize)((rid) => (0, callWithErrorHandling_1.callWithErrorHandling)('getRoomById', rid));
const goToRoomById = (rid) => __awaiter(void 0, void 0, void 0, function* () {
    if (!rid) {
        return;
    }
    const subscription = client_1.Subscriptions.findOne({ rid });
    if (subscription) {
        roomCoordinator_1.roomCoordinator.openRouteLink(subscription.t, subscription, RouterProvider_1.router.getSearchParameters());
        return;
    }
    const room = yield getRoomById(rid);
    roomCoordinator_1.roomCoordinator.openRouteLink(room.t, Object.assign({ rid: room._id }, room), RouterProvider_1.router.getSearchParameters());
});
exports.goToRoomById = goToRoomById;
