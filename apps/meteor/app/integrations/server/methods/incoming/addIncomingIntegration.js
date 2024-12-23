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
exports.addIncomingIntegration = void 0;
const models_1 = require("@rocket.chat/models");
const random_1 = require("@rocket.chat/random");
const babel_compiler_1 = require("meteor/babel-compiler");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const underscore_1 = __importDefault(require("underscore"));
const hasPermission_1 = require("../../../../authorization/server/functions/hasPermission");
const notifyListener_1 = require("../../../../lib/server/lib/notifyListener");
const validateScriptEngine_1 = require("../../lib/validateScriptEngine");
const validChannelChars = ['@', '#'];
const addIncomingIntegration = (userId, integration) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    var _d, _e, _f, _g;
    (0, check_1.check)(integration, check_1.Match.ObjectIncluding({
        type: String,
        name: String,
        enabled: Boolean,
        username: String,
        channel: String,
        alias: check_1.Match.Maybe(String),
        emoji: check_1.Match.Maybe(String),
        scriptEnabled: Boolean,
        scriptEngine: check_1.Match.Maybe(String),
        overrideDestinationChannelEnabled: check_1.Match.Maybe(Boolean),
        script: check_1.Match.Maybe(String),
        avatar: check_1.Match.Maybe(String),
    }));
    if (!userId ||
        (!(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'manage-incoming-integrations')) &&
            !(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'manage-own-incoming-integrations')))) {
        throw new meteor_1.Meteor.Error('not_authorized', 'Unauthorized', {
            method: 'addIncomingIntegration',
        });
    }
    if (!integration.channel || typeof integration.channel.valueOf() !== 'string') {
        throw new meteor_1.Meteor.Error('error-invalid-channel', 'Invalid channel', {
            method: 'addIncomingIntegration',
        });
    }
    if (integration.channel.trim() === '') {
        throw new meteor_1.Meteor.Error('error-invalid-channel', 'Invalid channel', {
            method: 'addIncomingIntegration',
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
    if (!integration.username || typeof integration.username.valueOf() !== 'string' || integration.username.trim() === '') {
        throw new meteor_1.Meteor.Error('error-invalid-username', 'Invalid username', {
            method: 'addIncomingIntegration',
        });
    }
    if ((_d = integration.script) === null || _d === void 0 ? void 0 : _d.trim()) {
        (0, validateScriptEngine_1.validateScriptEngine)((_e = integration.scriptEngine) !== null && _e !== void 0 ? _e : 'isolated-vm');
    }
    const user = yield models_1.Users.findOne({ username: integration.username });
    if (!user) {
        throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
            method: 'addIncomingIntegration',
        });
    }
    const integrationData = Object.assign(Object.assign({}, integration), { scriptEngine: (_f = integration.scriptEngine) !== null && _f !== void 0 ? _f : 'isolated-vm', type: 'webhook-incoming', channel: channels, overrideDestinationChannelEnabled: (_g = integration.overrideDestinationChannelEnabled) !== null && _g !== void 0 ? _g : false, token: random_1.Random.id(48), userId: user._id, _createdAt: new Date(), _createdBy: yield models_1.Users.findOne({ _id: userId }, { projection: { username: 1 } }) });
    // Only compile the script if it is enabled and using a sandbox that is not frozen
    if (!(0, validateScriptEngine_1.isScriptEngineFrozen)(integrationData.scriptEngine) &&
        integration.scriptEnabled === true &&
        integration.script &&
        integration.script.trim() !== '') {
        try {
            let babelOptions = babel_compiler_1.Babel.getDefaultOptions({ runtime: false });
            babelOptions = underscore_1.default.extend(babelOptions, { compact: true, minified: true, comments: false });
            integrationData.scriptCompiled = babel_compiler_1.Babel.compile(integration.script, babelOptions).code;
            integrationData.scriptError = undefined;
        }
        catch (e) {
            integrationData.scriptCompiled = undefined;
            integrationData.scriptError = e instanceof Error ? underscore_1.default.pick(e, 'name', 'message', 'stack') : undefined;
        }
    }
    try {
        for (var _h = true, channels_1 = __asyncValues(channels), channels_1_1; channels_1_1 = yield channels_1.next(), _a = channels_1_1.done, !_a; _h = true) {
            _c = channels_1_1.value;
            _h = false;
            let channel = _c;
            let record;
            const channelType = channel[0];
            channel = channel.substr(1);
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
                    method: 'addIncomingIntegration',
                });
            }
            if (!(yield (0, hasPermission_1.hasAllPermissionAsync)(userId, ['manage-incoming-integrations', 'manage-own-incoming-integrations'])) &&
                !(yield models_1.Subscriptions.findOneByRoomIdAndUserId(record._id, userId, { projection: { _id: 1 } }))) {
                throw new meteor_1.Meteor.Error('error-invalid-channel', 'Invalid Channel', {
                    method: 'addIncomingIntegration',
                });
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_h && !_a && (_b = channels_1.return)) yield _b.call(channels_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    yield models_1.Roles.addUserRoles(user._id, ['bot']);
    const { insertedId } = yield models_1.Integrations.insertOne(integrationData);
    if (insertedId) {
        void (0, notifyListener_1.notifyOnIntegrationChanged)(Object.assign(Object.assign({}, integrationData), { _id: insertedId }), 'inserted');
    }
    integrationData._id = insertedId;
    return integrationData;
});
exports.addIncomingIntegration = addIncomingIntegration;
meteor_1.Meteor.methods({
    addIncomingIntegration(integration) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = this;
            if (!userId) {
                throw new meteor_1.Meteor.Error('invalid-user', 'Invalid User', {
                    method: 'addIncomingIntegration',
                });
            }
            return (0, exports.addIncomingIntegration)(userId, integration);
        });
    },
});
