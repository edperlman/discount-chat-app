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
const instance_status_1 = require("@rocket.chat/instance-status");
const accounts_base_1 = require("meteor/accounts-base");
const meteor_1 = require("meteor/meteor");
const events_1 = require("../services/device-management/events");
const events_2 = require("../services/sauMonitor/events");
accounts_base_1.Accounts.onLogin((info) => {
    var _a;
    const { methodArguments, connection: { httpHeaders }, } = info;
    if (!info.user) {
        return;
    }
    const { resume } = (_a = methodArguments.find((arg) => 'resume' in arg)) !== null && _a !== void 0 ? _a : {};
    const eventObject = {
        userId: info.user._id,
        connection: Object.assign(Object.assign(Object.assign({}, info.connection), (resume && { loginToken: accounts_base_1.Accounts._hashLoginToken(resume) })), { instanceId: instance_status_1.InstanceStatus.id(), httpHeaders: httpHeaders }),
    };
    events_2.sauEvents.emit('accounts.login', eventObject);
    events_1.deviceManagementEvents.emit('device-login', eventObject);
});
accounts_base_1.Accounts.onLogout((info) => {
    const { httpHeaders } = info.connection;
    if (!info.user) {
        return;
    }
    events_2.sauEvents.emit('accounts.logout', {
        userId: info.user._id,
        connection: Object.assign(Object.assign({ instanceId: instance_status_1.InstanceStatus.id() }, info.connection), { httpHeaders: httpHeaders }),
    });
});
meteor_1.Meteor.onConnection((connection) => {
    connection.onClose(() => __awaiter(void 0, void 0, void 0, function* () {
        const { httpHeaders } = connection;
        events_2.sauEvents.emit('socket.disconnected', Object.assign(Object.assign({ instanceId: instance_status_1.InstanceStatus.id() }, connection), { httpHeaders: httpHeaders }));
    }));
});
meteor_1.Meteor.onConnection((connection) => {
    const { httpHeaders } = connection;
    events_2.sauEvents.emit('socket.connected', Object.assign(Object.assign({ instanceId: instance_status_1.InstanceStatus.id() }, connection), { httpHeaders: httpHeaders }));
});
