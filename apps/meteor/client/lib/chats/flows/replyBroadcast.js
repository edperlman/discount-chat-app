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
exports.replyBroadcast = void 0;
const RouterProvider_1 = require("../../../providers/RouterProvider");
const roomCoordinator_1 = require("../../rooms/roomCoordinator");
const replyBroadcast = (_chat, message) => __awaiter(void 0, void 0, void 0, function* () {
    roomCoordinator_1.roomCoordinator.openRouteLink('d', { name: message.u.username }, Object.assign(Object.assign({}, RouterProvider_1.router.getSearchParameters()), { reply: message._id }));
});
exports.replyBroadcast = replyBroadcast;
