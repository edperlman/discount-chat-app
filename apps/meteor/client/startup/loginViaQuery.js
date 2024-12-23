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
const meteor_1 = require("meteor/meteor");
const tracker_1 = require("meteor/tracker");
const RouterProvider_1 = require("../providers/RouterProvider");
meteor_1.Meteor.startup(() => {
    tracker_1.Tracker.afterFlush(() => {
        const { resumeToken } = RouterProvider_1.router.getSearchParameters();
        if (!resumeToken) {
            return;
        }
        meteor_1.Meteor.loginWithToken(resumeToken, () => {
            const routeName = RouterProvider_1.router.getRouteName();
            if (!routeName) {
                RouterProvider_1.router.navigate('/home');
            }
            const _a = RouterProvider_1.router.getSearchParameters(), { resumeToken: _, userId: __ } = _a, search = __rest(_a, ["resumeToken", "userId"]);
            RouterProvider_1.router.navigate({
                pathname: RouterProvider_1.router.getLocationPathname(),
                search,
            }, { replace: true });
        });
    });
});
