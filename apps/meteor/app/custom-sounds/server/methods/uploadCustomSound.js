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
const core_services_1 = require("@rocket.chat/core-services");
const meteor_1 = require("meteor/meteor");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const server_1 = require("../../../file/server");
const custom_sounds_1 = require("../startup/custom-sounds");
meteor_1.Meteor.methods({
    uploadCustomSound(binaryContent, contentType, soundData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.userId || !(yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'manage-sounds'))) {
                throw new meteor_1.Meteor.Error('not_authorized');
            }
            const file = Buffer.from(binaryContent, 'binary');
            const rs = server_1.RocketChatFile.bufferToStream(file);
            yield custom_sounds_1.RocketChatFileCustomSoundsInstance.deleteFile(`${soundData._id}.${soundData.extension}`);
            return new Promise((resolve) => {
                const ws = custom_sounds_1.RocketChatFileCustomSoundsInstance.createWriteStream(`${soundData._id}.${soundData.extension}`, contentType);
                ws.on('end', () => {
                    setTimeout(() => core_services_1.api.broadcast('notify.updateCustomSound', { soundData }), 500);
                    resolve();
                });
                rs.pipe(ws);
            });
        });
    },
});
