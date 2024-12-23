"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const slashCommand_1 = require("../../utils/client/slashCommand");
slashCommand_1.slashCommands.add({
    command: 'invite-all-to',
    options: {
        description: 'Invite_user_to_join_channel_all_to',
        params: '#room',
        permission: ['add-user-to-joined-room', 'add-user-to-any-c-room', 'add-user-to-any-p-room'],
    },
});
slashCommand_1.slashCommands.add({
    command: 'invite-all-from',
    options: {
        description: 'Invite_user_to_join_channel_all_from',
        params: '#room',
        permission: 'add-user-to-joined-room',
    },
});
