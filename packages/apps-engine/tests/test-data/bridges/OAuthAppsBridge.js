"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestOAuthAppsBridge = void 0;
const OAuthAppsBridge_1 = require("../../../src/server/bridges/OAuthAppsBridge");
class TestOAuthAppsBridge extends OAuthAppsBridge_1.OAuthAppsBridge {
    create(oAuthApp, appId) {
        throw new Error('Method not implemented.');
    }
    getById(id, appId) {
        throw new Error('Method not implemented.');
    }
    getByName(name, appId) {
        throw new Error('Method not implemented.');
    }
    update(oAuthApp, id, appId) {
        throw new Error('Method not implemented.');
    }
    delete(id, appId) {
        throw new Error('Method not implemented.');
    }
    purge(appId) {
        throw new Error('Method not implemented.');
    }
}
exports.TestOAuthAppsBridge = TestOAuthAppsBridge;
