"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuditForm = void 0;
const react_hook_form_1 = require("react-hook-form");
const dateRange_1 = require("../utils/dateRange");
const useAuditForm = () => {
    return (0, react_hook_form_1.useForm)({
        defaultValues: {
            msg: '',
            dateRange: {
                start: (0, dateRange_1.createStartOfToday)(),
                end: (0, dateRange_1.createEndOfToday)(),
            },
            rid: undefined,
            users: [],
            visitor: undefined,
            agent: undefined,
        },
    });
};
exports.useAuditForm = useAuditForm;
