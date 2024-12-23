"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGoToThread = void 0;
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const useGoToThread = ({ replace = false } = {}) => {
    const router = (0, ui_contexts_1.useRouter)();
    // TODO: remove params recycling
    return (0, fuselage_hooks_1.useMutableCallback)(({ rid, tmid, msg }) => {
        const routeName = router.getRouteName();
        if (!routeName) {
            throw new Error('Route name is not defined');
        }
        router.navigate({
            name: routeName,
            params: Object.assign(Object.assign({ rid }, router.getRouteParameters()), { tab: 'thread', context: tmid }),
            search: Object.assign(Object.assign({}, router.getSearchParameters()), (msg && { msg })),
        }, { replace });
    });
};
exports.useGoToThread = useGoToThread;
