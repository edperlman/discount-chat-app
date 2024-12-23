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
exports.maybeMigrateLivechatRoom = maybeMigrateLivechatRoom;
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const projectionAllowsAttribute_1 = require("./projectionAllowsAttribute");
const migrateVisitorIfMissingContact_1 = require("../../../livechat/server/lib/contacts/migrateVisitorIfMissingContact");
/**
 * If the room is a livechat room and it doesn't yet have a contact, trigger the migration for its visitor and source
 * The migration will create/use a contact and assign it to every room that matches this visitorId and source.
 **/
function maybeMigrateLivechatRoom(room_1) {
    return __awaiter(this, arguments, void 0, function* (room, options = {}) {
        if (!room || !(0, core_typings_1.isOmnichannelRoom)(room)) {
            return room;
        }
        // Already migrated
        if (room.contactId) {
            return room;
        }
        // If the query options specify that contactId is not needed, then do not trigger the migration
        if (!(0, projectionAllowsAttribute_1.projectionAllowsAttribute)('contactId', options)) {
            return room;
        }
        const contactId = yield (0, migrateVisitorIfMissingContact_1.migrateVisitorIfMissingContact)(room.v._id, room.source);
        // Did not migrate
        if (!contactId) {
            return room;
        }
        // Load the room again with the same options so it can be reloaded with the contactId in place
        return models_1.Rooms.findOneById(room._id, options);
    });
}
