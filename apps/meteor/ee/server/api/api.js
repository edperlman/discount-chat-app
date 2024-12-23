"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable react-hooks/rules-of-hooks */
const license_1 = require("@rocket.chat/license");
const api_1 = require("../../../app/api/server/api");
const Middleware_1 = require("../../../app/settings/server/Middleware");
// Overwrites two factor method to enforce 2FA check for enterprise APIs when
// no license was provided to prevent abuse on enterprise APIs.
const isNonEnterpriseTwoFactorOptions = (options) => !!options && 'forceTwoFactorAuthenticationForNonEnterprise' in options && Boolean(options.forceTwoFactorAuthenticationForNonEnterprise);
api_1.API.v1.processTwoFactor = (0, Middleware_1.use)(api_1.API.v1.processTwoFactor, ([params, ...context], next) => {
    if (isNonEnterpriseTwoFactorOptions(params.options) && !license_1.License.hasValidLicense()) {
        const options = Object.assign(Object.assign({}, params.options), { twoFactorOptions: {
                disableRememberMe: true,
                requireSecondFactor: true,
                disablePasswordFallback: false,
            }, twoFactorRequired: true, authRequired: true });
        return next(Object.assign(Object.assign({}, params), { options }), ...context);
    }
    return next(params, ...context);
});
