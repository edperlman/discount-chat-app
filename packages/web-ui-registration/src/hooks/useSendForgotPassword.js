"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSendForgotPassword = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const useSendForgotPassword = () => {
    const sendForgotPassword = (0, ui_contexts_1.useEndpoint)('POST', '/v1/users.forgotPassword');
    return (0, react_query_1.useMutation)({
        mutationFn: sendForgotPassword,
    });
};
exports.useSendForgotPassword = useSendForgotPassword;
