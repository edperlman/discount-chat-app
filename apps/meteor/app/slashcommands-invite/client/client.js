"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const slashCommand_1 = require("../../utils/client/slashCommand");
slashCommand_1.slashCommands.add({
    command: 'invite',
    options: {
        description: 'Invite_user_to_join_channel',
        params: '@username',
        permission: 'add-user-to-joined-room',
    },
    providesPreview: false,
});
