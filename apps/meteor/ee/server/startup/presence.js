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
const core_services_1 = require("@rocket.chat/core-services");
const instance_status_1 = require("@rocket.chat/instance-status");
const accounts_base_1 = require("meteor/accounts-base");
const meteor_1 = require("meteor/meteor");
const underscore_1 = require("underscore");
// update connections count every 30 seconds
const updateConns = (0, underscore_1.throttle)(function _updateConns() {
    void instance_status_1.InstanceStatus.updateConnections(meteor_1.Meteor.server.sessions.size);
}, 30000);
meteor_1.Meteor.startup(() => {
    const nodeId = instance_status_1.InstanceStatus.id();
    meteor_1.Meteor.onConnection((connection) => {
        const session = meteor_1.Meteor.server.sessions.get(connection.id);
        connection.onClose(() => __awaiter(void 0, void 0, void 0, function* () {
            if (!session) {
                return;
            }
            yield core_services_1.Presence.removeConnection(session.userId, connection.id, nodeId);
            updateConns();
        }));
    });
    process.on('exit', () => __awaiter(void 0, void 0, void 0, function* () {
        yield core_services_1.Presence.removeLostConnections(nodeId);
    }));
    accounts_base_1.Accounts.onLogin((login) => {
        if (!login.connection.id) {
            return;
        }
        // validate if it is a real WS connection and is still open
        const session = meteor_1.Meteor.server.sessions.get(login.connection.id);
        if (!session) {
            return;
        }
        void (function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield core_services_1.Presence.newConnection(login.user._id, login.connection.id, nodeId);
                updateConns();
            });
        })();
    });
    accounts_base_1.Accounts.onLogout((login) => {
        var _a;
        void core_services_1.Presence.removeConnection((_a = login.user) === null || _a === void 0 ? void 0 : _a._id, login.connection.id, nodeId);
        updateConns();
    });
});
