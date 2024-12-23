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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const tools_1 = require("@rocket.chat/tools");
const babel_compiler_1 = require("meteor/babel-compiler");
const meteor_1 = require("meteor/meteor");
const underscore_1 = __importDefault(require("underscore"));
const hasPermission_1 = require("../../../../authorization/server/functions/hasPermission");
const notifyListener_1 = require("../../../../lib/server/lib/notifyListener");
const validateScriptEngine_1 = require("../../lib/validateScriptEngine");
const validChannelChars = ['@', '#'];
meteor_1.Meteor.methods({
    // eslint-disable-next-line complexity
    updateIncomingIntegration(integrationId, integration) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            var _d, _e, _f, _g, _h;
            if (!this.userId) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'updateOutgoingIntegration',
                });
            }
            if (!integration.channel || typeof integration.channel.valueOf() !== 'string' || integration.channel.trim() === '') {
                throw new meteor_1.Meteor.Error('error-invalid-channel', 'Invalid channel', {
                    method: 'updateIncomingIntegration',
                });
            }
            const channels = integration.channel.split(',').map((channel) => channel.trim());
            for (const channel of channels) {
                if (!validChannelChars.includes(channel[0])) {
                    throw new meteor_1.Meteor.Error('error-invalid-channel-start-with-chars', 'Invalid channel. Start with @ or #', {
                        method: 'updateIncomingIntegration',
                    });
                }
            }
            let currentIntegration;
            if (yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'manage-incoming-integrations')) {
                currentIntegration = yield models_1.Integrations.findOneById(integrationId);
            }
            else if (yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'manage-own-incoming-integrations')) {
                currentIntegration = yield models_1.Integrations.findOne({
                    '_id': integrationId,
                    '_createdBy._id': this.userId,
                });
            }
            else {
                throw new meteor_1.Meteor.Error('not_authorized', 'Unauthorized', {
                    method: 'updateIncomingIntegration',
                });
            }
            if (!currentIntegration) {
                throw new meteor_1.Meteor.Error('error-invalid-integration', 'Invalid integration', {
                    method: 'updateIncomingIntegration',
                });
            }
            const oldScriptEngine = currentIntegration.scriptEngine;
            const scriptEngine = (_e = (_d = integration.scriptEngine) !== null && _d !== void 0 ? _d : oldScriptEngine) !== null && _e !== void 0 ? _e : 'isolated-vm';
            if (((_f = integration.script) === null || _f === void 0 ? void 0 : _f.trim()) &&
                (scriptEngine !== oldScriptEngine || ((_g = integration.script) === null || _g === void 0 ? void 0 : _g.trim()) !== ((_h = currentIntegration.script) === null || _h === void 0 ? void 0 : _h.trim()))) {
                (0, tools_1.wrapExceptions)(() => (0, validateScriptEngine_1.validateScriptEngine)(scriptEngine)).catch((e) => {
                    throw new meteor_1.Meteor.Error(e.message);
                });
            }
            const isFrozen = (0, validateScriptEngine_1.isScriptEngineFrozen)(scriptEngine);
            if (!isFrozen) {
                let scriptCompiled;
                let scriptError;
                if (integration.scriptEnabled === true && integration.script && integration.script.trim() !== '') {
                    try {
                        let babelOptions = babel_compiler_1.Babel.getDefaultOptions({ runtime: false });
                        babelOptions = underscore_1.default.extend(babelOptions, { compact: true, minified: true, comments: false });
                        scriptCompiled = babel_compiler_1.Babel.compile(integration.script, babelOptions).code;
                        scriptError = undefined;
                        yield models_1.Integrations.updateOne({ _id: integrationId }, {
                            $set: {
                                scriptCompiled,
                            },
                            $unset: { scriptError: 1 },
                        });
                    }
                    catch (e) {
                        scriptCompiled = undefined;
                        if (e instanceof Error) {
                            const { name, message, stack } = e;
                            scriptError = { name, message, stack };
                        }
                        yield models_1.Integrations.updateOne({ _id: integrationId }, {
                            $set: {
                                scriptError,
                            },
                            $unset: {
                                scriptCompiled: 1,
                            },
                        });
                    }
                }
            }
            try {
                for (var _j = true, channels_1 = __asyncValues(channels), channels_1_1; channels_1_1 = yield channels_1.next(), _a = channels_1_1.done, !_a; _j = true) {
                    _c = channels_1_1.value;
                    _j = false;
                    let channel = _c;
                    const channelType = channel[0];
                    channel = channel.slice(1);
                    let record;
                    switch (channelType) {
                        case '#':
                            record = yield models_1.Rooms.findOne({
                                $or: [{ _id: channel }, { name: channel }],
                            });
                            break;
                        case '@':
                            record = yield models_1.Users.findOne({
                                $or: [{ _id: channel }, { username: channel }],
                            });
                            break;
                    }
                    if (!record) {
                        throw new meteor_1.Meteor.Error('error-invalid-room', 'Invalid room', {
                            method: 'updateIncomingIntegration',
                        });
                    }
                    if (!(yield (0, hasPermission_1.hasAllPermissionAsync)(this.userId, ['manage-incoming-integrations', 'manage-own-incoming-integrations'])) &&
                        !(yield models_1.Subscriptions.findOneByRoomIdAndUserId(record._id, this.userId, { projection: { _id: 1 } }))) {
                        throw new meteor_1.Meteor.Error('error-invalid-channel', 'Invalid Channel', {
                            method: 'updateIncomingIntegration',
                        });
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_j && !_a && (_b = channels_1.return)) yield _b.call(channels_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            const user = yield models_1.Users.findOne({ username: currentIntegration.username });
            if (!(user === null || user === void 0 ? void 0 : user._id)) {
                throw new meteor_1.Meteor.Error('error-invalid-post-as-user', 'Invalid Post As User', {
                    method: 'updateIncomingIntegration',
                });
            }
            yield models_1.Roles.addUserRoles(user._id, ['bot']);
            const updatedIntegration = yield models_1.Integrations.findOneAndUpdate({ _id: integrationId }, {
                $set: Object.assign(Object.assign(Object.assign(Object.assign({ enabled: integration.enabled, name: integration.name, avatar: integration.avatar, emoji: integration.emoji, alias: integration.alias, channel: channels }, ('username' in integration && { username: integration.username })), (isFrozen
                    ? {}
                    : {
                        script: integration.script,
                        scriptEnabled: integration.scriptEnabled,
                        scriptEngine,
                    })), (typeof integration.overrideDestinationChannelEnabled !== 'undefined' && {
                    overrideDestinationChannelEnabled: integration.overrideDestinationChannelEnabled,
                })), { _updatedAt: new Date(), _updatedBy: yield models_1.Users.findOne({ _id: this.userId }, { projection: { username: 1 } }) }),
            });
            if (updatedIntegration.value) {
                void (0, notifyListener_1.notifyOnIntegrationChanged)(updatedIntegration.value);
            }
            return updatedIntegration.value;
        });
    },
});
