"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCustomScript = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const fireGlobalEvent_1 = require("../../../lib/utils/fireGlobalEvent");
const useCustomScript = () => {
    const uid = (0, ui_contexts_1.useUserId)();
    (0, react_1.useEffect)(() => {
        if (uid) {
            (0, fireGlobalEvent_1.fireGlobalEvent)('Custom_Script_Logged_In');
            return;
        }
        (0, fireGlobalEvent_1.fireGlobalEvent)('Custom_Script_Logged_Out');
    }, [uid]);
};
exports.useCustomScript = useCustomScript;
