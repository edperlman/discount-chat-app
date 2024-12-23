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
const models_1 = require("@rocket.chat/models");
const callbacks_1 = require("../../../../lib/callbacks");
const deleteRoom_1 = require("../../../lib/server/functions/deleteRoom");
const notifyListener_1 = require("../../../lib/server/lib/notifyListener");
const updateAndNotifyParentRoomWithParentMessage = (room) => __awaiter(void 0, void 0, void 0, function* () {
    const { value: parentMessage } = yield models_1.Messages.refreshDiscussionMetadata(room);
    if (!parentMessage) {
        return;
    }
    void (0, notifyListener_1.notifyOnMessageChange)({
        id: parentMessage._id,
        data: parentMessage,
    });
});
/**
 * We need to propagate the writing of new message in a discussion to the linking
 * system message
 */
callbacks_1.callbacks.add('afterSaveMessage', (message_1, _a) => __awaiter(void 0, [message_1, _a], void 0, function* (message, { room: { _id, prid } }) {
    if (!prid) {
        return message;
    }
    const room = yield models_1.Rooms.findOneById(_id, {
        projection: {
            msgs: 1,
            lm: 1,
        },
    });
    if (!room) {
        return message;
    }
    yield updateAndNotifyParentRoomWithParentMessage(room);
    return message;
}), callbacks_1.callbacks.priority.LOW, 'PropagateDiscussionMetadata');
callbacks_1.callbacks.add('afterDeleteMessage', (message_1, _a) => __awaiter(void 0, [message_1, _a], void 0, function* (message, { _id, prid }) {
    if (prid) {
        const room = yield models_1.Rooms.findOneById(_id, {
            projection: {
                msgs: 1,
                lm: 1,
            },
        });
        if (room) {
            yield updateAndNotifyParentRoomWithParentMessage(room);
        }
    }
    if (message.drid) {
        yield (0, deleteRoom_1.deleteRoom)(message.drid);
    }
    return message;
}), callbacks_1.callbacks.priority.LOW, 'PropagateDiscussionMetadata');
callbacks_1.callbacks.add('afterDeleteRoom', (rid) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    try {
        for (var _d = true, _e = __asyncValues(models_1.Rooms.find({ prid: rid }, { projection: { _id: 1 } })), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
            _c = _f.value;
            _d = false;
            const { _id } = _c;
            yield (0, deleteRoom_1.deleteRoom)(_id);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return rid;
}), callbacks_1.callbacks.priority.LOW, 'DeleteDiscussionChain');
// TODO discussions define new fields
callbacks_1.callbacks.add('afterRoomNameChange', (roomConfig) => __awaiter(void 0, void 0, void 0, function* () {
    const { rid, name, oldName } = roomConfig;
    yield models_1.Rooms.updateMany(Object.assign({ prid: rid }, (oldName && { topic: oldName })), { $set: { topic: name } });
    return roomConfig;
}), callbacks_1.callbacks.priority.LOW, 'updateTopicDiscussion');
callbacks_1.callbacks.add('afterDeleteRoom', (drid) => __awaiter(void 0, void 0, void 0, function* () {
    yield models_1.Messages.updateMany({ drid }, {
        $unset: {
            dcount: 1,
            dlm: 1,
            drid: 1,
        },
    });
    yield models_1.VideoConference.unsetDiscussionRid(drid);
    return drid;
}), callbacks_1.callbacks.priority.LOW, 'CleanDiscussionMessage');
