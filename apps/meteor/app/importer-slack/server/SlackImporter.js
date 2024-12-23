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
exports.SlackImporter = void 0;
const models_1 = require("@rocket.chat/models");
const server_1 = require("../../importer/server");
const notifyListener_1 = require("../../lib/server/lib/notifyListener");
const MentionsParser_1 = require("../../mentions/lib/MentionsParser");
const server_2 = require("../../settings/server");
const getUserAvatarURL_1 = require("../../utils/server/getUserAvatarURL");
class SlackImporter extends server_1.Importer {
    constructor() {
        super(...arguments);
        this._useUpsert = false;
    }
    prepareChannelsFile(entry) {
        const _super = Object.create(null, {
            updateProgress: { get: () => super.updateProgress }
        });
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            var _d, _e;
            yield _super.updateProgress.call(this, server_1.ProgressStep.PREPARING_CHANNELS);
            const data = JSON.parse(entry.getData().toString()).filter((channel) => 'creator' in channel && channel.creator != null);
            this.logger.debug(`loaded ${data.length} channels.`);
            yield this.addCountToTotal(data.length);
            try {
                for (var _f = true, data_1 = __asyncValues(data), data_1_1; data_1_1 = yield data_1.next(), _a = data_1_1.done, !_a; _f = true) {
                    _c = data_1_1.value;
                    _f = false;
                    const channel = _c;
                    yield this.converter.addChannel({
                        _id: channel.is_general ? 'general' : undefined,
                        u: {
                            _id: this._replaceSlackUserId(channel.creator),
                        },
                        importIds: [channel.id],
                        name: channel.name,
                        users: this._replaceSlackUserIds(channel.members),
                        t: 'c',
                        topic: ((_d = channel.topic) === null || _d === void 0 ? void 0 : _d.value) || undefined,
                        description: ((_e = channel.purpose) === null || _e === void 0 ? void 0 : _e.value) || undefined,
                        ts: channel.created ? new Date(channel.created * 1000) : undefined,
                        archived: channel.is_archived,
                    });
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_f && !_a && (_b = data_1.return)) yield _b.call(data_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return data.length;
        });
    }
    prepareGroupsFile(entry) {
        const _super = Object.create(null, {
            updateProgress: { get: () => super.updateProgress }
        });
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_2, _b, _c;
            var _d, _e;
            yield _super.updateProgress.call(this, server_1.ProgressStep.PREPARING_CHANNELS);
            const data = JSON.parse(entry.getData().toString()).filter((channel) => 'creator' in channel && channel.creator != null);
            this.logger.debug(`loaded ${data.length} groups.`);
            yield this.addCountToTotal(data.length);
            try {
                for (var _f = true, data_2 = __asyncValues(data), data_2_1; data_2_1 = yield data_2.next(), _a = data_2_1.done, !_a; _f = true) {
                    _c = data_2_1.value;
                    _f = false;
                    const channel = _c;
                    yield this.converter.addChannel({
                        u: {
                            _id: this._replaceSlackUserId(channel.creator),
                        },
                        importIds: [channel.id],
                        name: channel.name,
                        users: this._replaceSlackUserIds(channel.members),
                        t: 'p',
                        topic: ((_d = channel.topic) === null || _d === void 0 ? void 0 : _d.value) || undefined,
                        description: ((_e = channel.purpose) === null || _e === void 0 ? void 0 : _e.value) || undefined,
                        ts: channel.created ? new Date(channel.created * 1000) : undefined,
                        archived: channel.is_archived,
                    });
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (!_f && !_a && (_b = data_2.return)) yield _b.call(data_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return data.length;
        });
    }
    prepareMpimpsFile(entry) {
        const _super = Object.create(null, {
            updateProgress: { get: () => super.updateProgress }
        });
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_3, _b, _c;
            var _d, _e;
            yield _super.updateProgress.call(this, server_1.ProgressStep.PREPARING_CHANNELS);
            const data = JSON.parse(entry.getData().toString()).filter((channel) => 'creator' in channel && channel.creator != null);
            this.logger.debug(`loaded ${data.length} mpims.`);
            yield this.addCountToTotal(data.length);
            const maxUsers = server_2.settings.get('DirectMesssage_maxUsers') || 1;
            try {
                for (var _f = true, data_3 = __asyncValues(data), data_3_1; data_3_1 = yield data_3.next(), _a = data_3_1.done, !_a; _f = true) {
                    _c = data_3_1.value;
                    _f = false;
                    const channel = _c;
                    yield this.converter.addChannel({
                        u: {
                            _id: this._replaceSlackUserId(channel.creator),
                        },
                        importIds: [channel.id],
                        name: channel.name,
                        users: this._replaceSlackUserIds(channel.members),
                        t: channel.members.length > maxUsers ? 'p' : 'd',
                        topic: ((_d = channel.topic) === null || _d === void 0 ? void 0 : _d.value) || undefined,
                        description: ((_e = channel.purpose) === null || _e === void 0 ? void 0 : _e.value) || undefined,
                        ts: channel.created ? new Date(channel.created * 1000) : undefined,
                        archived: channel.is_archived,
                    });
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (!_f && !_a && (_b = data_3.return)) yield _b.call(data_3);
                }
                finally { if (e_3) throw e_3.error; }
            }
            return data.length;
        });
    }
    prepareDMsFile(entry) {
        const _super = Object.create(null, {
            updateProgress: { get: () => super.updateProgress }
        });
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_4, _b, _c;
            yield _super.updateProgress.call(this, server_1.ProgressStep.PREPARING_CHANNELS);
            const data = JSON.parse(entry.getData().toString());
            this.logger.debug(`loaded ${data.length} dms.`);
            yield this.addCountToTotal(data.length);
            try {
                for (var _d = true, data_4 = __asyncValues(data), data_4_1; data_4_1 = yield data_4.next(), _a = data_4_1.done, !_a; _d = true) {
                    _c = data_4_1.value;
                    _d = false;
                    const channel = _c;
                    yield this.converter.addChannel({
                        importIds: [channel.id],
                        users: this._replaceSlackUserIds(channel.members),
                        t: 'd',
                        ts: channel.created ? new Date(channel.created * 1000) : undefined,
                    });
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = data_4.return)) yield _b.call(data_4);
                }
                finally { if (e_4) throw e_4.error; }
            }
            return data.length;
        });
    }
    prepareUsersFile(entry) {
        const _super = Object.create(null, {
            updateProgress: { get: () => super.updateProgress }
        });
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_5, _b, _c;
            yield _super.updateProgress.call(this, server_1.ProgressStep.PREPARING_USERS);
            const data = JSON.parse(entry.getData().toString());
            this.logger.debug(`loaded ${data.length} users.`);
            // Insert the users record
            yield this.updateRecord({ 'count.users': data.length });
            yield this.addCountToTotal(data.length);
            try {
                for (var _d = true, data_5 = __asyncValues(data), data_5_1; data_5_1 = yield data_5.next(), _a = data_5_1.done, !_a; _d = true) {
                    _c = data_5_1.value;
                    _d = false;
                    const user = _c;
                    const newUser = {
                        emails: [],
                        importIds: [user.id],
                        username: user.name,
                        name: user.profile.real_name,
                        utcOffset: user.tz_offset && user.tz_offset / 3600,
                        avatarUrl: user.profile.image_original || user.profile.image_512,
                        deleted: user.deleted,
                        statusText: user.profile.status_text || undefined,
                        bio: user.profile.title || undefined,
                        type: 'user',
                    };
                    if (user.profile.email) {
                        newUser.emails.push(user.profile.email);
                    }
                    if (user.is_bot) {
                        newUser.roles = ['bot'];
                        newUser.type = 'bot';
                    }
                    yield this.converter.addUser(newUser);
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = data_5.return)) yield _b.call(data_5);
                }
                finally { if (e_5) throw e_5.error; }
            }
            return data.length;
        });
    }
    prepareUsingLocalFile(fullFilePath) {
        const _super = Object.create(null, {
            updateProgress: { get: () => super.updateProgress }
        });
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_6, _b, _c, _d, e_7, _e, _f, _g, e_8, _h, _j;
            this.logger.debug('start preparing import operation');
            yield this.converter.clearImportData();
            const zip = new this.AdmZip(fullFilePath);
            const totalEntries = zip.getEntryCount();
            let userCount = 0;
            let messagesCount = 0;
            let channelCount = 0;
            let count = 0;
            server_1.ImporterWebsocket.progressUpdated({ rate: 0 });
            let oldRate = 0;
            const increaseProgress = () => {
                try {
                    count++;
                    const rate = Math.floor((count * 1000) / totalEntries) / 10;
                    if (rate > oldRate) {
                        server_1.ImporterWebsocket.progressUpdated({ rate });
                        oldRate = rate;
                    }
                }
                catch (e) {
                    this.logger.error(e);
                }
            };
            try {
                try {
                    // we need to iterate the zip file twice so that all channels are loaded before the messages
                    for (var _k = true, _l = __asyncValues(zip.getEntries()), _m; _m = yield _l.next(), _a = _m.done, !_a; _k = true) {
                        _c = _m.value;
                        _k = false;
                        const entry = _c;
                        try {
                            if (entry.entryName === 'channels.json') {
                                channelCount += yield this.prepareChannelsFile(entry);
                                yield this.updateRecord({ 'count.channels': channelCount });
                                increaseProgress();
                                continue;
                            }
                            if (entry.entryName === 'groups.json') {
                                channelCount += yield this.prepareGroupsFile(entry);
                                yield this.updateRecord({ 'count.channels': channelCount });
                                increaseProgress();
                                continue;
                            }
                            if (entry.entryName === 'mpims.json') {
                                channelCount += yield this.prepareMpimpsFile(entry);
                                yield this.updateRecord({ 'count.channels': channelCount });
                                increaseProgress();
                                continue;
                            }
                            if (entry.entryName === 'dms.json') {
                                channelCount += yield this.prepareDMsFile(entry);
                                yield this.updateRecord({ 'count.channels': channelCount });
                                increaseProgress();
                                continue;
                            }
                            if (entry.entryName === 'users.json') {
                                userCount = yield this.prepareUsersFile(entry);
                                increaseProgress();
                                continue;
                            }
                        }
                        catch (e) {
                            this.logger.error(e);
                        }
                    }
                }
                catch (e_6_1) { e_6 = { error: e_6_1 }; }
                finally {
                    try {
                        if (!_k && !_a && (_b = _l.return)) yield _b.call(_l);
                    }
                    finally { if (e_6) throw e_6.error; }
                }
                if (userCount) {
                    const { value } = yield models_1.Settings.incrementValueById('Slack_Importer_Count', userCount, { returnDocument: 'after' });
                    if (value) {
                        void (0, notifyListener_1.notifyOnSettingChanged)(value);
                    }
                }
                const missedTypes = {};
                // If we have no slack message yet, then we can insert them instead of upserting
                this._useUpsert = !(yield models_1.Messages.findOne({ _id: /slack\-.*/ }));
                try {
                    for (var _o = true, _p = __asyncValues(zip.getEntries()), _q; _q = yield _p.next(), _d = _q.done, !_d; _o = true) {
                        _f = _q.value;
                        _o = false;
                        const entry = _f;
                        try {
                            if (entry.entryName.includes('__MACOSX') || entry.entryName.includes('.DS_Store')) {
                                count++;
                                this.logger.debug(`Ignoring the file: ${entry.entryName}`);
                                continue;
                            }
                            if (['channels.json', 'groups.json', 'mpims.json', 'dms.json', 'users.json'].includes(entry.entryName)) {
                                continue;
                            }
                            if (!entry.isDirectory && entry.entryName.includes('/')) {
                                const item = entry.entryName.split('/');
                                const channel = item[0];
                                const date = item[1].split('.')[0];
                                try {
                                    // Insert the messages records
                                    if (this.progress.step !== server_1.ProgressStep.PREPARING_MESSAGES) {
                                        yield _super.updateProgress.call(this, server_1.ProgressStep.PREPARING_MESSAGES);
                                    }
                                    const tempMessages = JSON.parse(entry.getData().toString());
                                    messagesCount += tempMessages.length;
                                    yield this.updateRecord({ messagesstatus: `${channel}/${date}` });
                                    yield this.addCountToTotal(tempMessages.length);
                                    const slackChannelId = yield models_1.ImportData.findChannelImportIdByNameOrImportId(channel);
                                    if (slackChannelId) {
                                        try {
                                            for (var _r = true, tempMessages_1 = (e_8 = void 0, __asyncValues(tempMessages)), tempMessages_1_1; tempMessages_1_1 = yield tempMessages_1.next(), _g = tempMessages_1_1.done, !_g; _r = true) {
                                                _j = tempMessages_1_1.value;
                                                _r = false;
                                                const message = _j;
                                                yield this.prepareMessageObject(message, missedTypes, slackChannelId);
                                            }
                                        }
                                        catch (e_8_1) { e_8 = { error: e_8_1 }; }
                                        finally {
                                            try {
                                                if (!_r && !_g && (_h = tempMessages_1.return)) yield _h.call(tempMessages_1);
                                            }
                                            finally { if (e_8) throw e_8.error; }
                                        }
                                    }
                                }
                                catch (error) {
                                    this.logger.warn(`${entry.entryName} is not a valid JSON file! Unable to import it.`);
                                }
                            }
                        }
                        catch (e) {
                            this.logger.error(e);
                        }
                        increaseProgress();
                    }
                }
                catch (e_7_1) { e_7 = { error: e_7_1 }; }
                finally {
                    try {
                        if (!_o && !_d && (_e = _p.return)) yield _e.call(_p);
                    }
                    finally { if (e_7) throw e_7.error; }
                }
                if (Object.keys(missedTypes).length > 0) {
                    this.logger.info('Missed import types:', missedTypes);
                }
            }
            catch (e) {
                this.logger.error(e);
                throw e;
            }
            server_1.ImporterWebsocket.progressUpdated({ rate: 100 });
            yield this.updateRecord({ 'count.messages': messagesCount, 'messagesstatus': null });
            return this.progress;
        });
    }
    parseMentions(newMessage) {
        const mentionsParser = new MentionsParser_1.MentionsParser({
            pattern: () => '[0-9a-zA-Z]+',
            useRealName: () => server_2.settings.get('UI_Use_Real_Name'),
            me: () => 'me',
        });
        const users = mentionsParser
            .getUserMentions(newMessage.msg)
            .filter((u) => u)
            .map((uid) => this._replaceSlackUserId(uid.slice(1, uid.length)));
        if (users.length) {
            if (!newMessage.mentions) {
                newMessage.mentions = [];
            }
            newMessage.mentions.push(...users);
        }
        const channels = mentionsParser
            .getChannelMentions(newMessage.msg)
            .filter((c) => c)
            .map((name) => name.slice(1, name.length));
        if (channels.length) {
            if (!newMessage.channels) {
                newMessage.channels = [];
            }
            newMessage.channels.push(...channels);
        }
    }
    processMessageSubType(message, slackChannelId, newMessage, missedTypes) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const ignoreTypes = { bot_add: true, file_comment: true, file_mention: true };
            switch (message.subtype) {
                case 'channel_join':
                case 'group_join':
                    newMessage.t = 'uj';
                    newMessage.groupable = false;
                    return true;
                case 'channel_leave':
                case 'group_leave':
                    newMessage.t = 'ul';
                    newMessage.groupable = false;
                    return true;
                case 'channel_purpose':
                case 'group_purpose':
                    newMessage.t = 'room_changed_description';
                    newMessage.groupable = false;
                    newMessage.msg = message.purpose;
                    return true;
                case 'channel_topic':
                case 'group_topic':
                    newMessage.t = 'room_changed_topic';
                    newMessage.groupable = false;
                    newMessage.msg = message.topic;
                    return true;
                case 'channel_name':
                case 'group_name':
                    newMessage.t = 'r';
                    newMessage.msg = message.name;
                    newMessage.groupable = false;
                    return true;
                case 'pinned_item':
                    if (message.attachments) {
                        if (!newMessage.attachments) {
                            newMessage.attachments = [];
                        }
                        newMessage.attachments.push({
                            text: this.convertSlackMessageToRocketChat(message.attachments[0].text),
                            author_name: message.attachments[0].author_subname,
                            author_icon: (0, getUserAvatarURL_1.getUserAvatarURL)(message.attachments[0].author_subname),
                        });
                        newMessage.t = 'message_pinned';
                    }
                    break;
                case 'file_share':
                    if ((_a = message.file) === null || _a === void 0 ? void 0 : _a.url_private_download) {
                        const fileId = this.makeSlackMessageId(slackChannelId, message.ts, 'share');
                        const fileMessage = {
                            _id: fileId,
                            rid: newMessage.rid,
                            ts: newMessage.ts,
                            msg: message.file.url_private_download || '',
                            _importFile: this.convertSlackFileToPendingFile(message.file),
                            u: {
                                _id: newMessage.u._id,
                            },
                        };
                        if (message.thread_ts && message.thread_ts !== message.ts) {
                            fileMessage.tmid = this.makeSlackMessageId(slackChannelId, message.thread_ts);
                        }
                        yield this.converter.addMessage(fileMessage, this._useUpsert);
                    }
                    break;
                default:
                    if (!missedTypes[message.subtype] && !ignoreTypes[message.subtype]) {
                        missedTypes[message.subtype] = message;
                    }
                    break;
            }
            return false;
        });
    }
    makeSlackMessageId(channelId, ts, fileIndex) {
        const base = `slack-${channelId}-${ts.replace(/\./g, '-')}`;
        if (fileIndex) {
            return `${base}-file${fileIndex}`;
        }
        return base;
    }
    prepareMessageObject(message, missedTypes, slackChannelId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const id = this.makeSlackMessageId(slackChannelId, message.ts);
            const newMessage = {
                _id: id,
                rid: slackChannelId,
                ts: new Date(parseInt(message.ts.split('.')[0]) * 1000),
                msg: '',
                u: {
                    _id: this._replaceSlackUserId(message.user),
                },
            };
            // Process the reactions
            if (message.reactions && message.reactions.length > 0) {
                newMessage.reactions = message.reactions.reduce((newReactions, reaction) => {
                    var _a;
                    const name = `:${reaction.name}:`;
                    return Object.assign(Object.assign({}, newReactions), (((_a = reaction.users) === null || _a === void 0 ? void 0 : _a.length) ? { name: { name, users: this._replaceSlackUserIds(reaction.users) } } : {}));
                }, {});
            }
            if (message.type === 'message') {
                if (message.files) {
                    let fileIndex = 0;
                    const promises = message.files.map((file) => __awaiter(this, void 0, void 0, function* () {
                        fileIndex++;
                        const fileId = this.makeSlackMessageId(slackChannelId, message.ts, String(fileIndex));
                        const fileMessage = {
                            _id: fileId,
                            rid: slackChannelId,
                            ts: newMessage.ts,
                            msg: file.url_private_download || '',
                            _importFile: this.convertSlackFileToPendingFile(file),
                            u: {
                                _id: this._replaceSlackUserId(message.user),
                            },
                        };
                        if (message.thread_ts && message.thread_ts !== message.ts) {
                            fileMessage.tmid = this.makeSlackMessageId(slackChannelId, message.thread_ts);
                        }
                        yield this.converter.addMessage(fileMessage, this._useUpsert);
                    }));
                    yield Promise.all(promises);
                }
                const regularTypes = ['me_message', 'thread_broadcast'];
                const isBotMessage = message.subtype && ['bot_message', 'slackbot_response'].includes(message.subtype);
                if (message.subtype && !regularTypes.includes(message.subtype) && !isBotMessage) {
                    if (yield this.processMessageSubType(message, slackChannelId, newMessage, missedTypes)) {
                        yield this.converter.addMessage(newMessage, this._useUpsert);
                    }
                }
                else {
                    const text = this.convertSlackMessageToRocketChat(message.text);
                    if (isBotMessage) {
                        newMessage.bot = true;
                    }
                    if (message.subtype === 'me_message') {
                        newMessage.msg = `_${text}_`;
                    }
                    else {
                        newMessage.msg = text;
                    }
                    if (message.thread_ts) {
                        if (message.thread_ts === message.ts) {
                            if (message.reply_users) {
                                const replies = new Set();
                                message.reply_users.forEach((item) => {
                                    replies.add(this._replaceSlackUserId(item));
                                });
                                if (replies.size) {
                                    newMessage.replies = Array.from(replies);
                                }
                            }
                            else if (message.replies) {
                                const replies = new Set();
                                message.replies.forEach((item) => {
                                    replies.add(this._replaceSlackUserId(item.user));
                                });
                                if (replies.size) {
                                    newMessage.replies = Array.from(replies);
                                }
                            }
                            else {
                                this.logger.warn(`Failed to import the parent comment, message: ${newMessage._id}. Missing replies/reply_users field`);
                            }
                            newMessage.tcount = message.reply_count;
                            newMessage.tlm = new Date(parseInt(message.latest_reply.split('.')[0]) * 1000);
                        }
                        else {
                            newMessage.tmid = this.makeSlackMessageId(slackChannelId, message.thread_ts);
                        }
                    }
                    if (message.edited) {
                        newMessage.editedAt = new Date(parseInt(message.edited.ts.split('.')[0]) * 1000);
                        if (message.edited.user) {
                            newMessage.editedBy = this._replaceSlackUserId(message.edited.user);
                        }
                    }
                    if (message.attachments) {
                        newMessage.attachments = this.convertMessageAttachments(message.attachments);
                    }
                    if ((_a = message.icons) === null || _a === void 0 ? void 0 : _a.emoji) {
                        newMessage.emoji = message.icons.emoji;
                    }
                    this.parseMentions(newMessage);
                    yield this.converter.addMessage(newMessage, this._useUpsert);
                }
            }
        });
    }
    _replaceSlackUserId(userId) {
        if (userId === 'USLACKBOT') {
            return 'rocket.cat';
        }
        return userId;
    }
    _replaceSlackUserIds(members) {
        if (!(members === null || members === void 0 ? void 0 : members.length)) {
            return [];
        }
        return members.map((userId) => this._replaceSlackUserId(userId));
    }
    convertSlackMessageToRocketChat(message) {
        if (message) {
            message = message.replace(/<!everyone>/g, '@all');
            message = message.replace(/<!channel>/g, '@all');
            message = message.replace(/<!here>/g, '@here');
            message = message.replace(/&gt;/g, '>');
            message = message.replace(/&lt;/g, '<');
            message = message.replace(/&amp;/g, '&');
            message = message.replace(/:simple_smile:/g, ':smile:');
            message = message.replace(/:memo:/g, ':pencil:');
            message = message.replace(/:piggy:/g, ':pig:');
            message = message.replace(/:uk:/g, ':gb:');
            message = message.replace(/<(http[s]?:[^>|]*)>/g, '$1');
            message = message.replace(/<(http[s]?:[^|]*)\|([^>]*)>/g, '[$2]($1)');
            message = message.replace(/<#([^|]*)\|([^>]*)>/g, '#$2');
            message = message.replace(/<@([^|]*)\|([^>]*)>/g, '@$1');
            message = message.replace(/<@([^|>]*)>/g, '@$1');
        }
        else {
            message = '';
        }
        return message;
    }
    convertSlackFileToPendingFile(file) {
        return {
            downloadUrl: file.url_private_download,
            id: file.id,
            size: file.size,
            name: file.name,
            external: file.is_external,
            source: 'slack',
            original: Object.assign({}, file),
        };
    }
    convertMessageAttachments(attachments) {
        if (!(attachments === null || attachments === void 0 ? void 0 : attachments.length)) {
            return undefined;
        }
        return attachments.map((attachment) => (Object.assign(Object.assign({}, attachment), { text: this.convertSlackMessageToRocketChat(attachment.text), title: this.convertSlackMessageToRocketChat(attachment.title), fallback: this.convertSlackMessageToRocketChat(attachment.fallback) })));
    }
}
exports.SlackImporter = SlackImporter;
