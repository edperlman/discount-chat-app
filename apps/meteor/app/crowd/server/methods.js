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
const meteor_1 = require("meteor/meteor");
const crowd_1 = require("./crowd");
const logger_1 = require("./logger");
const hasPermission_1 = require("../../authorization/server/functions/hasPermission");
const server_1 = require("../../settings/server");
meteor_1.Meteor.methods({
    crowd_test_connection() {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield meteor_1.Meteor.userAsync();
            if (!user) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'crowd_test_connection',
                });
            }
            if (!(yield (0, hasPermission_1.hasPermissionAsync)(user._id, 'test-admin-options'))) {
                throw new meteor_1.Meteor.Error('error-not-authorized', 'Not authorized', {
                    method: 'crowd_test_connection',
                });
            }
            if (server_1.settings.get('CROWD_Enable') !== true) {
                throw new meteor_1.Meteor.Error('crowd_disabled');
            }
            try {
                const crowd = new crowd_1.CROWD();
                yield crowd.checkConnection();
                return {
                    message: 'Crowd_Connection_successful',
                    params: [],
                };
            }
            catch (err) {
                logger_1.logger.error({
                    msg: 'Invalid crowd connection details, check the url and application username/password and make sure this server is allowed to speak to crowd',
                    err,
                });
                throw new meteor_1.Meteor.Error('Invalid connection details', '', { method: 'crowd_test_connection' });
            }
        });
    },
    crowd_sync_users() {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield meteor_1.Meteor.userAsync();
            if (server_1.settings.get('CROWD_Enable') !== true) {
                throw new meteor_1.Meteor.Error('crowd_disabled');
            }
            if (!user || !(yield (0, hasPermission_1.hasPermissionAsync)(user._id, 'sync-auth-services-users'))) {
                throw new meteor_1.Meteor.Error('error-not-authorized', 'Not authorized', {
                    method: 'crowd_sync_users',
                });
            }
            try {
                const crowd = new crowd_1.CROWD();
                const startTime = Date.now();
                yield crowd.sync();
                const stopTime = Date.now();
                const actual = Math.ceil((stopTime - startTime) / 1000);
                return {
                    message: `User data synced in ${actual} seconds`,
                    params: [],
                };
            }
            catch (err) {
                logger_1.logger.error({ msg: 'Error syncing user data. ', err });
                throw new meteor_1.Meteor.Error('Error syncing user data', '', { method: 'crowd_sync_users' });
            }
        });
    },
});
