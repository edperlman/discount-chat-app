"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLayoutEmbedded = void 0;
const RouterProvider_1 = require("../../providers/RouterProvider");
let embedded = false;
RouterProvider_1.router.subscribeToRouteChange(() => {
    embedded = RouterProvider_1.router.getSearchParameters().layout === 'embedded';
});
const isLayoutEmbedded = () => embedded;
exports.isLayoutEmbedded = isLayoutEmbedded;
