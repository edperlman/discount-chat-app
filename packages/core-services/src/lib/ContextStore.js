"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsyncContextStore = void 0;
const async_hooks_1 = require("async_hooks");
// This is the default implementation of the context store but there is a bug on Meteor 2.5 that prevents us from using it
class AsyncContextStore extends async_hooks_1.AsyncLocalStorage {
}
exports.AsyncContextStore = AsyncContextStore;
