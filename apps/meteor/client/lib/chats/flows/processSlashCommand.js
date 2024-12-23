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
exports.processSlashCommand = void 0;
const random_1 = require("@rocket.chat/random");
const string_helpers_1 = require("@rocket.chat/string-helpers");
const client_1 = require("../../../../app/authorization/client");
const client_2 = require("../../../../app/settings/client");
const client_3 = require("../../../../app/utils/client");
const SDKClient_1 = require("../../../../app/utils/client/lib/SDKClient");
const i18n_1 = require("../../../../app/utils/lib/i18n");
const parse = (msg) => {
    const match = msg.match(/^\/([^\s]+)(.*)/);
    if (!match) {
        return undefined;
    }
    const [, cmd, params] = match;
    const command = client_3.slashCommands.commands[cmd];
    if (!command) {
        return { command: cmd, params };
    }
    return { command, params };
};
const warnUnrecognizedSlashCommand = (chat, message) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(message);
    yield chat.data.pushEphemeralMessage({
        _id: random_1.Random.id(),
        ts: new Date(),
        msg: message,
        u: {
            _id: 'rocket.cat',
            username: 'rocket.cat',
            name: 'Rocket.Cat',
        },
        private: true,
        _updatedAt: new Date(),
    });
});
const processSlashCommand = (chat, message) => __awaiter(void 0, void 0, void 0, function* () {
    const match = parse(message.msg);
    if (!match) {
        return false;
    }
    const { command, params } = match;
    if (typeof command === 'string') {
        if (!client_2.settings.get('Message_AllowUnrecognizedSlashCommand')) {
            yield warnUnrecognizedSlashCommand(chat, (0, i18n_1.t)('No_such_command', { command: (0, string_helpers_1.escapeHTML)(command) }));
            return true;
        }
        return false;
    }
    const { permission, clientOnly, callback: handleOnClient, result: handleResult, appId, command: commandName } = command;
    if (permission && !(0, client_1.hasAtLeastOnePermission)(permission, message.rid)) {
        yield warnUnrecognizedSlashCommand(chat, (0, i18n_1.t)('You_do_not_have_permission_to_execute_this_command', { command: (0, string_helpers_1.escapeHTML)(commandName) }));
        return true;
    }
    if (clientOnly && chat.uid) {
        handleOnClient === null || handleOnClient === void 0 ? void 0 : handleOnClient({ command: commandName, message, params, userId: chat.uid });
        return true;
    }
    yield SDKClient_1.sdk.rest.post('/v1/statistics.telemetry', {
        params: [{ eventName: 'slashCommandsStats', timestamp: Date.now(), command: commandName }],
    });
    const triggerId = chat.ActionManager.generateTriggerId(appId);
    const data = {
        cmd: commandName,
        params,
        msg: message,
        userId: chat.uid,
    };
    try {
        if (appId) {
            chat.ActionManager.notifyBusy();
        }
        const result = yield SDKClient_1.sdk.call('slashCommand', { cmd: commandName, params, msg: message, triggerId });
        handleResult === null || handleResult === void 0 ? void 0 : handleResult(undefined, result, data);
    }
    catch (error) {
        yield warnUnrecognizedSlashCommand(chat, (0, i18n_1.t)('Something_went_wrong_while_executing_command', { command: commandName }));
        handleResult === null || handleResult === void 0 ? void 0 : handleResult(error, undefined, data);
    }
    if (appId) {
        chat.ActionManager.notifyIdle();
    }
    return true;
});
exports.processSlashCommand = processSlashCommand;
