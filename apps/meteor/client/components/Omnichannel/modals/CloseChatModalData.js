"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importDefault(require("react"));
const Skeleton_1 = require("../Skeleton");
const CloseChatModal_1 = __importDefault(require("./CloseChatModal"));
const CloseChatModalData = ({ departmentId, visitorEmail, onCancel, onConfirm, }) => {
    const getDepartment = (0, ui_contexts_1.useEndpoint)('GET', '/v1/livechat/department/:_id', { _id: departmentId });
    const { data, isLoading } = (0, react_query_1.useQuery)(['/v1/livechat/department/:_id', departmentId], () => getDepartment({}));
    if (isLoading) {
        return (0, jsx_runtime_1.jsx)(Skeleton_1.FormSkeleton, {});
    }
    return (0, jsx_runtime_1.jsx)(CloseChatModal_1.default, { onCancel: onCancel, onConfirm: onConfirm, visitorEmail: visitorEmail, department: data === null || data === void 0 ? void 0 : data.department });
};
exports.default = CloseChatModalData;
