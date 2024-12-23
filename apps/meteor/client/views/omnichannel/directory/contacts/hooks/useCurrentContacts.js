"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCurrentContacts = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const useCurrentContacts = (query) => {
    const currentContacts = (0, ui_contexts_1.useEndpoint)('GET', '/v1/omnichannel/contacts.search');
    return (0, react_query_1.useQuery)(['current-contacts', query], () => currentContacts(query));
};
exports.useCurrentContacts = useCurrentContacts;
