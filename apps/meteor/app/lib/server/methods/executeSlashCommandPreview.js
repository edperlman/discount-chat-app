"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const meteor_1 = require("meteor/meteor");
const slashCommand_1 = require("../../../utils/server/slashCommand");
meteor_1.Meteor.methods({
    executeSlashCommandPreview(command, preview) {
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
        if (!preview) {
            throw new meteor_1.Meteor.Error('error-invalid-command-preview', 'Invalid Preview Provided', {
                method: 'executeSlashCommandPreview',
            });
        }
        return slashCommand_1.slashCommands.executePreview(command.cmd, command.params, command.msg, preview, command.triggerId);
    },
});
