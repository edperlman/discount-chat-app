"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const slashCommand_1 = require("../../utils/client/slashCommand");
slashCommand_1.slashCommands.add({
    command: 'join',
    options: {
        description: 'Join_the_given_channel',
        params: '#channel',
        permission: 'view-c-room',
    },
    result(err, _result, params) {
        if (err.error === 'error-user-already-in-room') {
            params.cmd = 'open';
            params.msg.msg = params.msg.msg.replace('join', 'open');
            return void slashCommand_1.slashCommands.run({ command: 'open', params: params.params, message: params.msg, triggerId: '', userId: params.userId });
        }
    },
});
