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
const server_1 = require("../../app/file-upload/server");
const deleteMessage_1 = require("../../app/lib/server/functions/deleteMessage");
meteor_1.Meteor.methods({
    deleteFileMessage(fileID) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(fileID, String);
            const msg = yield models_1.Messages.getMessageByFileId(fileID);
            const userId = meteor_1.Meteor.userId();
            if (msg && userId) {
                return (0, deleteMessage_1.deleteMessageValidatingPermission)(msg, userId);
            }
            return server_1.FileUpload.getStore('Uploads').deleteById(fileID);
        });
    },
});
