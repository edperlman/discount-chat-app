"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const meteor_1 = require("meteor/meteor");
const react_1 = require("react");
const SAMLLoginRoute = () => {
    const rootUrl = (0, ui_contexts_1.useAbsoluteUrl)()('');
    const router = (0, ui_contexts_1.useRouter)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    (0, react_1.useEffect)(() => {
        const { token } = router.getRouteParameters();
        const { redirectUrl } = router.getSearchParameters();
        meteor_1.Meteor.loginWithSamlToken(token, (error) => {
            if (error) {
                dispatchToastMessage({ type: 'error', message: error });
            }
            const decodedRedirectUrl = decodeURIComponent(redirectUrl || '');
            if (decodedRedirectUrl === null || decodedRedirectUrl === void 0 ? void 0 : decodedRedirectUrl.startsWith(rootUrl)) {
                const redirect = new URL(decodedRedirectUrl);
                router.navigate({
                    pathname: redirect.pathname,
                    search: Object.fromEntries(redirect.searchParams.entries()),
                }, { replace: true });
            }
            else {
                router.navigate({
                    pathname: '/home',
                }, { replace: true });
            }
        });
    }, [dispatchToastMessage, rootUrl, router]);
    return null;
};
exports.default = SAMLLoginRoute;
