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
const models_1 = require("@rocket.chat/models");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const ufs_1 = require("../../../../server/ufs");
const server_1 = require("../../../authorization/server");
const server_2 = require("../../../settings/server");
meteor_1.Meteor.methods({
    getS3FileUrl(fileId) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(fileId, String);
            const uid = meteor_1.Meteor.userId();
            if (server_2.settings.get('FileUpload_ProtectFiles') && !uid) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', { method: 'sendFileMessage' });
            }
            const file = yield models_1.Uploads.findOneById(fileId);
            if (!(file === null || file === void 0 ? void 0 : file.rid)) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed');
            }
            const room = yield models_1.Rooms.findOneById(file.rid);
            if (uid && room && !(yield (0, server_1.canAccessRoomAsync)(room, { _id: uid }))) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed');
            }
            return ufs_1.UploadFS.getStore('AmazonS3:Uploads').getRedirectURL(file);
        });
    },
});
