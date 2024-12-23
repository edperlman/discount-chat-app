"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIframeLogin = void 0;
const IframeLogin_1 = require("../../../../app/ui-utils/client/lib/IframeLogin");
const useReactiveValue_1 = require("../../../hooks/useReactiveValue");
const pollIframeLoginUrl = () => {
    if (!IframeLogin_1.iframeLogin.reactiveEnabled.get()) {
        return undefined;
    }
    return IframeLogin_1.iframeLogin.reactiveIframeUrl.get();
};
const useIframeLogin = () => (0, useReactiveValue_1.useReactiveValue)(pollIframeLoginUrl);
exports.useIframeLogin = useIframeLogin;
