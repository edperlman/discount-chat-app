"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const slashCommand_1 = require("../../utils/client/slashCommand");
slashCommand_1.slashCommands.add({
    command: 'hide',
    options: {
        description: 'Hide_room',
        params: '#room',
    },
});
