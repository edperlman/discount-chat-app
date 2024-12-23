"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAppSlashCommands = void 0;
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("react");
const slashCommand_1 = require("../../app/utils/client/slashCommand");
const useAppSlashCommands = () => {
    const queryClient = (0, react_query_1.useQueryClient)();
    const apps = (0, ui_contexts_1.useStream)('apps');
    const uid = (0, ui_contexts_1.useUserId)();
    const invalidate = (0, fuselage_hooks_1.useDebouncedCallback)(() => {
        queryClient.invalidateQueries(['apps', 'slashCommands']);
    }, 100, []);
    (0, react_1.useEffect)(() => {
        if (!uid) {
            return;
        }
        return apps('apps', ([key, [command]]) => {
            if (['command/added', 'command/updated', 'command/disabled', 'command/removed'].includes(key)) {
                if (typeof command === 'string') {
                    delete slashCommand_1.slashCommands.commands[command];
                }
                invalidate();
            }
        });
    }, [apps, uid, invalidate]);
    const getSlashCommands = (0, ui_contexts_1.useEndpoint)('GET', '/v1/commands.list');
    (0, react_query_1.useQuery)(['apps', 'slashCommands'], () => getSlashCommands(), {
        enabled: !!uid,
        onSuccess(data) {
            data.commands.forEach((command) => slashCommand_1.slashCommands.add(command));
        },
    });
};
exports.useAppSlashCommands = useAppSlashCommands;
