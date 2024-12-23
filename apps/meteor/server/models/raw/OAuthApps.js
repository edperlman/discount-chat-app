"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuthAppsRaw = void 0;
const BaseRaw_1 = require("./BaseRaw");
class OAuthAppsRaw extends BaseRaw_1.BaseRaw {
    constructor(db, trash) {
        super(db, 'oauth_apps', trash);
    }
    modelIndexes() {
        return [{ key: { clientId: 1, clientSecret: 1 } }, { key: { appId: 1 } }];
    }
    findOneAuthAppByIdOrClientId(props, options) {
        return this.findOne(Object.assign(Object.assign(Object.assign({}, ('_id' in props && { _id: props._id })), ('appId' in props && { _id: props.appId })), ('clientId' in props && { clientId: props.clientId })), options);
    }
    findOneActiveByClientId(clientId, options) {
        return this.findOne({
            active: true,
            clientId,
        }, options);
    }
    findOneActiveByClientIdAndClientSecret(clientId, clientSecret, options) {
        return this.findOne({
            active: true,
            clientId,
            clientSecret,
        }, options);
    }
}
exports.OAuthAppsRaw = OAuthAppsRaw;
