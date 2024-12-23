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
exports.CsvImporter = void 0;
const models_1 = require("@rocket.chat/models");
const random_1 = require("@rocket.chat/random");
const sync_1 = require("csv-parse/lib/sync");
const server_1 = require("../../importer/server");
const addParsedContacts_1 = require("../../importer-omnichannel-contacts/server/addParsedContacts");
const notifyListener_1 = require("../../lib/server/lib/notifyListener");
class CsvImporter extends server_1.Importer {
    constructor(info, importRecord, converterOptions = {}) {
        super(info, importRecord, converterOptions);
        this.csvParser = sync_1.parse;
    }
    prepareUsingLocalFile(fullFilePath) {
        const _super = Object.create(null, {
            updateProgress: { get: () => super.updateProgress },
            updateRecord: { get: () => super.updateRecord },
            addCountToTotal: { get: () => super.addCountToTotal },
            getProgress: { get: () => super.getProgress }
        });
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c, _d, e_2, _e, _f, _g, e_3, _h, _j, _k, e_4, _l, _m, _o, e_5, _p, _q, _r, e_6, _s, _t;
            var _u;
            this.logger.debug('start preparing import operation');
            yield this.converter.clearImportData();
            const zip = new this.AdmZip(fullFilePath);
            const totalEntries = zip.getEntryCount();
            server_1.ImporterWebsocket.progressUpdated({ rate: 0 });
            let count = 0;
            let oldRate = 0;
            const increaseProgressCount = () => {
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
            let messagesCount = 0;
            let usersCount = 0;
            let channelsCount = 0;
            let contactsCount = 0;
            const dmRooms = new Set();
            const roomIds = new Map();
            const usedUsernames = new Set();
            const availableUsernames = new Set();
            const getRoomId = (roomName) => {
                const roomId = roomIds.get(roomName);
                if (roomId === undefined) {
                    const fallbackRoomId = random_1.Random.id();
                    roomIds.set(roomName, fallbackRoomId);
                    return fallbackRoomId;
                }
                return roomId;
            };
            try {
                for (var _v = true, _w = __asyncValues(zip.getEntries()), _x; _x = yield _w.next(), _a = _x.done, !_a; _v = true) {
                    _c = _x.value;
                    _v = false;
                    const entry = _c;
                    this.logger.debug(`Entry: ${entry.entryName}`);
                    // Ignore anything that has `__MACOSX` in it's name, as sadly these things seem to mess everything up
                    if (entry.entryName.indexOf('__MACOSX') > -1) {
                        this.logger.debug(`Ignoring the file: ${entry.entryName}`);
                        increaseProgressCount();
                        continue;
                    }
                    // Directories are ignored, since they are "virtual" in a zip file
                    if (entry.isDirectory) {
                        this.logger.debug(`Ignoring the directory entry: ${entry.entryName}`);
                        increaseProgressCount();
                        continue;
                    }
                    // Parse the channels
                    if (entry.entryName.toLowerCase() === 'channels.csv') {
                        yield _super.updateProgress.call(this, server_1.ProgressStep.PREPARING_CHANNELS);
                        const parsedChannels = this.csvParser(entry.getData().toString());
                        channelsCount = parsedChannels.length;
                        try {
                            for (var _y = true, parsedChannels_1 = (e_2 = void 0, __asyncValues(parsedChannels)), parsedChannels_1_1; parsedChannels_1_1 = yield parsedChannels_1.next(), _d = parsedChannels_1_1.done, !_d; _y = true) {
                                _f = parsedChannels_1_1.value;
                                _y = false;
                                const c = _f;
                                const name = c[0].trim();
                                const id = getRoomId(name);
                                const creator = c[1].trim();
                                const isPrivate = c[2].trim().toLowerCase() === 'private';
                                const members = c[3]
                                    .trim()
                                    .split(';')
                                    .map((m) => m.trim())
                                    .filter((m) => m);
                                yield this.converter.addChannel({
                                    importIds: [id],
                                    u: {
                                        _id: creator,
                                    },
                                    name,
                                    users: members,
                                    t: isPrivate ? 'p' : 'c',
                                });
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (!_y && !_d && (_e = parsedChannels_1.return)) yield _e.call(parsedChannels_1);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                        yield _super.updateRecord.call(this, { 'count.channels': channelsCount });
                        increaseProgressCount();
                        continue;
                    }
                    // Parse the users
                    if (entry.entryName.toLowerCase() === 'users.csv') {
                        yield _super.updateProgress.call(this, server_1.ProgressStep.PREPARING_USERS);
                        const parsedUsers = this.csvParser(entry.getData().toString());
                        usersCount = parsedUsers.length;
                        try {
                            for (var _z = true, parsedUsers_1 = (e_3 = void 0, __asyncValues(parsedUsers)), parsedUsers_1_1; parsedUsers_1_1 = yield parsedUsers_1.next(), _g = parsedUsers_1_1.done, !_g; _z = true) {
                                _j = parsedUsers_1_1.value;
                                _z = false;
                                const u = _j;
                                const username = u[0].trim();
                                availableUsernames.add(username);
                                const email = u[1].trim();
                                const name = u[2].trim();
                                yield this.converter.addUser({
                                    type: 'user',
                                    importIds: [username],
                                    emails: [email],
                                    username,
                                    name,
                                });
                            }
                        }
                        catch (e_3_1) { e_3 = { error: e_3_1 }; }
                        finally {
                            try {
                                if (!_z && !_g && (_h = parsedUsers_1.return)) yield _h.call(parsedUsers_1);
                            }
                            finally { if (e_3) throw e_3.error; }
                        }
                        yield _super.updateRecord.call(this, { 'count.users': usersCount });
                        increaseProgressCount();
                        continue;
                    }
                    // Parse the contacts
                    if (entry.entryName.toLowerCase() === 'contacts.csv') {
                        yield _super.updateProgress.call(this, server_1.ProgressStep.PREPARING_CONTACTS);
                        const parsedContacts = this.csvParser(entry.getData().toString());
                        contactsCount = yield addParsedContacts_1.addParsedContacts.call(this.converter, parsedContacts);
                        yield _super.updateRecord.call(this, { 'count.contacts': contactsCount });
                        increaseProgressCount();
                        continue;
                    }
                    // Parse the messages
                    if (entry.entryName.indexOf('/') > -1) {
                        if (this.progress.step !== server_1.ProgressStep.PREPARING_MESSAGES) {
                            yield _super.updateProgress.call(this, server_1.ProgressStep.PREPARING_MESSAGES);
                        }
                        const item = entry.entryName.split('/'); // random/messages.csv
                        const folderName = item[0]; // random
                        let msgs = [];
                        try {
                            msgs = this.csvParser(entry.getData().toString());
                        }
                        catch (e) {
                            this.logger.warn(`The file ${entry.entryName} contains invalid syntax`, e);
                            increaseProgressCount();
                            continue;
                        }
                        let data;
                        const msgGroupData = item[1].split('.')[0]; // messages
                        let isDirect = false;
                        if (folderName.toLowerCase() === 'directmessages') {
                            isDirect = true;
                            data = msgs.map((m) => ({
                                username: m[0],
                                ts: m[2],
                                text: m[3],
                                otherUsername: m[1],
                                isDirect: true,
                            }));
                        }
                        else {
                            data = msgs.map((m) => ({ username: m[0], ts: m[1], text: m[2] }));
                        }
                        messagesCount += data.length;
                        const channelName = `${folderName}/${msgGroupData}`;
                        yield _super.updateRecord.call(this, { messagesstatus: channelName });
                        if (isDirect) {
                            try {
                                for (var _0 = true, data_1 = (e_4 = void 0, __asyncValues(data)), data_1_1; data_1_1 = yield data_1.next(), _k = data_1_1.done, !_k; _0 = true) {
                                    _m = data_1_1.value;
                                    _0 = false;
                                    const msg = _m;
                                    if (!msg.otherUsername) {
                                        continue;
                                    }
                                    const sourceId = [msg.username, msg.otherUsername].sort().join('/');
                                    if (!dmRooms.has(sourceId)) {
                                        yield this.converter.addChannel({
                                            importIds: [sourceId],
                                            users: [msg.username, msg.otherUsername],
                                            t: 'd',
                                        });
                                        dmRooms.add(sourceId);
                                    }
                                    const newMessage = {
                                        rid: sourceId,
                                        u: {
                                            _id: msg.username,
                                        },
                                        ts: new Date(parseInt(msg.ts)),
                                        msg: msg.text,
                                    };
                                    usedUsernames.add(msg.username);
                                    usedUsernames.add(msg.otherUsername);
                                    yield this.converter.addMessage(newMessage);
                                }
                            }
                            catch (e_4_1) { e_4 = { error: e_4_1 }; }
                            finally {
                                try {
                                    if (!_0 && !_k && (_l = data_1.return)) yield _l.call(data_1);
                                }
                                finally { if (e_4) throw e_4.error; }
                            }
                        }
                        else {
                            const rid = getRoomId(folderName);
                            try {
                                for (var _1 = true, data_2 = (e_5 = void 0, __asyncValues(data)), data_2_1; data_2_1 = yield data_2.next(), _o = data_2_1.done, !_o; _1 = true) {
                                    _q = data_2_1.value;
                                    _1 = false;
                                    const msg = _q;
                                    const newMessage = {
                                        rid,
                                        u: {
                                            _id: msg.username,
                                        },
                                        ts: new Date(parseInt(msg.ts)),
                                        msg: msg.text,
                                    };
                                    usedUsernames.add(msg.username);
                                    yield this.converter.addMessage(newMessage);
                                }
                            }
                            catch (e_5_1) { e_5 = { error: e_5_1 }; }
                            finally {
                                try {
                                    if (!_1 && !_o && (_p = data_2.return)) yield _p.call(data_2);
                                }
                                finally { if (e_5) throw e_5.error; }
                            }
                        }
                        yield _super.updateRecord.call(this, { 'count.messages': messagesCount, 'messagesstatus': null });
                    }
                    increaseProgressCount();
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_v && !_a && (_b = _w.return)) yield _b.call(_w);
                }
                finally { if (e_1) throw e_1.error; }
            }
            if (usersCount) {
                const { value } = yield models_1.Settings.incrementValueById('CSV_Importer_Count', usersCount, { returnDocument: 'after' });
                if (value) {
                    void (0, notifyListener_1.notifyOnSettingChanged)(value);
                }
            }
            try {
                // Check if any of the message usernames was not in the imported list of users
                for (var _2 = true, usedUsernames_1 = __asyncValues(usedUsernames), usedUsernames_1_1; usedUsernames_1_1 = yield usedUsernames_1.next(), _r = usedUsernames_1_1.done, !_r; _2 = true) {
                    _t = usedUsernames_1_1.value;
                    _2 = false;
                    const username = _t;
                    if (availableUsernames.has(username)) {
                        continue;
                    }
                    // Check if an user with that username already exists
                    const user = yield models_1.Users.findOneByUsername(username);
                    if (user && !((_u = user.importIds) === null || _u === void 0 ? void 0 : _u.includes(username))) {
                        // Add the username to the local user's importIds so it can be found by the import process
                        // This way we can support importing new messages for existing users
                        yield models_1.Users.addImportIds(user._id, username);
                    }
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (!_2 && !_r && (_s = usedUsernames_1.return)) yield _s.call(usedUsernames_1);
                }
                finally { if (e_6) throw e_6.error; }
            }
            yield _super.addCountToTotal.call(this, messagesCount + usersCount + channelsCount + contactsCount);
            server_1.ImporterWebsocket.progressUpdated({ rate: 100 });
            // Ensure we have at least a single record of any kind
            if (usersCount === 0 && channelsCount === 0 && messagesCount === 0 && contactsCount === 0) {
                this.logger.error('No valid record found in the import file.');
                yield _super.updateProgress.call(this, server_1.ProgressStep.ERROR);
            }
            return _super.getProgress.call(this);
        });
    }
}
exports.CsvImporter = CsvImporter;
