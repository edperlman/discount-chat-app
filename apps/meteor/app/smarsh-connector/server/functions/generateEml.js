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
exports.generateEml = void 0;
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const sendEmail_1 = require("./sendEmail");
const i18n_1 = require("../../../../server/lib/i18n");
const server_1 = require("../../../settings/server");
const server_2 = require("../../../ui-utils/server");
const start = '<table style="width: 100%; border: 1px solid; border-collapse: collapse; table-layout: fixed; margin-top: 10px; font-size: 12px; word-break: break-word;"><tbody>';
const end = '</tbody></table>';
const opentr = '<tr style="border: 1px solid;">';
const closetr = '</tr>';
const open20td = '<td style="border: 1px solid; text-align: center; width: 20%;">';
const open60td = '<td style="border: 1px solid; text-align: left; width: 60%; padding: 0 5px;">';
const closetd = '</td>';
function _getLink(attachment) {
    const url = attachment.title_link.replace(/ /g, '%20');
    if (url.match(/^(https?:)?\/\//i)) {
        return url;
    }
    return meteor_1.Meteor.absoluteUrl().replace(/\/$/, '') + __meteor_runtime_config__.ROOT_URL_PATH_PREFIX + url;
}
const generateEml = () => __awaiter(void 0, void 0, void 0, function* () {
    setImmediate(() => __awaiter(void 0, void 0, void 0, function* () {
        var _a, e_1, _b, _c, _d, e_2, _e, _f;
        var _g, _h, _j, _k, _l;
        const smarshMissingEmail = server_1.settings.get('Smarsh_MissingEmail_Email');
        const timeZone = server_1.settings.get('Smarsh_Timezone');
        try {
            // TODO: revisit with more time => This appears to be a super expensive operation, going through all rooms
            for (var _m = true, _o = __asyncValues(models_1.Rooms.find()), _p; _p = yield _o.next(), _a = _p.done, !_a; _m = true) {
                _c = _p.value;
                _m = false;
                const room = _c;
                const smarshHistory = yield models_1.SmarshHistory.findOne({ _id: room._id });
                const query = { rid: room._id };
                if (smarshHistory) {
                    query.ts = { $gt: smarshHistory.lastRan };
                }
                const date = new Date();
                const rows = [];
                const data = {
                    users: [],
                    msgs: 0,
                    files: [],
                    time: smarshHistory ? (0, moment_timezone_1.default)(date).diff((0, moment_timezone_1.default)(smarshHistory.lastRan), 'minutes') : (0, moment_timezone_1.default)(date).diff((0, moment_timezone_1.default)(room.ts), 'minutes'),
                    room: room.name ? `#${room.name}` : `Direct Message Between: ${(_g = room === null || room === void 0 ? void 0 : room.usernames) === null || _g === void 0 ? void 0 : _g.join(' & ')}`,
                };
                const cursor = models_1.Messages.find(query);
                try {
                    for (var _q = true, cursor_1 = (e_2 = void 0, __asyncValues(cursor)), cursor_1_1; cursor_1_1 = yield cursor_1.next(), _d = cursor_1_1.done, !_d; _q = true) {
                        _f = cursor_1_1.value;
                        _q = false;
                        const message = _f;
                        rows.push(opentr);
                        // The timestamp
                        rows.push(open20td);
                        rows.push((0, moment_timezone_1.default)(message.ts).tz(timeZone).format('YYYY-MM-DD HH-mm-ss z'));
                        rows.push(closetd);
                        // The sender
                        rows.push(open20td);
                        const sender = yield models_1.Users.findOne({ _id: message.u._id });
                        if (!sender) {
                            return;
                        }
                        if (data.users.indexOf(sender === null || sender === void 0 ? void 0 : sender._id) === -1) {
                            data.users.push(sender._id);
                        }
                        // Get the user's email, can be nothing if it is an unconfigured bot account (like rocket.cat)
                        if ((_j = (_h = sender.emails) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j.address) {
                            rows.push(`${sender.name} &lt;${sender.emails[0].address}&gt;`);
                        }
                        else {
                            rows.push(`${sender.name} &lt;${smarshMissingEmail}&gt;`);
                        }
                        rows.push(closetd);
                        // The message
                        rows.push(open60td);
                        data.msgs++;
                        if (message.t) {
                            const messageType = server_2.MessageTypes.getType(message);
                            if (messageType) {
                                rows.push(i18n_1.i18n.t(messageType.message, {
                                    lng: 'en',
                                    replace: messageType.data ? messageType.data(message) : {},
                                }));
                            }
                            else {
                                rows.push(`${message.msg} (${message.t})`);
                            }
                        }
                        else if (message.file) {
                            data.files.push(message.file._id);
                            rows.push(`${(_k = message === null || message === void 0 ? void 0 : message.attachments) === null || _k === void 0 ? void 0 : _k[0].title} (${_getLink({ title_link: ((_l = message === null || message === void 0 ? void 0 : message.attachments) === null || _l === void 0 ? void 0 : _l[0].title_link) || '' })})})`);
                        }
                        else if (message.attachments) {
                            const attaches = [];
                            message.attachments.forEach((a) => {
                                if ('image_url' in a && a.image_url !== undefined) {
                                    attaches.push(a.image_url);
                                }
                                // TODO: Verify other type of attachments which need to be handled that aren't file uploads and image urls
                                // } else {
                                // 	console.log(a);
                                // }
                            });
                            rows.push(`${message.msg} (${attaches.join(', ')})`);
                        }
                        else {
                            rows.push(message.msg);
                        }
                        rows.push(closetd);
                        rows.push(closetr);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (!_q && !_d && (_e = cursor_1.return)) yield _e.call(cursor_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                if (rows.length !== 0) {
                    const result = start + rows.join('') + end;
                    yield models_1.SmarshHistory.updateOne({ _id: room._id }, {
                        _id: room._id,
                        lastRan: date,
                        lastResult: result,
                    }, { upsert: true });
                    yield (0, sendEmail_1.sendEmail)({
                        body: result,
                        subject: `Rocket.Chat, ${data.users.length} Users, ${data.msgs} Messages, ${data.files.length} Files, ${data.time} Minutes, in ${data.room}`,
                        files: data.files,
                    });
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_m && !_a && (_b = _o.return)) yield _b.call(_o);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }));
});
exports.generateEml = generateEml;
