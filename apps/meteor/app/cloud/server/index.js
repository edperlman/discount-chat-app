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
exports.getWorkspaceAccessTokenWithScope = exports.getWorkspaceAccessToken = void 0;
const cron_1 = require("@rocket.chat/cron");
const meteor_1 = require("meteor/meteor");
const connectWorkspace_1 = require("./functions/connectWorkspace");
const getWorkspaceAccessToken_1 = require("./functions/getWorkspaceAccessToken");
Object.defineProperty(exports, "getWorkspaceAccessToken", { enumerable: true, get: function () { return getWorkspaceAccessToken_1.getWorkspaceAccessToken; } });
const getWorkspaceAccessTokenWithScope_1 = require("./functions/getWorkspaceAccessTokenWithScope");
Object.defineProperty(exports, "getWorkspaceAccessTokenWithScope", { enumerable: true, get: function () { return getWorkspaceAccessTokenWithScope_1.getWorkspaceAccessTokenWithScope; } });
const retrieveRegistrationStatus_1 = require("./functions/retrieveRegistrationStatus");
const syncWorkspace_1 = require("./functions/syncWorkspace");
const system_1 = require("../../../server/lib/logger/system");
require("./methods");
const licenseCronName = 'Cloud Workspace Sync';
meteor_1.Meteor.startup(() => __awaiter(void 0, void 0, void 0, function* () {
    const { workspaceRegistered } = yield (0, retrieveRegistrationStatus_1.retrieveRegistrationStatus)();
    if (process.env.REG_TOKEN && process.env.REG_TOKEN !== '' && !workspaceRegistered) {
        try {
            system_1.SystemLogger.info('REG_TOKEN Provided. Attempting to register');
            if (!(yield (0, connectWorkspace_1.connectWorkspace)(process.env.REG_TOKEN))) {
                throw new Error("Couldn't register with token.  Please make sure token is valid or hasn't already been used");
            }
            console.log('Successfully registered with token provided by REG_TOKEN!');
        }
        catch (e) {
            system_1.SystemLogger.error('An error occurred registering with token.', e.message);
        }
    }
    setImmediate(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield (0, syncWorkspace_1.syncWorkspace)();
        }
        catch (e) {
            if (e instanceof getWorkspaceAccessToken_1.CloudWorkspaceAccessTokenEmptyError) {
                return;
            }
            if (e.type && e.type === 'AbortError') {
                return;
            }
            system_1.SystemLogger.error('An error occurred syncing workspace.', e.message);
        }
    }));
    yield cron_1.cronJobs.add(licenseCronName, '0 */12 * * *', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield (0, syncWorkspace_1.syncWorkspace)();
        }
        catch (e) {
            if (e instanceof getWorkspaceAccessToken_1.CloudWorkspaceAccessTokenEmptyError) {
                return;
            }
            if (e.type && e.type === 'AbortError') {
                return;
            }
            system_1.SystemLogger.error('An error occurred syncing workspace.', e.message);
        }
    }));
}));
