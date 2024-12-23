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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateOutgoingIntegration = void 0;
const models_1 = require("@rocket.chat/models");
const tools_1 = require("@rocket.chat/tools");
const babel_compiler_1 = require("meteor/babel-compiler");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const validateScriptEngine_1 = require("./validateScriptEngine");
const parseCSV_1 = require("../../../../lib/utils/parseCSV");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const outgoingEvents_1 = require("../../lib/outgoingEvents");
const scopedChannels = ['all_public_channels', 'all_private_groups', 'all_direct_messages'];
const validChannelChars = ['@', '#'];
function _verifyRequiredFields(integration) {
    if (!integration.event ||
        !check_1.Match.test(integration.event, String) ||
        integration.event.trim() === '' ||
        !outgoingEvents_1.outgoingEvents[integration.event]) {
        throw new meteor_1.Meteor.Error('error-invalid-event-type', 'Invalid event type', {
            function: 'validateOutgoing._verifyRequiredFields',
        });
    }
    if (!integration.username || !check_1.Match.test(integration.username, String) || integration.username.trim() === '') {
        throw new meteor_1.Meteor.Error('error-invalid-username', 'Invalid username', {
            function: 'validateOutgoing._verifyRequiredFields',
        });
    }
    if (outgoingEvents_1.outgoingEvents[integration.event].use.targetRoom && !integration.targetRoom) {
        throw new meteor_1.Meteor.Error('error-invalid-targetRoom', 'Invalid Target Room', {
            function: 'validateOutgoing._verifyRequiredFields',
        });
    }
    if (!check_1.Match.test(integration.urls, [String])) {
        throw new meteor_1.Meteor.Error('error-invalid-urls', 'Invalid URLs', {
            function: 'validateOutgoing._verifyRequiredFields',
        });
    }
    integration.urls = integration.urls.filter((url) => url && url.trim() !== '');
    if (integration.urls.length === 0) {
        throw new meteor_1.Meteor.Error('error-invalid-urls', 'Invalid URLs', {
            function: 'validateOutgoing._verifyRequiredFields',
        });
    }
}
function _verifyUserHasPermissionForChannels(userId, channels) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, channels_1, channels_1_1;
        var _b, e_1, _c, _d;
        try {
            for (_a = true, channels_1 = __asyncValues(channels); channels_1_1 = yield channels_1.next(), _b = channels_1_1.done, !_b; _a = true) {
                _d = channels_1_1.value;
                _a = false;
                let channel = _d;
                if (scopedChannels.includes(channel)) {
                    if (channel === 'all_public_channels') {
                        // No special permissions needed to add integration to public channels
                    }
                    else if (!(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'manage-outgoing-integrations'))) {
                        throw new meteor_1.Meteor.Error('error-invalid-channel', 'Invalid Channel', {
                            function: 'validateOutgoing._verifyUserHasPermissionForChannels',
                        });
                    }
                }
                else {
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
                            function: 'validateOutgoing._verifyUserHasPermissionForChannels',
                        });
                    }
                    if (!(yield (0, hasPermission_1.hasAllPermissionAsync)(userId, ['manage-outgoing-integrations', 'manage-own-outgoing-integrations'])) &&
                        !(yield models_1.Subscriptions.findOneByRoomIdAndUserId(record._id, userId, { projection: { _id: 1 } }))) {
                        throw new meteor_1.Meteor.Error('error-invalid-channel', 'Invalid Channel', {
                            function: 'validateOutgoing._verifyUserHasPermissionForChannels',
                        });
                    }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_a && !_b && (_c = channels_1.return)) yield _c.call(channels_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    });
}
function _verifyRetryInformation(integration) {
    var _a;
    if (!integration.retryFailedCalls) {
        return;
    }
    // Don't allow negative retry counts
    integration.retryCount =
        integration.retryCount && parseInt(String(integration.retryCount)) > 0 ? parseInt(String(integration.retryCount)) : 4;
    integration.retryDelay = !((_a = integration.retryDelay) === null || _a === void 0 ? void 0 : _a.trim()) ? 'powers-of-ten' : integration.retryDelay.toLowerCase();
}
const validateOutgoingIntegration = function (integration, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (integration.channel && check_1.Match.test(integration.channel, String) && integration.channel.trim() === '') {
            delete integration.channel;
        }
        // Moved to it's own function to satisfy the complexity rule
        _verifyRequiredFields(integration);
        let channels = [];
        if (outgoingEvents_1.outgoingEvents[integration.event].use.channel) {
            if (!check_1.Match.test(integration.channel, String)) {
                throw new meteor_1.Meteor.Error('error-invalid-channel', 'Invalid Channel', {
                    function: 'validateOutgoing',
                });
            }
            else {
                channels = (0, parseCSV_1.parseCSV)(integration.channel);
                for (const channel of channels) {
                    if (!validChannelChars.includes(channel[0]) && !scopedChannels.includes(channel.toLowerCase())) {
                        throw new meteor_1.Meteor.Error('error-invalid-channel-start-with-chars', 'Invalid channel. Start with @ or #', {
                            function: 'validateOutgoing',
                        });
                    }
                }
            }
        }
        else if (!(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'manage-outgoing-integrations'))) {
            throw new meteor_1.Meteor.Error('error-invalid-permissions', 'Invalid permission for required Integration creation.', {
                function: 'validateOutgoing',
            });
        }
        const user = yield models_1.Users.findOne({ username: integration.username });
        if (!user) {
            throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user (did you delete the `rocket.cat` user?)', { function: 'validateOutgoing' });
        }
        const integrationData = Object.assign(Object.assign({}, integration), { scriptEngine: (_a = integration.scriptEngine) !== null && _a !== void 0 ? _a : 'isolated-vm', type: 'webhook-outgoing', channel: channels, userId: user._id, _createdAt: new Date(), _createdBy: yield models_1.Users.findOne(userId, { projection: { username: 1 } }) });
        if (outgoingEvents_1.outgoingEvents[integration.event].use.triggerWords && integration.triggerWords) {
            if (!check_1.Match.test(integration.triggerWords, [String])) {
                throw new meteor_1.Meteor.Error('error-invalid-triggerWords', 'Invalid triggerWords', {
                    function: 'validateOutgoing',
                });
            }
            integrationData.triggerWords = integration.triggerWords.filter((word) => word && word.trim() !== '');
        }
        else {
            delete integrationData.triggerWords;
        }
        // Only compile the script if it is enabled and using a sandbox that is not frozen
        if (!(0, validateScriptEngine_1.isScriptEngineFrozen)(integrationData.scriptEngine) &&
            integration.scriptEnabled === true &&
            integration.script &&
            integration.script.trim() !== '') {
            try {
                const babelOptions = Object.assign(babel_compiler_1.Babel.getDefaultOptions({ runtime: false }), {
                    compact: true,
                    minified: true,
                    comments: false,
                });
                integrationData.scriptCompiled = babel_compiler_1.Babel.compile(integration.script, babelOptions).code;
                integrationData.scriptError = undefined;
            }
            catch (e) {
                integrationData.scriptCompiled = undefined;
                integrationData.scriptError = e instanceof Error ? (0, tools_1.pick)(e, 'name', 'message', 'stack') : undefined;
            }
        }
        if (typeof integration.runOnEdits !== 'undefined') {
            // Verify this value is only true/false
            integrationData.runOnEdits = integration.runOnEdits === true;
        }
        yield _verifyUserHasPermissionForChannels(userId, channels);
        _verifyRetryInformation(integrationData);
        return integrationData;
    });
};
exports.validateOutgoingIntegration = validateOutgoingIntegration;
