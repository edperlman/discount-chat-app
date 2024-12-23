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
exports.cleanRoomHistory = cleanRoomHistory;
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const deleteRoom_1 = require("./deleteRoom");
const i18n_1 = require("../../../../server/lib/i18n");
const server_1 = require("../../../file-upload/server");
const notifyListener_1 = require("../lib/notifyListener");
function cleanRoomHistory(_a) {
    return __awaiter(this, arguments, void 0, function* ({ rid = '', latest = new Date(), oldest = new Date('0001-01-01T00:00:00Z'), inclusive = true, limit = 0, excludePinned = true, ignoreDiscussion = true, filesOnly = false, fromUsers = [], ignoreThreads = true, }) {
        var _b, e_1, _c, _d, _e, e_2, _f, _g;
        const gt = inclusive ? '$gte' : '$gt';
        const lt = inclusive ? '$lte' : '$lt';
        const ts = { [gt]: oldest, [lt]: latest };
        const text = `_${i18n_1.i18n.t('File_removed_by_prune')}_`;
        let fileCount = 0;
        const cursor = models_1.Messages.findFilesByRoomIdPinnedTimestampAndUsers(rid, excludePinned, ignoreDiscussion, ts, fromUsers, ignoreThreads, {
            projection: { pinned: 1, files: 1 },
            limit,
        });
        try {
            for (var _h = true, cursor_1 = __asyncValues(cursor), cursor_1_1; cursor_1_1 = yield cursor_1.next(), _b = cursor_1_1.done, !_b; _h = true) {
                _d = cursor_1_1.value;
                _h = false;
                const document = _d;
                const uploadsStore = server_1.FileUpload.getStore('Uploads');
                document.files && (yield Promise.all(document.files.map((file) => uploadsStore.deleteById(file._id))));
                fileCount++;
                if (filesOnly) {
                    yield models_1.Messages.updateOne({ _id: document._id }, { $unset: { file: 1 }, $set: { attachments: [{ color: '#FD745E', text }] } });
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_h && !_b && (_c = cursor_1.return)) yield _c.call(cursor_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (filesOnly) {
            return fileCount;
        }
        if (!ignoreDiscussion) {
            const discussionsCursor = models_1.Messages.findDiscussionByRoomIdPinnedTimestampAndUsers(rid, excludePinned, ts, fromUsers, Object.assign({ projection: { drid: 1 } }, (limit && { limit })));
            try {
                for (var _j = true, discussionsCursor_1 = __asyncValues(discussionsCursor), discussionsCursor_1_1; discussionsCursor_1_1 = yield discussionsCursor_1.next(), _e = discussionsCursor_1_1.done, !_e; _j = true) {
                    _g = discussionsCursor_1_1.value;
                    _j = false;
                    const { drid } = _g;
                    if (!drid) {
                        continue;
                    }
                    yield (0, deleteRoom_1.deleteRoom)(drid);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (!_j && !_e && (_f = discussionsCursor_1.return)) yield _f.call(discussionsCursor_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
        if (!ignoreThreads) {
            const threads = new Set();
            yield models_1.Messages.findThreadsByRoomIdPinnedTimestampAndUsers({ rid, pinned: excludePinned, ignoreDiscussion, ts, users: fromUsers }, { projection: { _id: 1 } }).forEach(({ _id }) => {
                threads.add(_id);
            });
            if (threads.size > 0) {
                const subscriptionIds = (yield models_1.Subscriptions.findUnreadThreadsByRoomId(rid, [...threads], { projection: { _id: 1 } }).toArray()).map(({ _id }) => _id);
                const { modifiedCount } = yield models_1.Subscriptions.removeUnreadThreadsByRoomId(rid, [...threads]);
                if (modifiedCount) {
                    subscriptionIds.forEach((id) => (0, notifyListener_1.notifyOnSubscriptionChangedById)(id));
                }
            }
        }
        const selectedMessageIds = limit
            ? yield models_1.Messages.findByIdPinnedTimestampLimitAndUsers(rid, excludePinned, ignoreDiscussion, ts, limit, fromUsers, ignoreThreads)
            : undefined;
        const count = yield models_1.Messages.removeByIdPinnedTimestampLimitAndUsers(rid, excludePinned, ignoreDiscussion, ts, limit, fromUsers, ignoreThreads, selectedMessageIds);
        if (!limit) {
            const uids = yield models_1.Users.findByUsernames(fromUsers, { projection: { _id: 1 } })
                .map((user) => user._id)
                .toArray();
            yield models_1.ReadReceipts.removeByIdPinnedTimestampLimitAndUsers(rid, excludePinned, ignoreDiscussion, ts, uids, ignoreThreads);
        }
        else if (selectedMessageIds) {
            yield models_1.ReadReceipts.removeByMessageIds(selectedMessageIds);
        }
        if (count) {
            const lastMessage = yield models_1.Messages.getLastVisibleUserMessageSentByRoomId(rid);
            yield models_1.Rooms.resetLastMessageById(rid, lastMessage, -count);
            void (0, notifyListener_1.notifyOnRoomChangedById)(rid);
            void core_services_1.api.broadcast('notify.deleteMessageBulk', rid, {
                rid,
                excludePinned,
                ignoreDiscussion,
                ts,
                users: fromUsers,
                ids: selectedMessageIds,
            });
        }
        return count;
    });
}
