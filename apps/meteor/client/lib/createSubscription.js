"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSubscription = void 0;
const createReactiveSubscriptionFactory_1 = require("./createReactiveSubscriptionFactory");
const createSubscription = function (getValue) {
    return (0, createReactiveSubscriptionFactory_1.createReactiveSubscriptionFactory)(getValue)();
};
exports.createSubscription = createSubscription;
