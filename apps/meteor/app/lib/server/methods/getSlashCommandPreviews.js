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
const meteor_1 = require("meteor/meteor");
const slashCommand_1 = require("../../../utils/server/slashCommand");
meteor_1.Meteor.methods({
    getSlashCommandPreviews(command) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!meteor_1.Meteor.userId()) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'getSlashCommandPreview',
                });
            }
            if (!(command === null || command === void 0 ? void 0 : command.cmd) || !slashCommand_1.slashCommands.commands[command.cmd]) {
                throw new meteor_1.Meteor.Error('error-invalid-command', 'Invalid Command Provided', {
                    method: 'executeSlashCommandPreview',
                });
            }
            const theCmd = slashCommand_1.slashCommands.commands[command.cmd];
            if (!theCmd.providesPreview) {
                throw new meteor_1.Meteor.Error('error-invalid-command', 'Command Does Not Provide Previews', {
                    method: 'executeSlashCommandPreview',
                });
            }
            return slashCommand_1.slashCommands.getPreviews(command.cmd, command.params, command.msg);
        });
    },
});
