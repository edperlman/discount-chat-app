"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPermaLink = void 0;
const meteor_1 = require("meteor/meteor");
const getMessage = (msgId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sdk } = yield Promise.resolve().then(() => __importStar(require('../../app/utils/client/lib/SDKClient')));
        const { message } = yield sdk.rest.get('/v1/chat.getMessage', { msgId });
        return message;
    }
    catch (_a) {
        return null;
    }
});
const getPermaLink = (msgId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!msgId) {
        throw new Error('invalid-parameter');
    }
    const { Messages, Rooms, Subscriptions } = yield Promise.resolve().then(() => __importStar(require('../../app/models/client')));
    const msg = Messages.findOne(msgId) || (yield getMessage(msgId));
    if (!msg) {
        throw new Error('message-not-found');
    }
    const roomData = Rooms.findOne({
        _id: msg.rid,
    });
    if (!roomData) {
        throw new Error('room-not-found');
    }
    const subData = Subscriptions.findOne({ 'rid': roomData._id, 'u._id': meteor_1.Meteor.userId() });
    const { roomCoordinator } = yield Promise.resolve().then(() => __importStar(require('./rooms/roomCoordinator')));
    const roomURL = roomCoordinator.getURL(roomData.t, Object.assign(Object.assign({}, (subData || roomData)), { tab: '' }));
    return `${roomURL}?msg=${msgId}`;
});
exports.getPermaLink = getPermaLink;
