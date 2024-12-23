"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useContactRoute = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const useContactRoute = () => {
    const { navigate, getRouteParameters, getRouteName } = (0, ui_contexts_1.useRouter)();
    const currentRouteName = getRouteName();
    const currentParams = getRouteParameters();
    const handleNavigate = (0, react_1.useCallback)((params) => {
        if (!currentRouteName) {
            return;
        }
        if (currentRouteName === 'omnichannel-directory') {
            return navigate({
                name: currentRouteName,
                params: Object.assign(Object.assign(Object.assign({}, currentParams), { tab: 'contacts' }), params),
            });
        }
        navigate({
            name: currentRouteName,
            params: Object.assign(Object.assign({}, currentParams), params),
        });
    }, [navigate, currentParams, currentRouteName]);
    (0, react_1.useEffect)(() => {
        if (!currentParams.context) {
            handleNavigate({ context: 'info' });
        }
    }, [currentParams.context, handleNavigate]);
    return handleNavigate;
};
exports.useContactRoute = useContactRoute;
