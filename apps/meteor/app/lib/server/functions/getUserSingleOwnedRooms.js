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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserSingleOwnedRooms = void 0;
const models_1 = require("@rocket.chat/models");
const getUserSingleOwnedRooms = function (subscribedRooms) {
    return __awaiter(this, void 0, void 0, function* () {
        const roomsThatWillChangeOwner = subscribedRooms
            .filter(({ shouldChangeOwner }) => shouldChangeOwner)
            .map(({ rid }) => rid);
        const roomsThatWillBeRemoved = subscribedRooms.filter(({ shouldBeRemoved }) => shouldBeRemoved).map(({ rid }) => rid);
        const roomIds = roomsThatWillBeRemoved.concat(roomsThatWillChangeOwner);
        const rooms = models_1.Rooms.findByIds(roomIds, { projection: { _id: 1, name: 1, fname: 1 } });
        const result = {
            shouldBeRemoved: [],
            shouldChangeOwner: [],
        };
        yield rooms.forEach((room) => {
            const name = room.fname || room.name;
            if (roomsThatWillBeRemoved.includes(room._id)) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                result.shouldBeRemoved.push(name);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                result.shouldChangeOwner.push(name);
            }
        });
        return result;
    });
};
exports.getUserSingleOwnedRooms = getUserSingleOwnedRooms;
