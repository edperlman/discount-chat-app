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
exports.legacyJumpToMessage = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const client_1 = require("../../../app/models/client");
const client_2 = require("../../../app/ui-utils/client");
const RouterProvider_1 = require("../../providers/RouterProvider");
const RoomManager_1 = require("../RoomManager");
const goToRoomById_1 = require("./goToRoomById");
/** @deprecated */
const legacyJumpToMessage = (message) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if ((0, core_typings_1.isThreadMessage)(message) || message.tcount) {
        const { tab, context } = RouterProvider_1.router.getRouteParameters();
        if (tab === 'thread' && (context === message.tmid || context === message._id)) {
            return;
        }
        RouterProvider_1.router.navigate({
            name: RouterProvider_1.router.getRouteName(),
            params: {
                tab: 'thread',
                context: message.tmid || message._id,
                rid: message.rid,
                name: (_b = (_a = client_1.Rooms.findOne({ _id: message.rid })) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : '',
            },
            search: Object.assign(Object.assign({}, RouterProvider_1.router.getSearchParameters()), { msg: message._id }),
        }, { replace: false });
        return;
    }
    if (RoomManager_1.RoomManager.opened === message.rid) {
        client_2.RoomHistoryManager.getSurroundingMessages(message);
        return;
    }
    yield (0, goToRoomById_1.goToRoomById)(message.rid);
    setTimeout(() => {
        client_2.RoomHistoryManager.getSurroundingMessages(message);
    }, 400);
});
exports.legacyJumpToMessage = legacyJumpToMessage;
