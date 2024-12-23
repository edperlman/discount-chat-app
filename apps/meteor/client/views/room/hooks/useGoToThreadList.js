"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGoToThreadList = void 0;
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const RoomContext_1 = require("../contexts/RoomContext");
const useGoToThreadList = ({ replace = false } = {}) => {
    const router = (0, ui_contexts_1.useRouter)();
    const room = (0, RoomContext_1.useRoom)();
    return (0, fuselage_hooks_1.useMutableCallback)(() => {
        const routeName = router.getRouteName();
        if (!routeName) {
            throw new Error('Route name is not defined');
        }
        const _a = router.getRouteParameters(), { context } = _a, params = __rest(_a, ["context"]);
        router.navigate({
            name: routeName,
            params: Object.assign(Object.assign({ rid: room._id }, params), { tab: 'thread' }),
            search: router.getSearchParameters(),
        }, { replace });
    });
};
exports.useGoToThreadList = useGoToThreadList;
