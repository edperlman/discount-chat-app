"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unescapeExternalFederationEventId = exports.escapeExternalFederationEventId = void 0;
const escapeExternalFederationEventId = (externalEventId) => {
    return externalEventId.replace(/\$/g, '__sign__');
};
exports.escapeExternalFederationEventId = escapeExternalFederationEventId;
const unescapeExternalFederationEventId = (externalEventId) => {
    return externalEventId.replace(/__sign__/g, '$');
};
exports.unescapeExternalFederationEventId = unescapeExternalFederationEventId;
