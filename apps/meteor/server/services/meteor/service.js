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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeteorService = void 0;
/* eslint-disable react-hooks/rules-of-hooks */
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const mongo_1 = require("meteor/mongo");
const triggerHandler_1 = require("../../../app/integrations/server/lib/triggerHandler");
const LivechatTyped_1 = require("../../../app/livechat/server/lib/LivechatTyped");
const agentStatus_1 = require("../../../app/livechat/server/lib/stream/agentStatus");
const server_1 = require("../../../app/metrics/server");
const Notifications_1 = __importDefault(require("../../../app/notifications/server/lib/Notifications"));
const server_2 = require("../../../app/settings/server");
const Middleware_1 = require("../../../app/settings/server/Middleware");
const raw_1 = require("../../../app/settings/server/raw");
const getURL_1 = require("../../../app/utils/server/getURL");
const EmailInbox_1 = require("../../features/EmailInbox/EmailInbox");
const listeners_module_1 = require("../../modules/listeners/listeners.module");
let processOnChange;
// eslint-disable-next-line no-undef
const disableOplog = !!Package['disable-oplog'];
const serviceConfigCallbacks = new Set();
const disableMsgRoundtripTracking = ['yes', 'true'].includes(String(process.env.DISABLE_MESSAGE_ROUNDTRIP_TRACKING).toLowerCase());
if (disableOplog) {
    // Stores the callbacks for the disconnection reactivity bellow
    const userCallbacks = new Map();
    // Overrides the native observe changes to prevent database polling and stores the callbacks
    // for the users' tokens to re-implement the reactivity based on our database listeners
    const { mongo } = mongo_1.MongoInternals.defaultRemoteCollectionDriver();
    mongo_1.MongoInternals.Connection.prototype._observeChanges = function (_a, _ordered_1, callbacks_1) {
        return __awaiter(this, arguments, void 0, function* ({ collectionName, selector, options = {}, }, _ordered, callbacks) {
            // console.error('Connection.Collection.prototype._observeChanges', collectionName, selector, options);
            let cbs;
            let data;
            if (callbacks === null || callbacks === void 0 ? void 0 : callbacks.added) {
                const records = yield mongo
                    .rawCollection(collectionName)
                    .find(selector, Object.assign({}, (options.projection || options.fields ? { projection: options.projection || options.fields } : {})))
                    .toArray();
                for (let _b of records) {
                    const { _id } = _b, fields = __rest(_b, ["_id"]);
                    callbacks.added(String(_id), fields);
                }
                if (collectionName === 'users' && selector['services.resume.loginTokens.hashedToken']) {
                    cbs = userCallbacks.get(selector._id) || new Set();
                    data = {
                        hashedToken: selector['services.resume.loginTokens.hashedToken'],
                        callbacks,
                    };
                    cbs.add(data);
                    userCallbacks.set(selector._id, cbs);
                }
            }
            if (collectionName === 'meteor_accounts_loginServiceConfiguration') {
                serviceConfigCallbacks.add(callbacks);
            }
            return {
                stop() {
                    if (cbs) {
                        cbs.delete(data);
                    }
                    serviceConfigCallbacks.delete(callbacks);
                },
            };
        });
    };
    // Re-implement meteor's reactivity that uses observe to disconnect sessions when the token
    // associated was removed
    processOnChange = (diff, id) => {
        if (!diff || !('services.resume.loginTokens' in diff)) {
            return;
        }
        const loginTokens = diff['services.resume.loginTokens'];
        const tokens = loginTokens === null || loginTokens === void 0 ? void 0 : loginTokens.map(({ hashedToken }) => hashedToken);
        const cbs = userCallbacks.get(id);
        if (cbs) {
            [...cbs]
                .filter(({ hashedToken }) => tokens === undefined || !tokens.includes(hashedToken))
                .forEach((item) => {
                item.callbacks.removed(id);
                cbs.delete(item);
            });
        }
    };
}
server_2.settings.set = (0, Middleware_1.use)(server_2.settings.set, (context, next) => {
    next(...context);
    const [record] = context;
    (0, raw_1.updateValue)(record._id, record);
});
const clientVersionsStore = new Map();
class MeteorService extends core_services_1.ServiceClassInternal {
    constructor() {
        super();
        this.name = 'meteor';
        new listeners_module_1.ListenersModule(this, Notifications_1.default);
        this.onEvent('watch.settings', (_a) => __awaiter(this, [_a], void 0, function* ({ clientAction, setting }) {
            if (clientAction !== 'removed') {
                server_2.settings.set(setting);
                return;
            }
            server_2.settings.set(Object.assign(Object.assign({}, setting), { value: undefined }));
            (0, raw_1.setValue)(setting._id, undefined);
        }));
        if (disableOplog) {
            this.onEvent('watch.loginServiceConfiguration', ({ clientAction, id, data }) => {
                if (clientAction === 'removed') {
                    serviceConfigCallbacks.forEach((callbacks) => {
                        var _a;
                        (_a = callbacks.removed) === null || _a === void 0 ? void 0 : _a.call(callbacks, id);
                    });
                    return;
                }
                if (data) {
                    serviceConfigCallbacks.forEach((callbacks) => {
                        var _a;
                        (_a = callbacks[clientAction === 'inserted' ? 'added' : 'changed']) === null || _a === void 0 ? void 0 : _a.call(callbacks, id, data);
                    });
                }
            });
        }
        this.onEvent('watch.users', (data) => __awaiter(this, void 0, void 0, function* () {
            if (disableOplog) {
                if (data.clientAction === 'updated' && data.diff) {
                    processOnChange(data.diff, data.id);
                }
            }
            if (!agentStatus_1.monitorAgents) {
                return;
            }
            if (data.clientAction !== 'removed' && 'diff' in data && !data.diff.status && !data.diff.statusLivechat) {
                return;
            }
            switch (data.clientAction) {
                case 'updated':
                case 'inserted':
                    const agent = yield models_1.Users.findOneAgentById(data.id, {
                        projection: {
                            status: 1,
                            statusLivechat: 1,
                        },
                    });
                    const serviceOnline = agent && agent.status !== 'offline' && agent.statusLivechat === 'available';
                    if (serviceOnline) {
                        return agentStatus_1.onlineAgents.add(data.id);
                    }
                    agentStatus_1.onlineAgents.remove(data.id);
                    break;
                case 'removed':
                    agentStatus_1.onlineAgents.remove(data.id);
                    break;
            }
        }));
        this.onEvent('watch.integrations', (_a) => __awaiter(this, [_a], void 0, function* ({ clientAction, id, data }) {
            switch (clientAction) {
                case 'inserted':
                    if (data.type === 'webhook-outgoing') {
                        triggerHandler_1.triggerHandler.addIntegration(data);
                    }
                    break;
                case 'updated':
                    if (data.type === 'webhook-outgoing') {
                        triggerHandler_1.triggerHandler.removeIntegration(data);
                        triggerHandler_1.triggerHandler.addIntegration(data);
                    }
                    break;
                case 'removed':
                    triggerHandler_1.triggerHandler.removeIntegration({ _id: id });
                    break;
            }
        }));
        this.onEvent('watch.emailInbox', () => __awaiter(this, void 0, void 0, function* () {
            yield (0, EmailInbox_1.configureEmailInboxes)();
        }));
        if (!disableMsgRoundtripTracking) {
            this.onEvent('watch.messages', (_a) => __awaiter(this, [_a], void 0, function* ({ message }) {
                if ((message === null || message === void 0 ? void 0 : message._updatedAt) instanceof Date) {
                    server_1.metrics.messageRoundtripTime.observe(Date.now() - message._updatedAt.getTime());
                }
            }));
        }
    }
    started() {
        return __awaiter(this, void 0, void 0, function* () {
            // Even after server startup, client versions might not be updated yet, the only way
            // to make sure we can send the most up to date versions is using the publication below.
            // Since it receives each document one at a time, we have to store them to be able to send
            // them all when needed (i.e.: on ddp-streamer startup).
            meteor_1.Meteor.server.publish_handlers.meteor_autoupdate_clientVersions.call({
                added(_collection, _id, version) {
                    clientVersionsStore.set(_id, version);
                    void core_services_1.api.broadcast('meteor.clientVersionUpdated', version);
                },
                changed(_collection, _id, version) {
                    clientVersionsStore.set(_id, version);
                    void core_services_1.api.broadcast('meteor.clientVersionUpdated', version);
                },
                onStop() {
                    //
                },
                ready() {
                    //
                },
            });
        });
    }
    getAutoUpdateClientVersions() {
        return __awaiter(this, void 0, void 0, function* () {
            return Object.fromEntries(clientVersionsStore);
        });
    }
    getLoginServiceConfiguration() {
        return __awaiter(this, void 0, void 0, function* () {
            return models_1.LoginServiceConfiguration.find({}, { projection: { secret: 0 } }).toArray();
        });
    }
    callMethodWithToken(userId, token, method, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield models_1.Users.findOneByIdAndLoginHashedToken(userId, token, {
                projection: { _id: 1 },
            });
            if (!user) {
                return {
                    result: meteor_1.Meteor.callAsync(method, ...args),
                };
            }
            return {
                result: meteor_1.Meteor.runAsUser(userId, () => meteor_1.Meteor.callAsync(method, ...args)),
            };
        });
    }
    notifyGuestStatusChanged(token, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return LivechatTyped_1.Livechat.notifyGuestStatusChanged(token, status);
        });
    }
    getURL(path_1) {
        return __awaiter(this, arguments, void 0, function* (path, params = {}, cloudDeepLinkUrl) {
            return (0, getURL_1.getURL)(path, params, cloudDeepLinkUrl);
        });
    }
}
exports.MeteorService = MeteorService;
