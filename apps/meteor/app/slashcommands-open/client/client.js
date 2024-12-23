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
const roomCoordinator_1 = require("../../../client/lib/rooms/roomCoordinator");
const RouterProvider_1 = require("../../../client/providers/RouterProvider");
const client_1 = require("../../models/client");
const SDKClient_1 = require("../../utils/client/lib/SDKClient");
const slashCommand_1 = require("../../utils/client/slashCommand");
slashCommand_1.slashCommands.add({
    command: 'open',
    callback: function Open(_a) {
        return __awaiter(this, arguments, void 0, function* ({ params }) {
            const dict = {
                '#': ['c', 'p'],
                '@': ['d'],
            };
            const room = params.trim().replace(/#|@/, '');
            const type = dict[params.trim()[0]] || [];
            const query = Object.assign({ name: room }, (type && { t: { $in: type } }));
            const subscription = client_1.Subscriptions.findOne(query);
            if (subscription) {
                roomCoordinator_1.roomCoordinator.openRouteLink(subscription.t, subscription, RouterProvider_1.router.getSearchParameters());
            }
            if (type && type.indexOf('d') === -1) {
                return;
            }
            try {
                yield SDKClient_1.sdk.call('createDirectMessage', room);
                const subscription = client_1.Subscriptions.findOne(query);
                if (!subscription) {
                    return;
                }
                roomCoordinator_1.roomCoordinator.openRouteLink(subscription.t, subscription, RouterProvider_1.router.getSearchParameters());
            }
            catch (err) {
                // noop
            }
        });
    },
    options: {
        description: 'Opens_a_channel_group_or_direct_message',
        params: 'room_name',
        clientOnly: true,
        permission: ['view-c-room', 'view-c-room', 'view-d-room', 'view-joined-room', 'create-d'],
    },
});
