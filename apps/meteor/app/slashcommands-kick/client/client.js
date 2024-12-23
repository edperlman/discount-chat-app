"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const slashCommand_1 = require("../../utils/client/slashCommand");
slashCommand_1.slashCommands.add({
    command: 'kick',
    callback({ params }) {
        const username = params.trim();
        if (username === '') {
            return;
        }
        return username.replace('@', '');
    },
    options: {
        description: 'Remove_someone_from_room',
        params: '@username',
        permission: 'remove-user',
    },
});
