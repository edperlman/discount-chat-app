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
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const custom_sounds_1 = require("../startup/custom-sounds");
meteor_1.Meteor.methods({
    deleteCustomSound(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let sound = null;
            if (this.userId && (yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'manage-sounds'))) {
                sound = yield models_1.CustomSounds.findOneById(_id);
            }
            else {
                throw new meteor_1.Meteor.Error('not_authorized');
            }
            if (sound == null) {
                throw new meteor_1.Meteor.Error('Custom_Sound_Error_Invalid_Sound', 'Invalid sound', {
                    method: 'deleteCustomSound',
                });
            }
            yield custom_sounds_1.RocketChatFileCustomSoundsInstance.deleteFile(`${sound._id}.${sound.extension}`);
            yield models_1.CustomSounds.removeById(_id);
            void core_services_1.api.broadcast('notify.deleteCustomSound', { soundData: sound });
            return true;
        });
    },
});
