"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const slashCommand_1 = require("../../utils/client/slashCommand");
slashCommand_1.slashCommands.add({
    command: 'create',
    options: {
        description: 'Create_A_New_Channel',
        params: '#channel',
        permission: ['create-c', 'create-p'],
    },
    providesPreview: false,
});
