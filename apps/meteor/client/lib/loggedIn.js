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
exports.onLoggedIn = exports.whenLoggedIn = void 0;
const accounts_base_1 = require("meteor/accounts-base");
const meteor_1 = require("meteor/meteor");
const tracker_1 = require("meteor/tracker");
const isLoggedIn = () => {
    const uid = tracker_1.Tracker.nonreactive(() => meteor_1.Meteor.userId());
    return uid !== null;
};
const whenLoggedIn = () => {
    if (isLoggedIn()) {
        return Promise.resolve();
    }
    return new Promise((resolve) => {
        const subscription = accounts_base_1.Accounts.onLogin(() => {
            subscription.stop();
            resolve();
        });
    });
};
exports.whenLoggedIn = whenLoggedIn;
const onLoggedIn = (cb) => {
    let cleanup;
    const handler = () => __awaiter(void 0, void 0, void 0, function* () {
        cleanup === null || cleanup === void 0 ? void 0 : cleanup();
        const ret = yield cb();
        if (typeof ret === 'function') {
            cleanup = ret;
        }
    });
    const subscription = accounts_base_1.Accounts.onLogin(handler);
    if (isLoggedIn())
        handler();
    return () => {
        subscription.stop();
        cleanup === null || cleanup === void 0 ? void 0 : cleanup();
    };
};
exports.onLoggedIn = onLoggedIn;
