"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSendTelemetryMutation = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const useSendTelemetryMutation = () => {
    const sendTelemetry = (0, ui_contexts_1.useEndpoint)('POST', '/v1/statistics.telemetry');
    return (0, react_query_1.useMutation)(sendTelemetry, {
        onError: (error) => {
            console.warn(error);
        },
    });
};
exports.useSendTelemetryMutation = useSendTelemetryMutation;
