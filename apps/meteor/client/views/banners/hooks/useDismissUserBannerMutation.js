"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDismissUserBannerMutation = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const useDismissUserBannerMutation = () => {
    const dismissBanner = (0, ui_contexts_1.useMethod)('banner/dismiss');
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    return (0, react_query_1.useMutation)(dismissBanner, {
        onError: (error) => {
            dispatchToastMessage({ type: 'error', message: error });
        },
    });
};
exports.useDismissUserBannerMutation = useDismissUserBannerMutation;
