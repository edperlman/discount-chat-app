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
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const custom_sounds_1 = require("../startup/custom-sounds");
meteor_1.Meteor.methods({
    insertOrUpdateSound(soundData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!this.userId || !(yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'manage-sounds'))) {
                throw new meteor_1.Meteor.Error('not_authorized');
            }
            if (!((_a = soundData.name) === null || _a === void 0 ? void 0 : _a.trim())) {
                throw new meteor_1.Meteor.Error('error-the-field-is-required', 'The field Name is required', {
                    method: 'insertOrUpdateSound',
                    field: 'Name',
                });
            }
            // let nameValidation = new RegExp('^[0-9a-zA-Z-_+;.]+$');
            // allow all characters except colon, whitespace, comma, >, <, &, ", ', /, \, (, )
            // more practical than allowing specific sets of characters; also allows foreign languages
            const nameValidation = /[\s,:><&"'\/\\\(\)]/;
            // silently strip colon; this allows for uploading :soundname: as soundname
            soundData.name = soundData.name.replace(/:/g, '');
            if (nameValidation.test(soundData.name)) {
                throw new meteor_1.Meteor.Error('error-input-is-not-a-valid-field', `${soundData.name} is not a valid name`, {
                    method: 'insertOrUpdateSound',
                    input: soundData.name,
                    field: 'Name',
                });
            }
            let matchingResults = [];
            if (soundData._id) {
                (0, check_1.check)(soundData._id, String);
                matchingResults = yield models_1.CustomSounds.findByNameExceptId(soundData.name, soundData._id).toArray();
            }
            else {
                matchingResults = yield models_1.CustomSounds.findByName(soundData.name).toArray();
            }
            if (matchingResults.length > 0) {
                throw new meteor_1.Meteor.Error('Custom_Sound_Error_Name_Already_In_Use', 'The custom sound name is already in use', {
                    method: 'insertOrUpdateSound',
                });
            }
            if (!soundData._id) {
                return (yield models_1.CustomSounds.create({
                    name: soundData.name,
                    extension: soundData.extension,
                })).insertedId;
            }
            // update sound
            if (soundData.newFile) {
                yield custom_sounds_1.RocketChatFileCustomSoundsInstance.deleteFile(`${soundData._id}.${soundData.previousExtension}`);
            }
            if (soundData.name !== soundData.previousName) {
                yield models_1.CustomSounds.setName(soundData._id, soundData.name);
                void core_services_1.api.broadcast('notify.updateCustomSound', {
                    soundData: {
                        _id: soundData._id,
                        name: soundData.name,
                        extension: soundData.extension,
                    },
                });
            }
            return soundData._id;
        });
    },
});
