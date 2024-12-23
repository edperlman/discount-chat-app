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
exports.useOpenRoom = useOpenRoom;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("react");
const publishFields_1 = require("../../../../lib/publishFields");
const omit_1 = require("../../../../lib/utils/omit");
const NotAuthorizedError_1 = require("../../../lib/errors/NotAuthorizedError");
const OldUrlRoomError_1 = require("../../../lib/errors/OldUrlRoomError");
const RoomNotFoundError_1 = require("../../../lib/errors/RoomNotFoundError");
const queryClient_1 = require("../../../lib/queryClient");
function useOpenRoom({ type, reference }) {
    const user = (0, ui_contexts_1.useUser)();
    const allowAnonymousRead = (0, ui_contexts_1.useSetting)('Accounts_AllowAnonymousRead', true);
    const getRoomByTypeAndName = (0, ui_contexts_1.useMethod)('getRoomByTypeAndName');
    const createDirectMessage = (0, ui_contexts_1.useMethod)('createDirectMessage');
    const openRoom = (0, ui_contexts_1.useMethod)('openRoom');
    const directRoute = (0, ui_contexts_1.useRoute)('direct');
    const unsubscribeFromRoomOpenedEvent = (0, react_1.useRef)(() => undefined);
    return (0, react_query_1.useQuery)(
    // we need to add uid and username here because `user` is not loaded all at once (see UserProvider -> Meteor.user())
    ['rooms', { reference, type }, { uid: user === null || user === void 0 ? void 0 : user._id, username: user === null || user === void 0 ? void 0 : user.username }], () => __awaiter(this, void 0, void 0, function* () {
        if ((user && !user.username) || (!user && !allowAnonymousRead)) {
            throw new NotAuthorizedError_1.NotAuthorizedError();
        }
        let roomData;
        try {
            roomData = yield getRoomByTypeAndName(type, reference);
        }
        catch (error) {
            if (type !== 'd') {
                throw new RoomNotFoundError_1.RoomNotFoundError(undefined, { type, reference });
            }
            try {
                const { rid } = yield createDirectMessage(...reference.split(', '));
                const { Subscriptions } = yield Promise.resolve().then(() => __importStar(require('../../../../app/models/client')));
                const { waitUntilFind } = yield Promise.resolve().then(() => __importStar(require('../../../lib/utils/waitUntilFind')));
                yield waitUntilFind(() => Subscriptions.findOne({ rid }));
                directRoute.push({ rid }, (prev) => prev);
            }
            catch (error) {
                throw new RoomNotFoundError_1.RoomNotFoundError(undefined, { type, reference });
            }
            throw new OldUrlRoomError_1.OldUrlRoomError(undefined, { type, reference });
        }
        if (!roomData._id) {
            throw new RoomNotFoundError_1.RoomNotFoundError(undefined, { type, reference });
        }
        const $set = {};
        const $unset = {};
        for (const key of Object.keys(publishFields_1.roomFields)) {
            if (key in roomData) {
                $set[key] = roomData[key];
            }
            else {
                $unset[key] = '';
            }
        }
        const { Rooms, Subscriptions } = yield Promise.resolve().then(() => __importStar(require('../../../../app/models/client')));
        Rooms.upsert({ _id: roomData._id }, { $set, $unset });
        const room = Rooms.findOne({ _id: roomData._id });
        if (!room) {
            throw new TypeError('room is undefined');
        }
        const { LegacyRoomManager } = yield Promise.resolve().then(() => __importStar(require('../../../../app/ui-utils/client')));
        if (reference !== undefined && room._id !== reference && type === 'd') {
            // Redirect old url using username to rid
            yield LegacyRoomManager.close(type + reference);
            directRoute.push({ rid: room._id }, (prev) => prev);
            throw new OldUrlRoomError_1.OldUrlRoomError(undefined, { rid: room._id });
        }
        const { RoomManager } = yield Promise.resolve().then(() => __importStar(require('../../../lib/RoomManager')));
        const { fireGlobalEvent } = yield Promise.resolve().then(() => __importStar(require('../../../lib/utils/fireGlobalEvent')));
        unsubscribeFromRoomOpenedEvent.current();
        unsubscribeFromRoomOpenedEvent.current = RoomManager.once('opened', () => fireGlobalEvent('room-opened', (0, omit_1.omit)(room, 'usernames')));
        LegacyRoomManager.open({ typeName: type + reference, rid: room._id });
        if (room._id === RoomManager.opened) {
            return { rid: room._id };
        }
        // update user's room subscription
        const sub = Subscriptions.findOne({ rid: room._id });
        if (sub && !sub.open) {
            yield openRoom(room._id);
        }
        return { rid: room._id };
    }), {
        retry: 0,
        onError: (error) => __awaiter(this, void 0, void 0, function* () {
            if (['l', 'v'].includes(type) && error instanceof RoomNotFoundError_1.RoomNotFoundError) {
                const { Rooms } = yield Promise.resolve().then(() => __importStar(require('../../../../app/models/client')));
                Rooms.remove(reference);
                queryClient_1.queryClient.removeQueries(['rooms', reference]);
                queryClient_1.queryClient.removeQueries(['/v1/rooms.info', reference]);
            }
        }),
    });
}
