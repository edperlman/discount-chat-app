"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLivechatTags = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const useOmnichannel_1 = require("../../../hooks/omnichannel/useOmnichannel");
const useLivechatTags = (options) => {
    const getTags = (0, ui_contexts_1.useEndpoint)('GET', '/v1/livechat/tags');
    const { isEnterprise } = (0, useOmnichannel_1.useOmnichannel)();
    const { department, text, viewAll } = options;
    return (0, react_query_1.useQuery)(['/v1/livechat/tags', text, department], () => getTags(Object.assign(Object.assign({ text: text || '' }, (department && { department })), { viewAll: viewAll ? 'true' : 'false' })), {
        enabled: isEnterprise,
    });
};
exports.useLivechatTags = useLivechatTags;
