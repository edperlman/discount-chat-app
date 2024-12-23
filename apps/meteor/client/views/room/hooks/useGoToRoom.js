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
exports.useGoToRoom = void 0;
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const client_1 = require("../../../../app/models/client");
const roomCoordinator_1 = require("../../../lib/rooms/roomCoordinator");
const useGoToRoom = ({ replace = false } = {}) => {
    const getRoomById = (0, ui_contexts_1.useMethod)('getRoomById');
    const router = (0, ui_contexts_1.useRouter)();
    // TODO: remove params recycling
    return (0, fuselage_hooks_1.useMutableCallback)((rid) => __awaiter(void 0, void 0, void 0, function* () {
        if (!rid) {
            return;
        }
        const subscription = client_1.Subscriptions.findOne({ rid });
        if (subscription) {
            roomCoordinator_1.roomCoordinator.openRouteLink(subscription.t, subscription, router.getSearchParameters(), { replace });
            return;
        }
        const room = yield getRoomById(rid);
        roomCoordinator_1.roomCoordinator.openRouteLink(room.t, Object.assign({ rid: room._id }, room), router.getSearchParameters(), { replace });
    }));
};
exports.useGoToRoom = useGoToRoom;
