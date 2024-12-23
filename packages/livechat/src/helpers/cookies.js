"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCookies = exports.setInitCookies = void 0;
const api_1 = require("../api");
// This will allow widgets that are on different domains to send cookies to the server
// The default config for same-site (lax) dissalows to send a cookie to a "3rd party" unless the user performs an action
// like a click. Secure flag is required when SameSite is set to None
const getSecureCookieSettings = () => (api_1.useSsl ? 'SameSite=None; Secure;' : '');
const setInitCookies = () => {
    document.cookie = `rc_is_widget=t; path=/; ${getSecureCookieSettings()}`;
    document.cookie = `rc_room_type=l; path=/; ${getSecureCookieSettings()}`;
};
exports.setInitCookies = setInitCookies;
const setCookies = (rid, token) => {
    document.cookie = `rc_rid=${rid}; path=/; ${getSecureCookieSettings()}`;
    document.cookie = `rc_token=${token}; path=/; ${getSecureCookieSettings()}`;
    document.cookie = `rc_room_type=l; path=/; ${getSecureCookieSettings()}`;
};
exports.setCookies = setCookies;
