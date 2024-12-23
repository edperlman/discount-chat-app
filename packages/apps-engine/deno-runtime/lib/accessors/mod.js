"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.AppAccessorsInstance = exports.AppAccessors = void 0;
const http_ts_1 = require("./http.ts");
const HttpExtender_ts_1 = require("./extenders/HttpExtender.ts");
const Messenger = __importStar(require("../messenger.ts"));
const AppObjectRegistry_ts_1 = require("../../AppObjectRegistry.ts");
const ModifyCreator_ts_1 = require("./modify/ModifyCreator.ts");
const ModifyUpdater_ts_1 = require("./modify/ModifyUpdater.ts");
const ModifyExtender_ts_1 = require("./modify/ModifyExtender.ts");
const notifier_ts_1 = require("./notifier.ts");
const httpMethods = ['get', 'post', 'put', 'delete', 'head', 'options', 'patch'];
// We need to create this object first thing, as we'll handle references to it later on
if (!AppObjectRegistry_ts_1.AppObjectRegistry.has('apiEndpoints')) {
    AppObjectRegistry_ts_1.AppObjectRegistry.set('apiEndpoints', []);
}
class AppAccessors {
    constructor(senderFn) {
        this.senderFn = senderFn;
        this.httpExtend = new HttpExtender_ts_1.HttpExtend();
        this.proxify = (namespace, overrides = {}) => new Proxy({ __kind: `accessor:${namespace}` }, {
            get: (_target, prop) => (...params) => {
                // We don't want to send a request for this prop
                if (prop === 'toJSON') {
                    return {};
                }
                // If the prop is inteded to be overriden by the caller
                if (prop in overrides) {
                    return overrides[prop].apply(undefined, params);
                }
                return senderFn({
                    method: `accessor:${namespace}:${prop}`,
                    params,
                })
                    .then((response) => response.result)
                    .catch((err) => { throw new Error(err.error); });
            },
        });
        this.http = new http_ts_1.Http(this.getReader(), this.getPersistence(), this.httpExtend, this.getSenderFn());
        this.notifier = new notifier_ts_1.Notifier(this.getSenderFn());
    }
    getSenderFn() {
        return this.senderFn;
    }
    getEnvironmentRead() {
        if (!this.environmentRead) {
            this.environmentRead = {
                getSettings: () => this.proxify('getEnvironmentRead:getSettings'),
                getServerSettings: () => this.proxify('getEnvironmentRead:getServerSettings'),
                getEnvironmentVariables: () => this.proxify('getEnvironmentRead:getEnvironmentVariables'),
            };
        }
        return this.environmentRead;
    }
    getEnvironmentWrite() {
        if (!this.environmentWriter) {
            this.environmentWriter = {
                getSettings: () => this.proxify('getEnvironmentWrite:getSettings'),
                getServerSettings: () => this.proxify('getEnvironmentWrite:getServerSettings'),
            };
        }
        return this.environmentWriter;
    }
    getConfigurationModify() {
        if (!this.configModifier) {
            this.configModifier = {
                scheduler: this.proxify('getConfigurationModify:scheduler'),
                slashCommands: {
                    _proxy: this.proxify('getConfigurationModify:slashCommands'),
                    modifySlashCommand(slashcommand) {
                        // Store the slashcommand instance to use when the Apps-Engine calls the slashcommand
                        AppObjectRegistry_ts_1.AppObjectRegistry.set(`slashcommand:${slashcommand.command}`, slashcommand);
                        return this._proxy.modifySlashCommand(slashcommand);
                    },
                    disableSlashCommand(command) {
                        return this._proxy.disableSlashCommand(command);
                    },
                    enableSlashCommand(command) {
                        return this._proxy.enableSlashCommand(command);
                    },
                },
                serverSettings: this.proxify('getConfigurationModify:serverSettings'),
            };
        }
        return this.configModifier;
    }
    getConfigurationExtend() {
        if (!this.configExtender) {
            const senderFn = this.senderFn;
            this.configExtender = {
                ui: this.proxify('getConfigurationExtend:ui'),
                http: this.httpExtend,
                settings: this.proxify('getConfigurationExtend:settings'),
                externalComponents: this.proxify('getConfigurationExtend:externalComponents'),
                api: {
                    _proxy: this.proxify('getConfigurationExtend:api'),
                    provideApi(api) {
                        return __awaiter(this, void 0, void 0, function* () {
                            const apiEndpoints = AppObjectRegistry_ts_1.AppObjectRegistry.get('apiEndpoints');
                            api.endpoints.forEach((endpoint) => {
                                endpoint._availableMethods = httpMethods.filter((method) => typeof endpoint[method] === 'function');
                                // We need to keep a reference to the endpoint around for us to call the executor later
                                AppObjectRegistry_ts_1.AppObjectRegistry.set(`api:${endpoint.path}`, endpoint);
                            });
                            const result = yield this._proxy.provideApi(api);
                            // Let's call the listApis method to cache the info from the endpoints
                            // Also, since this is a side-effect, we do it async so we can return to the caller
                            senderFn({ method: 'accessor:api:listApis' })
                                .then((response) => apiEndpoints.push(...response.result))
                                .catch((err) => err.error);
                            return result;
                        });
                    },
                },
                scheduler: {
                    _proxy: this.proxify('getConfigurationExtend:scheduler'),
                    registerProcessors(processors) {
                        // Store the processor instance to use when the Apps-Engine calls the processor
                        processors.forEach((processor) => {
                            AppObjectRegistry_ts_1.AppObjectRegistry.set(`scheduler:${processor.id}`, processor);
                        });
                        return this._proxy.registerProcessors(processors);
                    },
                },
                videoConfProviders: {
                    _proxy: this.proxify('getConfigurationExtend:videoConfProviders'),
                    provideVideoConfProvider(provider) {
                        // Store the videoConfProvider instance to use when the Apps-Engine calls the videoConfProvider
                        AppObjectRegistry_ts_1.AppObjectRegistry.set(`videoConfProvider:${provider.name}`, provider);
                        return this._proxy.provideVideoConfProvider(provider);
                    },
                },
                slashCommands: {
                    _proxy: this.proxify('getConfigurationExtend:slashCommands'),
                    provideSlashCommand(slashcommand) {
                        // Store the slashcommand instance to use when the Apps-Engine calls the slashcommand
                        AppObjectRegistry_ts_1.AppObjectRegistry.set(`slashcommand:${slashcommand.command}`, slashcommand);
                        return this._proxy.provideSlashCommand(slashcommand);
                    },
                },
            };
        }
        return this.configExtender;
    }
    getDefaultAppAccessors() {
        if (!this.defaultAppAccessors) {
            this.defaultAppAccessors = {
                environmentReader: this.getEnvironmentRead(),
                environmentWriter: this.getEnvironmentWrite(),
                reader: this.getReader(),
                http: this.getHttp(),
                providedApiEndpoints: AppObjectRegistry_ts_1.AppObjectRegistry.get('apiEndpoints'),
            };
        }
        return this.defaultAppAccessors;
    }
    getReader() {
        if (!this.reader) {
            this.reader = {
                getEnvironmentReader: () => ({
                    getSettings: () => this.proxify('getReader:getEnvironmentReader:getSettings'),
                    getServerSettings: () => this.proxify('getReader:getEnvironmentReader:getServerSettings'),
                    getEnvironmentVariables: () => this.proxify('getReader:getEnvironmentReader:getEnvironmentVariables'),
                }),
                getMessageReader: () => this.proxify('getReader:getMessageReader'),
                getPersistenceReader: () => this.proxify('getReader:getPersistenceReader'),
                getRoomReader: () => this.proxify('getReader:getRoomReader'),
                getUserReader: () => this.proxify('getReader:getUserReader'),
                getNotifier: () => this.getNotifier(),
                getLivechatReader: () => this.proxify('getReader:getLivechatReader'),
                getUploadReader: () => this.proxify('getReader:getUploadReader'),
                getCloudWorkspaceReader: () => this.proxify('getReader:getCloudWorkspaceReader'),
                getVideoConferenceReader: () => this.proxify('getReader:getVideoConferenceReader'),
                getOAuthAppsReader: () => this.proxify('getReader:getOAuthAppsReader'),
                getThreadReader: () => this.proxify('getReader:getThreadReader'),
                getRoleReader: () => this.proxify('getReader:getRoleReader'),
                getContactReader: () => this.proxify('getReader:getContactReader'),
            };
        }
        return this.reader;
    }
    getModifier() {
        if (!this.modifier) {
            this.modifier = {
                getCreator: this.getCreator.bind(this),
                getUpdater: this.getUpdater.bind(this),
                getExtender: this.getExtender.bind(this),
                getDeleter: () => this.proxify('getModifier:getDeleter'),
                getNotifier: () => this.getNotifier(),
                getUiController: () => this.proxify('getModifier:getUiController'),
                getScheduler: () => this.proxify('getModifier:getScheduler'),
                getOAuthAppsModifier: () => this.proxify('getModifier:getOAuthAppsModifier'),
                getModerationModifier: () => this.proxify('getModifier:getModerationModifier'),
            };
        }
        return this.modifier;
    }
    getPersistence() {
        if (!this.persistence) {
            this.persistence = this.proxify('getPersistence');
        }
        return this.persistence;
    }
    getHttp() {
        return this.http;
    }
    getCreator() {
        if (!this.creator) {
            this.creator = new ModifyCreator_ts_1.ModifyCreator(this.senderFn);
        }
        return this.creator;
    }
    getUpdater() {
        if (!this.updater) {
            this.updater = new ModifyUpdater_ts_1.ModifyUpdater(this.senderFn);
        }
        return this.updater;
    }
    getExtender() {
        if (!this.extender) {
            this.extender = new ModifyExtender_ts_1.ModifyExtender(this.senderFn);
        }
        return this.extender;
    }
    getNotifier() {
        return this.notifier;
    }
}
exports.AppAccessors = AppAccessors;
exports.AppAccessorsInstance = new AppAccessors(Messenger.sendRequest);
