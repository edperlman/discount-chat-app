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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getValidRoomName = void 0;
const models_1 = require("@rocket.chat/models");
const string_helpers_1 = require("@rocket.chat/string-helpers");
const limax_1 = __importDefault(require("limax"));
const meteor_1 = require("meteor/meteor");
const validateName_1 = require("../../../lib/server/functions/validateName");
const server_1 = require("../../../settings/server");
const getValidRoomName = (displayName_1, ...args_1) => __awaiter(void 0, [displayName_1, ...args_1], void 0, function* (displayName, rid = '', options = {}) {
    let slugifiedName = displayName;
    if (server_1.settings.get('UI_Allow_room_names_with_special_chars')) {
        const cleanName = (0, limax_1.default)(displayName, { maintainCase: true });
        if (options.allowDuplicates !== true) {
            const room = yield models_1.Rooms.findOneByDisplayName(displayName);
            if (room && room._id !== rid) {
                if (room.archived) {
                    throw new meteor_1.Meteor.Error('error-archived-duplicate-name', `There's an archived channel with name ${cleanName}`, {
                        function: 'RocketChat.getValidRoomName',
                        channel_name: cleanName,
                    });
                }
                else {
                    throw new meteor_1.Meteor.Error('error-duplicate-channel-name', `A channel with name '${cleanName}' exists`, {
                        function: 'RocketChat.getValidRoomName',
                        channel_name: cleanName,
                    });
                }
            }
        }
        slugifiedName = cleanName;
    }
    let nameValidation;
    try {
        nameValidation = new RegExp(`^${server_1.settings.get('UTF8_Channel_Names_Validation')}$`);
    }
    catch (error) {
        nameValidation = new RegExp('^[0-9a-zA-Z-_.]+$');
    }
    if (!nameValidation.test(slugifiedName) || !(0, validateName_1.validateName)(slugifiedName)) {
        throw new meteor_1.Meteor.Error('error-invalid-room-name', `${(0, string_helpers_1.escapeHTML)(slugifiedName)} is not a valid room name.`, {
            function: 'RocketChat.getValidRoomName',
            channel_name: (0, string_helpers_1.escapeHTML)(slugifiedName),
        });
    }
    if (options.allowDuplicates !== true) {
        const room = yield models_1.Rooms.findOneByName(slugifiedName);
        if (room && room._id !== rid) {
            if (server_1.settings.get('UI_Allow_room_names_with_special_chars')) {
                let tmpName = slugifiedName;
                let next = 0;
                // eslint-disable-next-line no-await-in-loop
                while (yield models_1.Rooms.findOneByNameAndNotId(tmpName, rid)) {
                    tmpName = `${slugifiedName}-${++next}`;
                }
                slugifiedName = tmpName;
            }
            else if (room.archived) {
                throw new meteor_1.Meteor.Error('error-archived-duplicate-name', `There's an archived channel with name ${(0, string_helpers_1.escapeHTML)(slugifiedName)}`, {
                    function: 'RocketChat.getValidRoomName',
                    channel_name: (0, string_helpers_1.escapeHTML)(slugifiedName),
                });
            }
            else {
                throw new meteor_1.Meteor.Error('error-duplicate-channel-name', `A channel with name '${(0, string_helpers_1.escapeHTML)(slugifiedName)}' exists`, {
                    function: 'RocketChat.getValidRoomName',
                    channel_name: (0, string_helpers_1.escapeHTML)(slugifiedName),
                });
            }
        }
    }
    return slugifiedName;
});
exports.getValidRoomName = getValidRoomName;
