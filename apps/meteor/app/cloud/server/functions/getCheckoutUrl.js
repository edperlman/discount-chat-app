"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCheckoutUrl = exports.fallback = void 0;
const server_fetch_1 = require("@rocket.chat/server-fetch");
const getWorkspaceAccessToken_1 = require("./getWorkspaceAccessToken");
const syncWorkspace_1 = require("./syncWorkspace");
const system_1 = require("../../../../server/lib/logger/system");
const server_1 = require("../../../settings/server");
const getURL_1 = require("../../../utils/server/getURL");
exports.fallback = `https://go.rocket.chat/i/contact-sales`;
const getCheckoutUrl = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, syncWorkspace_1.syncWorkspace)();
        const token = yield (0, getWorkspaceAccessToken_1.getWorkspaceAccessTokenOrThrow)(true, 'workspace:billing', false);
        const subscriptionURL = (0, getURL_1.getURL)('admin/subscription', {
            full: true,
        });
        const body = {
            okCallback: `${subscriptionURL}?subscriptionSuccess=true`,
            cancelCallback: subscriptionURL,
        };
        const billingUrl = server_1.settings.get('Cloud_Billing_Url');
        const response = yield (0, server_fetch_1.serverFetch)(`${billingUrl}/api/v2/checkout`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body,
        });
        if (!response.ok) {
            throw new Error(yield response.json());
        }
        return response.json();
    }
    catch (err) {
        system_1.SystemLogger.error({
            msg: 'Failed to get Checkout URL with Rocket.Chat Billing Service',
            url: '/api/v2/checkout',
            err,
        });
        return {
            url: exports.fallback,
        };
    }
});
exports.getCheckoutUrl = getCheckoutUrl;
