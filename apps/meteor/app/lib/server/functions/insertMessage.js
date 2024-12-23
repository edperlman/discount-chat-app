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
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertMessage = void 0;
const models_1 = require("@rocket.chat/models");
const parseUrlsInMessage_1 = require("./parseUrlsInMessage");
const sendMessage_1 = require("./sendMessage");
const insertMessage = function (user_1, message_1, rid_1) {
    return __awaiter(this, arguments, void 0, function* (user, message, rid, upsert = false) {
        if (!user || !message || !rid) {
            return false;
        }
        yield (0, sendMessage_1.validateMessage)(message, { _id: rid }, user);
        (0, sendMessage_1.prepareMessageObject)(message, rid, user);
        (0, parseUrlsInMessage_1.parseUrlsInMessage)(message);
        if (message._id && upsert) {
            const { _id } = message, rest = __rest(message, ["_id"]);
            const existingMessage = yield models_1.Messages.findOneById(_id);
            if (existingMessage) {
                yield models_1.Messages.updateOne({
                    _id,
                    'u._id': message.u._id,
                }, { $set: rest });
            }
            else {
                yield models_1.Messages.insertOne(Object.assign({ _id }, rest));
                yield models_1.Rooms.incMsgCountById(rid, 1);
            }
            message._id = _id;
        }
        else {
            const result = yield models_1.Messages.insertOne(message);
            message._id = result.insertedId;
            yield models_1.Rooms.incMsgCountById(rid, 1);
        }
        return message;
    });
};
exports.insertMessage = insertMessage;
