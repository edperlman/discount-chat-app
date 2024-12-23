"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const slashCommand_1 = require("../../../app/utils/client/slashCommand");
const callback = undefined;
const result = undefined;
const providesPreview = false;
const previewer = undefined;
const previewCallback = undefined;
slashCommand_1.slashCommands.add({
    command: 'federation',
    callback,
    options: {
        description: 'Federation_slash_commands',
        params: '#command (dm) #user',
    },
    result,
    providesPreview,
    previewer,
    previewCallback,
});
