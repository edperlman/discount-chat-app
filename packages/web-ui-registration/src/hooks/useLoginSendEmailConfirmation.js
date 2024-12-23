"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLoginSendEmailConfirmation = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const useLoginSendEmailConfirmation = () => {
    return (0, react_query_1.useMutation)({
        mutationFn: (0, ui_contexts_1.useMethod)('sendConfirmationEmail'),
    });
};
exports.useLoginSendEmailConfirmation = useLoginSendEmailConfirmation;
