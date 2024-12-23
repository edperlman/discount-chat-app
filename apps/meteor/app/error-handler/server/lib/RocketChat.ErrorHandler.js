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
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const throttledCounter_1 = require("../../../../lib/utils/throttledCounter");
const sendMessage_1 = require("../../../lib/server/functions/sendMessage");
const server_1 = require("../../../settings/server");
const incException = (0, throttledCounter_1.throttledCounter)((counter) => {
    models_1.Settings.incrementValueById('Uncaught_Exceptions_Count', counter, { returnDocument: 'after' })
        .then(({ value }) => {
        if (value) {
            server_1.settings.set(value);
        }
    })
        .catch(console.error);
}, 10000);
class ErrorHandler {
    constructor() {
        this.reporting = false;
        this.rid = null;
        this.lastError = null;
    }
    getRoomId(roomName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!roomName) {
                return null;
            }
            const room = yield models_1.Rooms.findOneByName(roomName.replace('#', ''), { projection: { _id: 1, t: 1 } });
            if (!room || (room.t !== 'c' && room.t !== 'p')) {
                return null;
            }
            return room._id;
        });
    }
    trackError(message, stack) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.reporting || !this.rid || this.lastError === message) {
                return;
            }
            this.lastError = message;
            const user = yield models_1.Users.findOneById('rocket.cat');
            if (stack) {
                message = `${message}\n\`\`\`\n${stack}\n\`\`\``;
            }
            yield (0, sendMessage_1.sendMessage)(user, { msg: message }, { _id: this.rid });
        });
    }
}
const errorHandler = new ErrorHandler();
meteor_1.Meteor.startup(() => __awaiter(void 0, void 0, void 0, function* () {
    server_1.settings.watch('Log_Exceptions_to_Channel', (value) => __awaiter(void 0, void 0, void 0, function* () {
        errorHandler.rid = null;
        const roomName = value.trim();
        const rid = yield errorHandler.getRoomId(roomName);
        errorHandler.reporting = Boolean(rid);
        errorHandler.rid = rid;
    }));
}));
// eslint-disable-next-line @typescript-eslint/no-this-alias
const originalMeteorDebug = meteor_1.Meteor._debug;
meteor_1.Meteor._debug = function (message, stack, ...args) {
    if (!errorHandler.reporting) {
        return originalMeteorDebug.call(this, message, stack);
    }
    void errorHandler.trackError(message, stack);
    return originalMeteorDebug.apply(this, [message, stack, ...args]);
};
/**
 * If some promise is rejected and doesn't have a catch (unhandledRejection) it may cause this finally
 * here https://github.com/meteor/meteor/blob/be6e529a739f47446950e045f4547ee60e5de7ae/packages/mongo/oplog_tailing.js#L348
 * to not be executed never ending the oplog worker and freezing the entire process.
 *
 * The only way to release the process is executing the following code via inspect:
 *   MongoInternals.defaultRemoteCollectionDriver().mongo._oplogHandle._workerActive = false
 *
 * Since unhandled rejections are deprecated in NodeJS:
 * (node:83382) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections
 * that are not handled will terminate the Node.js process with a non-zero exit code.
 * we will start respecting this and exit the process to prevent these kind of problems.
 */
process.on('unhandledRejection', (error) => {
    incException();
    if (error instanceof Error) {
        void errorHandler.trackError(error.message, error.stack);
    }
    console.error('=== UnHandledPromiseRejection ===');
    console.error(error);
    console.error('---------------------------------');
    console.error('Errors like this can cause oplog processing errors.');
    console.error('Setting EXIT_UNHANDLEDPROMISEREJECTION will cause the process to exit allowing your service to automatically restart the process');
    console.error('Future node.js versions will automatically exit the process');
    console.error('=================================');
    if (process.env.TEST_MODE || process.env.NODE_ENV === 'development' || process.env.EXIT_UNHANDLEDPROMISEREJECTION) {
        process.exit(1);
    }
});
process.on('uncaughtException', (error) => __awaiter(void 0, void 0, void 0, function* () {
    incException();
    console.error('=== UnCaughtException ===');
    console.error(error);
    console.error('-------------------------');
    console.error('Errors like this can cause oplog processing errors.');
    console.error('===========================');
    void errorHandler.trackError(error.message, error.stack);
    if (process.env.TEST_MODE || process.env.NODE_ENV === 'development' || process.env.EXIT_UNHANDLEDPROMISEREJECTION) {
        process.exit(1);
    }
}));
