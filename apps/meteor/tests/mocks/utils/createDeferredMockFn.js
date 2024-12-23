"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createDeferredPromise() {
    let resolve;
    let reject;
    const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    });
    return { promise, resolve, reject };
}
function createDeferredMockFn() {
    const deferred = createDeferredPromise();
    const fn = jest.fn(() => deferred.promise);
    return Object.assign(Object.assign({}, deferred), { fn });
}
exports.default = createDeferredMockFn;
