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
const core_typings_1 = require("@rocket.chat/core-typings");
const logger_1 = require("@rocket.chat/logger");
const models_1 = require("@rocket.chat/models");
const accounts_base_1 = require("meteor/accounts-base");
const meteor_1 = require("meteor/meteor");
const business_hour_1 = require("./business-hour");
const Helper_1 = require("./business-hour/Helper");
const LivechatTyped_1 = require("./lib/LivechatTyped");
const LivechatAgentActivityMonitor_1 = require("./statistics/LivechatAgentActivityMonitor");
const callbacks_1 = require("../../../lib/callbacks");
const beforeLeaveRoomCallback_1 = require("../../../lib/callbacks/beforeLeaveRoomCallback");
const i18n_1 = require("../../../server/lib/i18n");
const roomCoordinator_1 = require("../../../server/lib/rooms/roomCoordinator");
const hasPermission_1 = require("../../authorization/server/functions/hasPermission");
const notifyListener_1 = require("../../lib/server/lib/notifyListener");
const server_1 = require("../../settings/server");
require("./roomAccessValidator.internalService");
const logger = new logger_1.Logger('LivechatStartup');
meteor_1.Meteor.startup(() => __awaiter(void 0, void 0, void 0, function* () {
    roomCoordinator_1.roomCoordinator.setRoomFind('l', (_id) => models_1.LivechatRooms.findOneById(_id));
    beforeLeaveRoomCallback_1.beforeLeaveRoomCallback.add((user, room) => {
        if (!(0, core_typings_1.isOmnichannelRoom)(room)) {
            return;
        }
        throw new meteor_1.Meteor.Error(i18n_1.i18n.t('You_cant_leave_a_livechat_room_Please_use_the_close_button', {
            lng: user.language || server_1.settings.get('Language') || 'en',
        }));
    }, callbacks_1.callbacks.priority.LOW, 'cant-leave-omnichannel-room');
    callbacks_1.callbacks.add('beforeJoinRoom', (user, room) => __awaiter(void 0, void 0, void 0, function* () {
        if ((0, core_typings_1.isOmnichannelRoom)(room) && !(yield (0, hasPermission_1.hasPermissionAsync)(user._id, 'view-l-room'))) {
            throw new meteor_1.Meteor.Error('error-user-is-not-agent', 'User is not an Omnichannel Agent', {
                method: 'beforeJoinRoom',
            });
        }
        return user;
    }), callbacks_1.callbacks.priority.LOW, 'cant-join-omnichannel-room');
    const monitor = new LivechatAgentActivityMonitor_1.LivechatAgentActivityMonitor();
    server_1.settings.watch('Troubleshoot_Disable_Livechat_Activity_Monitor', (value) => __awaiter(void 0, void 0, void 0, function* () {
        if (value) {
            return monitor.stop();
        }
        yield monitor.start();
    }));
    yield (0, Helper_1.createDefaultBusinessHourIfNotExists)();
    server_1.settings.watch('Livechat_enable_business_hours', (value) => __awaiter(void 0, void 0, void 0, function* () {
        logger.debug(`Starting business hour manager ${value}`);
        if (value) {
            yield business_hour_1.businessHourManager.startManager();
            return;
        }
        yield business_hour_1.businessHourManager.stopManager();
    }), process.env.TEST_MODE === 'true'
        ? {
            debounce: 10,
        }
        : undefined);
    // Remove when accounts.onLogout is async
    accounts_base_1.Accounts.onLogout(({ user }) => {
        var _a, _b;
        if (!((_a = user === null || user === void 0 ? void 0 : user.roles) === null || _a === void 0 ? void 0 : _a.includes('livechat-agent')) || ((_b = user === null || user === void 0 ? void 0 : user.roles) === null || _b === void 0 ? void 0 : _b.includes('bot'))) {
            return;
        }
        void LivechatTyped_1.Livechat.setUserStatusLivechatIf(user._id, core_typings_1.ILivechatAgentStatus.NOT_AVAILABLE, {}, { livechatStatusSystemModified: true }).catch();
        void (0, notifyListener_1.notifyOnUserChange)({
            id: user._id,
            clientAction: 'updated',
            diff: {
                statusLivechat: core_typings_1.ILivechatAgentStatus.NOT_AVAILABLE,
                livechatStatusSystemModified: true,
            },
        });
    });
}));
