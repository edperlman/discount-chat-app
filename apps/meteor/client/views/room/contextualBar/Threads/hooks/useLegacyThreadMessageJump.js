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
exports.useLegacyThreadMessageJump = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const waitForElement_1 = require("../../../../../lib/utils/waitForElement");
const messageHighlightSubscription_1 = require("../../../MessageList/providers/messageHighlightSubscription");
const useLegacyThreadMessageJump = ({ enabled = true }) => {
    const router = (0, ui_contexts_1.useRouter)();
    const mid = (0, ui_contexts_1.useSearchParameter)('msg');
    const clearQueryStringParameter = () => {
        const name = router.getRouteName();
        if (!name) {
            return;
        }
        const _a = router.getSearchParameters(), { msg: _ } = _a, search = __rest(_a, ["msg"]);
        router.navigate({
            name,
            params: router.getRouteParameters(),
            search,
        }, { replace: true });
    };
    const parentRef = (0, react_1.useRef)(null);
    const clearQueryStringParameterRef = (0, react_1.useRef)(clearQueryStringParameter);
    clearQueryStringParameterRef.current = clearQueryStringParameter;
    (0, react_1.useEffect)(() => {
        const parent = parentRef.current;
        if (!enabled || !mid || !parent) {
            return;
        }
        const abortController = new AbortController();
        (0, waitForElement_1.waitForElement)(`[data-id='${mid}']`, { parent, signal: abortController.signal }).then((messageElement) => {
            var _a;
            if (abortController.signal.aborted) {
                return;
            }
            (0, messageHighlightSubscription_1.setHighlightMessage)(mid);
            (_a = clearQueryStringParameterRef.current) === null || _a === void 0 ? void 0 : _a.call(clearQueryStringParameterRef);
            setTimeout(() => {
                (0, messageHighlightSubscription_1.clearHighlightMessage)();
            }, 1000);
            setTimeout(() => {
                if (abortController.signal.aborted) {
                    return;
                }
                messageElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                });
            }, 300);
        });
        return () => {
            abortController.abort();
        };
    }, [enabled, mid]);
    return { parentRef };
};
exports.useLegacyThreadMessageJump = useLegacyThreadMessageJump;
