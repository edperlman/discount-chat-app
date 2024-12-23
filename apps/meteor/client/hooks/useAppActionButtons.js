"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAppActionButtons = exports.getIdForActionButton = void 0;
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("react");
const getIdForActionButton = ({ appId, actionId }) => `${appId}/${actionId}`;
exports.getIdForActionButton = getIdForActionButton;
const useAppActionButtons = (context) => {
    const queryClient = (0, react_query_1.useQueryClient)();
    const apps = (0, ui_contexts_1.useStream)('apps');
    const uid = (0, ui_contexts_1.useUserId)();
    const getActionButtons = (0, ui_contexts_1.useEndpoint)('GET', '/apps/actionButtons');
    const result = (0, react_query_1.useQuery)(['apps', 'actionButtons'], () => getActionButtons(), Object.assign(Object.assign({}, (context && {
        select: (data) => data.filter((button) => button.context === context),
    })), { staleTime: Infinity }));
    const invalidate = (0, fuselage_hooks_1.useDebouncedCallback)(() => {
        queryClient.invalidateQueries(['apps', 'actionButtons']);
    }, 100, []);
    (0, react_1.useEffect)(() => {
        if (!uid) {
            return;
        }
        return apps('apps', ([key]) => {
            if (['actions/changed'].includes(key)) {
                invalidate();
            }
        });
    }, [uid, apps, invalidate]);
    return result;
};
exports.useAppActionButtons = useAppActionButtons;
