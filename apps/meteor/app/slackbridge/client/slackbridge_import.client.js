"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../../settings/client");
const slashCommand_1 = require("../../utils/client/slashCommand");
client_1.settings.onload('SlackBridge_Enabled', (_key, value) => {
    if (value) {
        slashCommand_1.slashCommands.add({
            command: 'slackbridge-import',
            options: {
                description: 'Import_old_messages_from_slackbridge',
            },
        });
    }
    else {
        delete slashCommand_1.slashCommands.commands['slackbridge-import'];
    }
});
