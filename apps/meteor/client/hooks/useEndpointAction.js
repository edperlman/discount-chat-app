"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEndpointAction = useEndpointAction;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
function useEndpointAction(method, pathPattern, options = { keys: {} }) {
    const sendData = (0, ui_contexts_1.useEndpoint)(method, pathPattern, options.keys);
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const mutation = (0, react_query_1.useMutation)(sendData, {
        onSuccess: () => {
            if (options.successMessage) {
                dispatchToastMessage({ type: 'success', message: options.successMessage });
            }
        },
        onError: (error) => {
            dispatchToastMessage({ type: 'error', message: error });
        },
    });
    return mutation.mutateAsync;
}
