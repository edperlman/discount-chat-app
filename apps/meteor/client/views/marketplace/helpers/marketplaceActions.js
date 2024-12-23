"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.marketplaceActions = void 0;
const installApp_1 = require("./installApp");
const updateApp_1 = require("./updateApp");
exports.marketplaceActions = {
    purchase: installApp_1.installApp,
    install: installApp_1.installApp,
    update: updateApp_1.updateApp,
};
