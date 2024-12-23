"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuditMutation = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const useAuditMutation = (type) => {
    const getAuditMessages = (0, ui_contexts_1.useMethod)('auditGetMessages');
    const getOmnichannelAuditMessages = (0, ui_contexts_1.useMethod)('auditGetOmnichannelMessages');
    return (0, react_query_1.useMutation)(['audit'], (_a) => __awaiter(void 0, [_a], void 0, function* ({ msg, dateRange, rid, users, visitor, agent }) {
        var _b, _c, _d, _e;
        if (type === 'l') {
            return getOmnichannelAuditMessages({
                type,
                msg,
                startDate: (_b = dateRange.start) !== null && _b !== void 0 ? _b : new Date(0),
                endDate: (_c = dateRange.end) !== null && _c !== void 0 ? _c : new Date(),
                users,
                visitor: '',
                agent: '',
            });
        }
        return getAuditMessages({
            type,
            msg,
            startDate: (_d = dateRange.start) !== null && _d !== void 0 ? _d : new Date(0),
            endDate: (_e = dateRange.end) !== null && _e !== void 0 ? _e : new Date(),
            rid,
            users,
            visitor,
            agent,
        });
    }));
};
exports.useAuditMutation = useAuditMutation;
