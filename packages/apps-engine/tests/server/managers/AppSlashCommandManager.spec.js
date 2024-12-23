"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
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
exports.AppSlashCommandManagerTestFixture = void 0;
const alsatian_1 = require("alsatian");
const AppStatus_1 = require("../../../src/definition/AppStatus");
const slashcommands_1 = require("../../../src/definition/slashcommands");
const errors_1 = require("../../../src/server/errors");
const logging_1 = require("../../../src/server/logging");
const managers_1 = require("../../../src/server/managers");
const AppSlashCommand_1 = require("../../../src/server/managers/AppSlashCommand");
const Room_1 = require("../../../src/server/rooms/Room");
const appBridges_1 = require("../../test-data/bridges/appBridges");
const logStorage_1 = require("../../test-data/storage/logStorage");
const utilities_1 = require("../../test-data/utilities");
let AppSlashCommandManagerTestFixture = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _setupFixture_decorators;
    let _setup_decorators;
    let _teardown_decorators;
    let _basicAppSlashCommandManager_decorators;
    let _canCommandBeTouchedBy_decorators;
    let _isAlreadyDefined_decorators;
    let _setAsTouched_decorators;
    let _registerCommand_decorators;
    let _addCommand_decorators;
    let _failToModifyAnotherAppsCommand_decorators;
    let _failToModifyNonExistantAppCommand_decorators;
    let _modifyMyCommand_decorators;
    let _modifySystemCommand_decorators;
    let _enableMyCommand_decorators;
    let _enableSystemCommand_decorators;
    let _failToEnableAnotherAppsCommand_decorators;
    let _disableMyCommand_decorators;
    let _disableSystemCommand_decorators;
    let _failToDisableAnotherAppsCommand_decorators;
    let _registerCommands_decorators;
    let _unregisterCommands_decorators;
    let _executeCommands_decorators;
    let _getPreviews_decorators;
    let _executePreview_decorators;
    return _a = class AppSlashCommandManagerTestFixture {
            constructor() {
                this.mockBridges = __runInitializers(this, _instanceExtraInitializers);
            }
            setupFixture() {
                this.mockBridges = new appBridges_1.TestsAppBridges();
                this.mockApp = {
                    getRuntime() {
                        return {};
                    },
                    getDenoRuntime() {
                        return {
                            sendRequest: () => { },
                        };
                    },
                    getID() {
                        return 'testing';
                    },
                    getStatus() {
                        return Promise.resolve(AppStatus_1.AppStatus.AUTO_ENABLED);
                    },
                    setupLogger(method) {
                        return new logging_1.AppConsole(method);
                    },
                };
                const bri = this.mockBridges;
                const app = this.mockApp;
                this.mockManager = {
                    getBridges() {
                        return bri;
                    },
                    getCommandManager() {
                        return {};
                    },
                    getExternalComponentManager() {
                        return {};
                    },
                    getApiManager() {
                        return {};
                    },
                    getOneById(appId) {
                        return appId === 'failMePlease' ? undefined : app;
                    },
                    getLogStorage() {
                        return new logStorage_1.TestsAppLogStorage();
                    },
                    getSchedulerManager() {
                        return {};
                    },
                    getUIActionButtonManager() {
                        return {};
                    },
                    getVideoConfProviderManager() {
                        return {};
                    },
                };
                this.mockAccessors = new managers_1.AppAccessorManager(this.mockManager);
                const ac = this.mockAccessors;
                this.mockManager.getAccessorManager = function _getAccessorManager() {
                    return ac;
                };
            }
            setup() {
                this.mockBridges = new appBridges_1.TestsAppBridges();
                const bri = this.mockBridges;
                this.mockManager.getBridges = function _refreshedGetBridges() {
                    return bri;
                };
                this.spies = [];
                this.spies.push((0, alsatian_1.SpyOn)(this.mockBridges.getCommandBridge(), 'doDoesCommandExist'));
                this.spies.push((0, alsatian_1.SpyOn)(this.mockBridges.getCommandBridge(), 'doRegisterCommand'));
                this.spies.push((0, alsatian_1.SpyOn)(this.mockBridges.getCommandBridge(), 'doUnregisterCommand'));
                this.spies.push((0, alsatian_1.SpyOn)(this.mockBridges.getCommandBridge(), 'doEnableCommand'));
                this.spies.push((0, alsatian_1.SpyOn)(this.mockBridges.getCommandBridge(), 'doDisableCommand'));
            }
            teardown() {
                this.spies.forEach((s) => s.restore());
            }
            basicAppSlashCommandManager() {
                (0, alsatian_1.Expect)(() => new managers_1.AppSlashCommandManager({})).toThrow();
                (0, alsatian_1.Expect)(() => new managers_1.AppSlashCommandManager(this.mockManager)).not.toThrow();
                const ascm = new managers_1.AppSlashCommandManager(this.mockManager);
                (0, alsatian_1.Expect)(ascm.manager).toBe(this.mockManager);
                (0, alsatian_1.Expect)(ascm.bridge).toBe(this.mockBridges.getCommandBridge());
                (0, alsatian_1.Expect)(ascm.accessors).toBe(this.mockManager.getAccessorManager());
                (0, alsatian_1.Expect)(ascm.providedCommands).toBeDefined();
                (0, alsatian_1.Expect)(ascm.providedCommands.size).toBe(0);
                (0, alsatian_1.Expect)(ascm.modifiedCommands).toBeDefined();
                (0, alsatian_1.Expect)(ascm.modifiedCommands.size).toBe(0);
                (0, alsatian_1.Expect)(ascm.touchedCommandsToApps).toBeDefined();
                (0, alsatian_1.Expect)(ascm.touchedCommandsToApps.size).toBe(0);
                (0, alsatian_1.Expect)(ascm.appsTouchedCommands).toBeDefined();
                (0, alsatian_1.Expect)(ascm.appsTouchedCommands.size).toBe(0);
            }
            canCommandBeTouchedBy() {
                const ascm = new managers_1.AppSlashCommandManager(this.mockManager);
                (0, alsatian_1.Expect)(ascm.canCommandBeTouchedBy('testing', 'command')).toBe(true);
                ascm.touchedCommandsToApps.set('just-a-test', 'anotherAppId');
                (0, alsatian_1.Expect)(ascm.canCommandBeTouchedBy('testing', 'just-a-test')).toBe(false);
            }
            isAlreadyDefined() {
                const ascm = new managers_1.AppSlashCommandManager(this.mockManager);
                const reg = new Map();
                reg.set('command', new AppSlashCommand_1.AppSlashCommand(this.mockApp, utilities_1.TestData.getSlashCommand('command')));
                (0, alsatian_1.Expect)(ascm.isAlreadyDefined('command')).toBe(false);
                ascm.providedCommands.set('testing', reg);
                (0, alsatian_1.Expect)(ascm.isAlreadyDefined('command')).toBe(true);
                (0, alsatian_1.Expect)(ascm.isAlreadyDefined('cOMMand')).toBe(true);
                (0, alsatian_1.Expect)(ascm.isAlreadyDefined(' command ')).toBe(true);
                (0, alsatian_1.Expect)(ascm.isAlreadyDefined('c0mmand')).toBe(false);
            }
            setAsTouched() {
                const ascm = new managers_1.AppSlashCommandManager(this.mockManager);
                (0, alsatian_1.Expect)(() => ascm.setAsTouched('testing', 'command')).not.toThrow();
                (0, alsatian_1.Expect)(ascm.appsTouchedCommands.has('testing')).toBe(true);
                (0, alsatian_1.Expect)(ascm.appsTouchedCommands.get('testing')).not.toBeEmpty();
                (0, alsatian_1.Expect)(ascm.appsTouchedCommands.get('testing').length).toBe(1);
                (0, alsatian_1.Expect)(ascm.touchedCommandsToApps.has('command')).toBe(true);
                (0, alsatian_1.Expect)(ascm.touchedCommandsToApps.get('command')).toBe('testing');
                (0, alsatian_1.Expect)(() => ascm.setAsTouched('testing', 'command')).not.toThrow();
                (0, alsatian_1.Expect)(ascm.appsTouchedCommands.get('testing').length).toBe(1);
            }
            registerCommand() {
                return __awaiter(this, void 0, void 0, function* () {
                    const ascm = new managers_1.AppSlashCommandManager(this.mockManager);
                    const regInfo = new AppSlashCommand_1.AppSlashCommand(this.mockApp, utilities_1.TestData.getSlashCommand('command'));
                    yield (0, alsatian_1.Expect)(() => ascm.registerCommand('testing', regInfo)).not.toThrowAsync();
                    (0, alsatian_1.Expect)(this.mockBridges.getCommandBridge().doRegisterCommand).toHaveBeenCalledWith(regInfo.slashCommand, 'testing');
                    (0, alsatian_1.Expect)(regInfo.isRegistered).toBe(true);
                    (0, alsatian_1.Expect)(regInfo.isDisabled).toBe(false);
                    (0, alsatian_1.Expect)(regInfo.isEnabled).toBe(true);
                });
            }
            addCommand() {
                return __awaiter(this, void 0, void 0, function* () {
                    const cmd = utilities_1.TestData.getSlashCommand('my-cmd');
                    const ascm = new managers_1.AppSlashCommandManager(this.mockManager);
                    yield (0, alsatian_1.Expect)(() => __awaiter(this, void 0, void 0, function* () { return ascm.addCommand('testing', cmd); })).not.toThrowAsync();
                    (0, alsatian_1.Expect)(this.mockBridges.getCommandBridge().commands.size).toBe(1);
                    (0, alsatian_1.Expect)(ascm.providedCommands.size).toBe(1);
                    (0, alsatian_1.Expect)(ascm.touchedCommandsToApps.get('my-cmd')).toBe('testing');
                    (0, alsatian_1.Expect)(ascm.appsTouchedCommands.get('testing').length).toBe(1);
                    yield (0, alsatian_1.Expect)(() => ascm.addCommand('another-app', cmd)).toThrowErrorAsync(errors_1.CommandHasAlreadyBeenTouchedError, 'The command "my-cmd" has already been touched by another App.');
                    yield (0, alsatian_1.Expect)(() => ascm.addCommand('testing', cmd)).toThrowErrorAsync(errors_1.CommandAlreadyExistsError, 'The command "my-cmd" already exists in the system.');
                    yield (0, alsatian_1.Expect)(() => ascm.addCommand('failMePlease', utilities_1.TestData.getSlashCommand('yet-another'))).toThrowErrorAsync(Error, 'App must exist in order for a command to be added.');
                    yield (0, alsatian_1.Expect)(() => ascm.addCommand('testing', utilities_1.TestData.getSlashCommand('another-command'))).not.toThrowAsync();
                    (0, alsatian_1.Expect)(ascm.providedCommands.size).toBe(1);
                    (0, alsatian_1.Expect)(ascm.providedCommands.get('testing').size).toBe(2);
                    yield (0, alsatian_1.Expect)(() => ascm.addCommand('even-another-app', utilities_1.TestData.getSlashCommand('it-exists'))).toThrowErrorAsync(errors_1.CommandAlreadyExistsError, 'The command "it-exists" already exists in the system.');
                });
            }
            failToModifyAnotherAppsCommand() {
                return __awaiter(this, void 0, void 0, function* () {
                    const ascm = new managers_1.AppSlashCommandManager(this.mockManager);
                    yield ascm.addCommand('other-app', utilities_1.TestData.getSlashCommand('my-cmd'));
                    yield (0, alsatian_1.Expect)(() => ascm.modifyCommand('testing', utilities_1.TestData.getSlashCommand('my-cmd'))).toThrowErrorAsync(errors_1.CommandHasAlreadyBeenTouchedError, 'The command "my-cmd" has already been touched by another App.');
                });
            }
            failToModifyNonExistantAppCommand() {
                return __awaiter(this, void 0, void 0, function* () {
                    const ascm = new managers_1.AppSlashCommandManager(this.mockManager);
                    yield (0, alsatian_1.Expect)(() => ascm.modifyCommand('failMePlease', utilities_1.TestData.getSlashCommand('yet-another'))).toThrowErrorAsync(Error, 'App must exist in order to modify a command.');
                });
            }
            modifyMyCommand() {
                return __awaiter(this, void 0, void 0, function* () {
                    const ascm = new managers_1.AppSlashCommandManager(this.mockManager);
                    yield (0, alsatian_1.Expect)(() => ascm.modifyCommand('testing', utilities_1.TestData.getSlashCommand())).toThrowErrorAsync(Error, 'You must first register a command before you can modify it.');
                    yield ascm.addCommand('testing', utilities_1.TestData.getSlashCommand('the-cmd'));
                    yield (0, alsatian_1.Expect)(() => ascm.modifyCommand('testing', utilities_1.TestData.getSlashCommand('the-cmd'))).not.toThrowAsync();
                });
            }
            modifySystemCommand() {
                return __awaiter(this, void 0, void 0, function* () {
                    const ascm = new managers_1.AppSlashCommandManager(this.mockManager);
                    yield (0, alsatian_1.Expect)(() => ascm.modifyCommand('brand-new-id', utilities_1.TestData.getSlashCommand('it-exists'))).not.toThrowAsync();
                    (0, alsatian_1.Expect)(ascm.modifiedCommands.size).toBe(1);
                    (0, alsatian_1.Expect)(ascm.modifiedCommands.get('it-exists')).toBeDefined();
                    (0, alsatian_1.Expect)(ascm.touchedCommandsToApps.get('it-exists')).toBe('brand-new-id');
                });
            }
            enableMyCommand() {
                return __awaiter(this, void 0, void 0, function* () {
                    const ascm = new managers_1.AppSlashCommandManager(this.mockManager);
                    yield (0, alsatian_1.Expect)(() => ascm.enableCommand('testing', 'doesnt-exist')).toThrowErrorAsync(Error, 'The command "doesnt-exist" does not exist to enable.');
                    yield ascm.addCommand('testing', utilities_1.TestData.getSlashCommand('command'));
                    yield (0, alsatian_1.Expect)(() => ascm.enableCommand('testing', 'command')).not.toThrowAsync();
                    (0, alsatian_1.Expect)(ascm.providedCommands.get('testing').get('command').isDisabled).toBe(false);
                    (0, alsatian_1.Expect)(ascm.providedCommands.get('testing').get('command').isEnabled).toBe(true);
                    yield ascm.addCommand('testing', utilities_1.TestData.getSlashCommand('another-command'));
                    ascm.providedCommands.get('testing').get('another-command').isRegistered = true;
                    yield (0, alsatian_1.Expect)(() => ascm.enableCommand('testing', 'another-command')).not.toThrowAsync();
                    (0, alsatian_1.Expect)(this.mockBridges.getCommandBridge().doDoesCommandExist).toHaveBeenCalled().exactly(3);
                });
            }
            enableSystemCommand() {
                return __awaiter(this, void 0, void 0, function* () {
                    const ascm = new managers_1.AppSlashCommandManager(this.mockManager);
                    yield (0, alsatian_1.Expect)(() => ascm.enableCommand('testing', 'it-exists')).not.toThrowAsync();
                    (0, alsatian_1.Expect)(this.mockBridges.getCommandBridge().doEnableCommand).toHaveBeenCalledWith('it-exists', 'testing').exactly(1);
                    (0, alsatian_1.Expect)(this.mockBridges.getCommandBridge().doDoesCommandExist).toHaveBeenCalled().exactly(1);
                });
            }
            failToEnableAnotherAppsCommand() {
                return __awaiter(this, void 0, void 0, function* () {
                    const ascm = new managers_1.AppSlashCommandManager(this.mockManager);
                    yield ascm.addCommand('another-app', utilities_1.TestData.getSlashCommand('command'));
                    yield (0, alsatian_1.Expect)(() => ascm.enableCommand('my-app', 'command')).toThrowErrorAsync(errors_1.CommandHasAlreadyBeenTouchedError, 'The command "command" has already been touched by another App.');
                });
            }
            disableMyCommand() {
                return __awaiter(this, void 0, void 0, function* () {
                    const ascm = new managers_1.AppSlashCommandManager(this.mockManager);
                    yield (0, alsatian_1.Expect)(() => ascm.disableCommand('testing', 'doesnt-exist')).toThrowErrorAsync(Error, 'The command "doesnt-exist" does not exist to disable.');
                    yield ascm.addCommand('testing', utilities_1.TestData.getSlashCommand('command'));
                    yield (0, alsatian_1.Expect)(() => ascm.disableCommand('testing', 'command')).not.toThrowAsync();
                    (0, alsatian_1.Expect)(ascm.providedCommands.get('testing').get('command').isDisabled).toBe(true);
                    (0, alsatian_1.Expect)(ascm.providedCommands.get('testing').get('command').isEnabled).toBe(false);
                    yield ascm.addCommand('testing', utilities_1.TestData.getSlashCommand('another-command'));
                    ascm.providedCommands.get('testing').get('another-command').isRegistered = true;
                    yield (0, alsatian_1.Expect)(() => ascm.disableCommand('testing', 'another-command')).not.toThrowAsync();
                    (0, alsatian_1.Expect)(this.mockBridges.getCommandBridge().doDoesCommandExist).toHaveBeenCalled().exactly(3);
                });
            }
            disableSystemCommand() {
                return __awaiter(this, void 0, void 0, function* () {
                    const ascm = new managers_1.AppSlashCommandManager(this.mockManager);
                    yield (0, alsatian_1.Expect)(() => ascm.disableCommand('testing', 'it-exists')).not.toThrowAsync();
                    (0, alsatian_1.Expect)(this.mockBridges.getCommandBridge().doDisableCommand).toHaveBeenCalledWith('it-exists', 'testing').exactly(1);
                    (0, alsatian_1.Expect)(this.mockBridges.getCommandBridge().doDoesCommandExist).toHaveBeenCalled().exactly(1);
                });
            }
            failToDisableAnotherAppsCommand() {
                return __awaiter(this, void 0, void 0, function* () {
                    const ascm = new managers_1.AppSlashCommandManager(this.mockManager);
                    yield ascm.addCommand('another-app', utilities_1.TestData.getSlashCommand('command'));
                    yield (0, alsatian_1.Expect)(() => ascm.disableCommand('my-app', 'command')).toThrowErrorAsync(errors_1.CommandHasAlreadyBeenTouchedError, 'The command "command" has already been touched by another App.');
                });
            }
            registerCommands() {
                return __awaiter(this, void 0, void 0, function* () {
                    const ascm = new managers_1.AppSlashCommandManager(this.mockManager);
                    (0, alsatian_1.SpyOn)(ascm, 'registerCommand');
                    yield ascm.addCommand('testing', utilities_1.TestData.getSlashCommand('enabled-command'));
                    const enabledRegInfo = ascm.providedCommands.get('testing').get('enabled-command');
                    yield ascm.addCommand('testing', utilities_1.TestData.getSlashCommand('disabled-command'));
                    yield ascm.disableCommand('testing', 'disabled-command');
                    const disabledRegInfo = ascm.providedCommands.get('testing').get('disabled-command');
                    yield (0, alsatian_1.Expect)(() => ascm.registerCommands('non-existant')).not.toThrowAsync();
                    yield (0, alsatian_1.Expect)(() => ascm.registerCommands('testing')).not.toThrowAsync();
                    (0, alsatian_1.Expect)(enabledRegInfo.isRegistered).toBe(true);
                    (0, alsatian_1.Expect)(disabledRegInfo.isRegistered).toBe(false);
                    (0, alsatian_1.Expect)(ascm.registerCommand)
                        .toHaveBeenCalledWith('testing', enabledRegInfo)
                        .exactly(1);
                    (0, alsatian_1.Expect)(this.mockBridges.getCommandBridge().doRegisterCommand).toHaveBeenCalledWith(enabledRegInfo.slashCommand, 'testing').exactly(1);
                });
            }
            unregisterCommands() {
                return __awaiter(this, void 0, void 0, function* () {
                    const ascm = new managers_1.AppSlashCommandManager(this.mockManager);
                    yield ascm.addCommand('testing', utilities_1.TestData.getSlashCommand('command'));
                    yield ascm.modifyCommand('testing', utilities_1.TestData.getSlashCommand('it-exists'));
                    yield (0, alsatian_1.Expect)(() => ascm.unregisterCommands('non-existant')).not.toThrowAsync();
                    yield (0, alsatian_1.Expect)(() => ascm.unregisterCommands('testing')).not.toThrowAsync();
                    (0, alsatian_1.Expect)(this.mockBridges.getCommandBridge().doUnregisterCommand).toHaveBeenCalled().exactly(1);
                });
            }
            executeCommands() {
                return __awaiter(this, void 0, void 0, function* () {
                    const ascm = new managers_1.AppSlashCommandManager(this.mockManager);
                    yield ascm.addCommand('testing', utilities_1.TestData.getSlashCommand('command'));
                    yield ascm.addCommand('testing', utilities_1.TestData.getSlashCommand('not-registered'));
                    yield ascm.addCommand('testing', utilities_1.TestData.getSlashCommand('disabled-command'));
                    yield ascm.disableCommand('testing', 'not-registered');
                    yield ascm.registerCommands('testing');
                    ascm.providedCommands.get('testing').get('disabled-command').isDisabled = true;
                    yield ascm.modifyCommand('testing', utilities_1.TestData.getSlashCommand('it-exists'));
                    const context = new slashcommands_1.SlashCommandContext(utilities_1.TestData.getUser(), utilities_1.TestData.getRoom(), []);
                    yield (0, alsatian_1.Expect)(() => ascm.executeCommand('nope', context)).not.toThrowAsync();
                    yield (0, alsatian_1.Expect)(() => ascm.executeCommand('it-exists', context)).not.toThrowAsync();
                    yield (0, alsatian_1.Expect)(() => ascm.executeCommand('command', context)).not.toThrowAsync();
                    yield (0, alsatian_1.Expect)(() => ascm.executeCommand('not-registered', context)).not.toThrowAsync();
                    yield (0, alsatian_1.Expect)(() => ascm.executeCommand('disabled-command', context)).not.toThrowAsync();
                    const classContext = new slashcommands_1.SlashCommandContext(utilities_1.TestData.getUser(), new Room_1.Room(utilities_1.TestData.getRoom(), this.mockManager), []);
                    yield (0, alsatian_1.Expect)(() => ascm.executeCommand('it-exists', classContext)).not.toThrowAsync();
                    // set it up for no "no app failure"
                    const failedItems = new Map();
                    const asm = new AppSlashCommand_1.AppSlashCommand(this.mockApp, utilities_1.TestData.getSlashCommand('failure'));
                    asm.hasBeenRegistered();
                    failedItems.set('failure', asm);
                    ascm.providedCommands.set('failMePlease', failedItems);
                    ascm.touchedCommandsToApps.set('failure', 'failMePlease');
                    yield (0, alsatian_1.Expect)(() => ascm.executeCommand('failure', context)).not.toThrowAsync();
                    _a.doThrow = true;
                    yield (0, alsatian_1.Expect)(() => ascm.executeCommand('command', context)).not.toThrowAsync();
                    _a.doThrow = false;
                });
            }
            getPreviews() {
                return __awaiter(this, void 0, void 0, function* () {
                    const ascm = new managers_1.AppSlashCommandManager(this.mockManager);
                    yield ascm.addCommand('testing', utilities_1.TestData.getSlashCommand('command'));
                    yield ascm.addCommand('testing', utilities_1.TestData.getSlashCommand('not-registered'));
                    yield ascm.addCommand('testing', utilities_1.TestData.getSlashCommand('disabled-command'));
                    yield ascm.disableCommand('testing', 'not-registered');
                    yield ascm.registerCommands('testing');
                    ascm.providedCommands.get('testing').get('disabled-command').isDisabled = true;
                    yield ascm.modifyCommand('testing', utilities_1.TestData.getSlashCommand('it-exists'));
                    const context = new slashcommands_1.SlashCommandContext(utilities_1.TestData.getUser(), utilities_1.TestData.getRoom(), ['testing']);
                    yield (0, alsatian_1.Expect)(() => ascm.getPreviews('nope', context)).not.toThrowAsync();
                    yield (0, alsatian_1.Expect)(() => ascm.getPreviews('it-exists', context)).not.toThrowAsync();
                    yield (0, alsatian_1.Expect)(() => ascm.getPreviews('command', context)).not.toThrowAsync();
                    yield (0, alsatian_1.Expect)(() => ascm.getPreviews('not-registered', context)).not.toThrowAsync();
                    yield (0, alsatian_1.Expect)(() => ascm.getPreviews('disabled-command', context)).not.toThrowAsync();
                    const classContext = new slashcommands_1.SlashCommandContext(utilities_1.TestData.getUser(), new Room_1.Room(utilities_1.TestData.getRoom(), this.mockManager), []);
                    yield (0, alsatian_1.Expect)(() => ascm.getPreviews('it-exists', classContext)).not.toThrowAsync();
                    // set it up for no "no app failure"
                    const failedItems = new Map();
                    const asm = new AppSlashCommand_1.AppSlashCommand(this.mockApp, utilities_1.TestData.getSlashCommand('failure'));
                    asm.hasBeenRegistered();
                    failedItems.set('failure', asm);
                    ascm.providedCommands.set('failMePlease', failedItems);
                    ascm.touchedCommandsToApps.set('failure', 'failMePlease');
                    yield (0, alsatian_1.Expect)(() => ascm.getPreviews('failure', context)).not.toThrowAsync();
                    // TODO: Figure out how tests can mock/test the result now that we care about it
                });
            }
            executePreview() {
                return __awaiter(this, void 0, void 0, function* () {
                    const previewItem = {};
                    const ascm = new managers_1.AppSlashCommandManager(this.mockManager);
                    yield ascm.addCommand('testing', utilities_1.TestData.getSlashCommand('command'));
                    yield ascm.addCommand('testing', utilities_1.TestData.getSlashCommand('not-registered'));
                    yield ascm.addCommand('testing', utilities_1.TestData.getSlashCommand('disabled-command'));
                    yield ascm.disableCommand('testing', 'not-registered');
                    yield ascm.registerCommands('testing');
                    ascm.providedCommands.get('testing').get('disabled-command').isDisabled = true;
                    yield ascm.modifyCommand('testing', utilities_1.TestData.getSlashCommand('it-exists'));
                    const context = new slashcommands_1.SlashCommandContext(utilities_1.TestData.getUser(), utilities_1.TestData.getRoom(), ['testing']);
                    yield (0, alsatian_1.Expect)(() => ascm.executePreview('nope', previewItem, context)).not.toThrowAsync();
                    yield (0, alsatian_1.Expect)(() => ascm.executePreview('it-exists', previewItem, context)).not.toThrowAsync();
                    yield (0, alsatian_1.Expect)(() => ascm.executePreview('command', previewItem, context)).not.toThrowAsync();
                    yield (0, alsatian_1.Expect)(() => ascm.executePreview('not-registered', previewItem, context)).not.toThrowAsync();
                    yield (0, alsatian_1.Expect)(() => ascm.executePreview('disabled-command', previewItem, context)).not.toThrowAsync();
                    const classContext = new slashcommands_1.SlashCommandContext(utilities_1.TestData.getUser(), new Room_1.Room(utilities_1.TestData.getRoom(), this.mockManager), []);
                    yield (0, alsatian_1.Expect)(() => ascm.executePreview('it-exists', previewItem, classContext)).not.toThrowAsync();
                    // set it up for no "no app failure"
                    const failedItems = new Map();
                    const asm = new AppSlashCommand_1.AppSlashCommand(this.mockApp, utilities_1.TestData.getSlashCommand('failure'));
                    asm.hasBeenRegistered();
                    failedItems.set('failure', asm);
                    ascm.providedCommands.set('failMePlease', failedItems);
                    ascm.touchedCommandsToApps.set('failure', 'failMePlease');
                    yield (0, alsatian_1.Expect)(() => ascm.executePreview('failure', previewItem, context)).not.toThrowAsync();
                });
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _setupFixture_decorators = [alsatian_1.SetupFixture];
            _setup_decorators = [alsatian_1.Setup];
            _teardown_decorators = [alsatian_1.Teardown];
            _basicAppSlashCommandManager_decorators = [(0, alsatian_1.Test)()];
            _canCommandBeTouchedBy_decorators = [(0, alsatian_1.Test)()];
            _isAlreadyDefined_decorators = [(0, alsatian_1.Test)()];
            _setAsTouched_decorators = [(0, alsatian_1.Test)()];
            _registerCommand_decorators = [(0, alsatian_1.AsyncTest)()];
            _addCommand_decorators = [(0, alsatian_1.AsyncTest)()];
            _failToModifyAnotherAppsCommand_decorators = [(0, alsatian_1.AsyncTest)()];
            _failToModifyNonExistantAppCommand_decorators = [(0, alsatian_1.AsyncTest)()];
            _modifyMyCommand_decorators = [(0, alsatian_1.AsyncTest)()];
            _modifySystemCommand_decorators = [(0, alsatian_1.AsyncTest)()];
            _enableMyCommand_decorators = [(0, alsatian_1.AsyncTest)()];
            _enableSystemCommand_decorators = [(0, alsatian_1.AsyncTest)()];
            _failToEnableAnotherAppsCommand_decorators = [(0, alsatian_1.AsyncTest)()];
            _disableMyCommand_decorators = [(0, alsatian_1.AsyncTest)()];
            _disableSystemCommand_decorators = [(0, alsatian_1.AsyncTest)()];
            _failToDisableAnotherAppsCommand_decorators = [(0, alsatian_1.AsyncTest)()];
            _registerCommands_decorators = [(0, alsatian_1.AsyncTest)()];
            _unregisterCommands_decorators = [(0, alsatian_1.AsyncTest)()];
            _executeCommands_decorators = [(0, alsatian_1.AsyncTest)()];
            _getPreviews_decorators = [(0, alsatian_1.AsyncTest)()];
            _executePreview_decorators = [(0, alsatian_1.AsyncTest)()];
            __esDecorate(_a, null, _setupFixture_decorators, { kind: "method", name: "setupFixture", static: false, private: false, access: { has: obj => "setupFixture" in obj, get: obj => obj.setupFixture }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _setup_decorators, { kind: "method", name: "setup", static: false, private: false, access: { has: obj => "setup" in obj, get: obj => obj.setup }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _teardown_decorators, { kind: "method", name: "teardown", static: false, private: false, access: { has: obj => "teardown" in obj, get: obj => obj.teardown }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _basicAppSlashCommandManager_decorators, { kind: "method", name: "basicAppSlashCommandManager", static: false, private: false, access: { has: obj => "basicAppSlashCommandManager" in obj, get: obj => obj.basicAppSlashCommandManager }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _canCommandBeTouchedBy_decorators, { kind: "method", name: "canCommandBeTouchedBy", static: false, private: false, access: { has: obj => "canCommandBeTouchedBy" in obj, get: obj => obj.canCommandBeTouchedBy }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _isAlreadyDefined_decorators, { kind: "method", name: "isAlreadyDefined", static: false, private: false, access: { has: obj => "isAlreadyDefined" in obj, get: obj => obj.isAlreadyDefined }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _setAsTouched_decorators, { kind: "method", name: "setAsTouched", static: false, private: false, access: { has: obj => "setAsTouched" in obj, get: obj => obj.setAsTouched }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _registerCommand_decorators, { kind: "method", name: "registerCommand", static: false, private: false, access: { has: obj => "registerCommand" in obj, get: obj => obj.registerCommand }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _addCommand_decorators, { kind: "method", name: "addCommand", static: false, private: false, access: { has: obj => "addCommand" in obj, get: obj => obj.addCommand }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _failToModifyAnotherAppsCommand_decorators, { kind: "method", name: "failToModifyAnotherAppsCommand", static: false, private: false, access: { has: obj => "failToModifyAnotherAppsCommand" in obj, get: obj => obj.failToModifyAnotherAppsCommand }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _failToModifyNonExistantAppCommand_decorators, { kind: "method", name: "failToModifyNonExistantAppCommand", static: false, private: false, access: { has: obj => "failToModifyNonExistantAppCommand" in obj, get: obj => obj.failToModifyNonExistantAppCommand }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _modifyMyCommand_decorators, { kind: "method", name: "modifyMyCommand", static: false, private: false, access: { has: obj => "modifyMyCommand" in obj, get: obj => obj.modifyMyCommand }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _modifySystemCommand_decorators, { kind: "method", name: "modifySystemCommand", static: false, private: false, access: { has: obj => "modifySystemCommand" in obj, get: obj => obj.modifySystemCommand }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _enableMyCommand_decorators, { kind: "method", name: "enableMyCommand", static: false, private: false, access: { has: obj => "enableMyCommand" in obj, get: obj => obj.enableMyCommand }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _enableSystemCommand_decorators, { kind: "method", name: "enableSystemCommand", static: false, private: false, access: { has: obj => "enableSystemCommand" in obj, get: obj => obj.enableSystemCommand }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _failToEnableAnotherAppsCommand_decorators, { kind: "method", name: "failToEnableAnotherAppsCommand", static: false, private: false, access: { has: obj => "failToEnableAnotherAppsCommand" in obj, get: obj => obj.failToEnableAnotherAppsCommand }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _disableMyCommand_decorators, { kind: "method", name: "disableMyCommand", static: false, private: false, access: { has: obj => "disableMyCommand" in obj, get: obj => obj.disableMyCommand }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _disableSystemCommand_decorators, { kind: "method", name: "disableSystemCommand", static: false, private: false, access: { has: obj => "disableSystemCommand" in obj, get: obj => obj.disableSystemCommand }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _failToDisableAnotherAppsCommand_decorators, { kind: "method", name: "failToDisableAnotherAppsCommand", static: false, private: false, access: { has: obj => "failToDisableAnotherAppsCommand" in obj, get: obj => obj.failToDisableAnotherAppsCommand }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _registerCommands_decorators, { kind: "method", name: "registerCommands", static: false, private: false, access: { has: obj => "registerCommands" in obj, get: obj => obj.registerCommands }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _unregisterCommands_decorators, { kind: "method", name: "unregisterCommands", static: false, private: false, access: { has: obj => "unregisterCommands" in obj, get: obj => obj.unregisterCommands }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _executeCommands_decorators, { kind: "method", name: "executeCommands", static: false, private: false, access: { has: obj => "executeCommands" in obj, get: obj => obj.executeCommands }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getPreviews_decorators, { kind: "method", name: "getPreviews", static: false, private: false, access: { has: obj => "getPreviews" in obj, get: obj => obj.getPreviews }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _executePreview_decorators, { kind: "method", name: "executePreview", static: false, private: false, access: { has: obj => "executePreview" in obj, get: obj => obj.executePreview }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a.doThrow = false,
        _a;
})();
exports.AppSlashCommandManagerTestFixture = AppSlashCommandManagerTestFixture;
