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
exports.AppCommandsBridge = void 0;
const slashcommands_1 = require("@rocket.chat/apps-engine/definition/slashcommands");
const CommandBridge_1 = require("@rocket.chat/apps-engine/server/bridges/CommandBridge");
const meteor_1 = require("meteor/meteor");
const Utilities_1 = require("../../../../ee/lib/misc/Utilities");
const parseParameters_1 = require("../../../../lib/utils/parseParameters");
const slashCommand_1 = require("../../../utils/server/slashCommand");
class AppCommandsBridge extends CommandBridge_1.CommandBridge {
    constructor(orch) {
        super();
        this.orch = orch;
        this.disabledCommands = new Map();
    }
    doesCommandExist(command, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.orch.debugLog(`The App ${appId} is checking if "${command}" command exists.`);
            if (typeof command !== 'string' || command.length === 0) {
                return false;
            }
            const cmd = command.toLowerCase();
            return typeof slashCommand_1.slashCommands.commands[cmd] === 'object' || this.disabledCommands.has(cmd);
        });
    }
    enableCommand(command, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.orch.debugLog(`The App ${appId} is attempting to enable the command: "${command}"`);
            if (typeof command !== 'string' || command.trim().length === 0) {
                throw new Error('Invalid command parameter provided, must be a string.');
            }
            const cmd = command.toLowerCase();
            if (!this.disabledCommands.has(cmd)) {
                throw new Error(`The command is not currently disabled: "${cmd}"`);
            }
            slashCommand_1.slashCommands.commands[cmd] = this.disabledCommands.get(cmd);
            this.disabledCommands.delete(cmd);
            void this.orch.getNotifier().commandUpdated(cmd);
        });
    }
    disableCommand(command, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.orch.debugLog(`The App ${appId} is attempting to disable the command: "${command}"`);
            if (typeof command !== 'string' || command.trim().length === 0) {
                throw new Error('Invalid command parameter provided, must be a string.');
            }
            const cmd = command.toLowerCase();
            if (this.disabledCommands.has(cmd)) {
                // The command is already disabled, no need to disable it yet again
                return;
            }
            const commandObj = slashCommand_1.slashCommands.commands[cmd];
            if (typeof commandObj === 'undefined') {
                throw new Error(`Command does not exist in the system currently: "${cmd}"`);
            }
            this.disabledCommands.set(cmd, commandObj);
            delete slashCommand_1.slashCommands.commands[cmd];
            void this.orch.getNotifier().commandDisabled(cmd);
        });
    }
    // command: { command, paramsExample, i18nDescription, executor: function }
    modifyCommand(command, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.orch.debugLog(`The App ${appId} is attempting to modify the command: "${command}"`);
            this._verifyCommand(command);
            const cmd = command.command.toLowerCase();
            if (typeof slashCommand_1.slashCommands.commands[cmd] === 'undefined') {
                throw new Error(`Command does not exist in the system currently (or it is disabled): "${cmd}"`);
            }
            const item = slashCommand_1.slashCommands.commands[cmd];
            item.params = command.i18nParamsExample ? command.i18nParamsExample : item.params;
            item.description = command.i18nDescription ? command.i18nDescription : item.params;
            item.callback = this._appCommandExecutor.bind(this);
            item.providesPreview = command.providesPreview;
            item.previewer = command.previewer ? this._appCommandPreviewer.bind(this) : item.previewer;
            item.previewCallback = (command.executePreviewItem ? this._appCommandPreviewExecutor.bind(this) : item.previewCallback);
            slashCommand_1.slashCommands.commands[cmd] = item;
            void this.orch.getNotifier().commandUpdated(cmd);
        });
    }
    registerCommand(command, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.orch.debugLog(`The App ${appId} is registering the command: "${command.command}"`);
            this._verifyCommand(command);
            const item = {
                appId,
                command: command.command.toLowerCase(),
                params: Utilities_1.Utilities.getI18nKeyForApp(command.i18nParamsExample, appId),
                description: Utilities_1.Utilities.getI18nKeyForApp(command.i18nDescription, appId),
                permission: command.permission,
                callback: this._appCommandExecutor.bind(this),
                providesPreview: command.providesPreview,
                previewer: command.providesPreview ? this._appCommandPreviewer.bind(this) : undefined,
                previewCallback: (command.providesPreview ? this._appCommandPreviewExecutor.bind(this) : undefined),
            };
            slashCommand_1.slashCommands.commands[command.command.toLowerCase()] = item;
            void this.orch.getNotifier().commandAdded(command.command.toLowerCase());
        });
    }
    unregisterCommand(command, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.orch.debugLog(`The App ${appId} is unregistering the command: "${command}"`);
            if (typeof command !== 'string' || command.trim().length === 0) {
                throw new Error('Invalid command parameter provided, must be a string.');
            }
            const cmd = command.toLowerCase();
            this.disabledCommands.delete(cmd);
            delete slashCommand_1.slashCommands.commands[cmd];
            void this.orch.getNotifier().commandRemoved(cmd);
        });
    }
    _verifyCommand(command) {
        if (typeof command !== 'object') {
            throw new Error('Invalid Slash Command parameter provided, it must be a valid ISlashCommand object.');
        }
        if (typeof command.command !== 'string') {
            throw new Error('Invalid Slash Command parameter provided, it must be a valid ISlashCommand object.');
        }
        if (command.i18nParamsExample && typeof command.i18nParamsExample !== 'string') {
            throw new Error('Invalid Slash Command parameter provided, it must be a valid ISlashCommand object.');
        }
        if (command.i18nDescription && typeof command.i18nDescription !== 'string') {
            throw new Error('Invalid Slash Command parameter provided, it must be a valid ISlashCommand object.');
        }
        if (typeof command.providesPreview !== 'boolean') {
            throw new Error('Invalid Slash Command parameter provided, it must be a valid ISlashCommand object.');
        }
    }
    _appCommandExecutor(_a) {
        return __awaiter(this, arguments, void 0, function* ({ command, message, params, triggerId, userId }) {
            var _b, _c, _d;
            // #TODO: #AppsEngineTypes - Remove explicit types and typecasts once the apps-engine definition/implementation mismatch is fixed.
            const user = yield ((_b = this.orch.getConverters()) === null || _b === void 0 ? void 0 : _b.get('users').convertById(userId));
            const room = yield ((_c = this.orch.getConverters()) === null || _c === void 0 ? void 0 : _c.get('rooms').convertById(message.rid));
            const threadId = message.tmid;
            const parameters = (0, parseParameters_1.parseParameters)(params);
            const context = new slashcommands_1.SlashCommandContext(Object.freeze(user), Object.freeze(room), Object.freeze(parameters), threadId, triggerId);
            yield ((_d = this.orch.getManager()) === null || _d === void 0 ? void 0 : _d.getCommandManager().executeCommand(command, context));
        });
    }
    _appCommandPreviewer(command, parameters, message) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            // #TODO: #AppsEngineTypes - Remove explicit types and typecasts once the apps-engine definition/implementation mismatch is fixed.
            const uid = meteor_1.Meteor.userId();
            const user = yield ((_a = this.orch.getConverters()) === null || _a === void 0 ? void 0 : _a.get('users').convertById(uid));
            const room = yield ((_b = this.orch.getConverters()) === null || _b === void 0 ? void 0 : _b.get('rooms').convertById(message.rid));
            const threadId = message.tmid;
            const params = (0, parseParameters_1.parseParameters)(parameters);
            const context = new slashcommands_1.SlashCommandContext(Object.freeze(user), Object.freeze(room), Object.freeze(params), threadId);
            return (_c = this.orch.getManager()) === null || _c === void 0 ? void 0 : _c.getCommandManager().getPreviews(command, context);
        });
    }
    _appCommandPreviewExecutor(command, parameters, message, preview, triggerId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            // #TODO: #AppsEngineTypes - Remove explicit types and typecasts once the apps-engine definition/implementation mismatch is fixed.
            const uid = meteor_1.Meteor.userId();
            const user = yield ((_a = this.orch.getConverters()) === null || _a === void 0 ? void 0 : _a.get('users').convertById(uid));
            const room = yield ((_b = this.orch.getConverters()) === null || _b === void 0 ? void 0 : _b.get('rooms').convertById(message.rid));
            const threadId = message.tmid;
            const params = (0, parseParameters_1.parseParameters)(parameters);
            const context = new slashcommands_1.SlashCommandContext(Object.freeze(user), Object.freeze(room), Object.freeze(params), threadId, triggerId);
            yield ((_c = this.orch.getManager()) === null || _c === void 0 ? void 0 : _c.getCommandManager().executePreview(command, preview, context));
        });
    }
}
exports.AppCommandsBridge = AppCommandsBridge;
