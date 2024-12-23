"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const slashCommand_1 = require("../../utils/client/slashCommand");
slashCommand_1.slashCommands.add({
    command: 'archive',
    options: {
        description: 'Archive',
        params: '#channel',
        permission: 'archive-room',
    },
    providesPreview: false,
});
