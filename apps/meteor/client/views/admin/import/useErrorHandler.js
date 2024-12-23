"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useErrorHandler = void 0;
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const useErrorHandler = () => {
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    return (0, fuselage_hooks_1.useMutableCallback)((error, defaultMessage) => {
        console.error(error);
        dispatchToastMessage({ type: 'error', message: error !== null && error !== void 0 ? error : defaultMessage });
    });
};
exports.useErrorHandler = useErrorHandler;
