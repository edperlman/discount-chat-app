"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const AttachmentsItem_1 = __importDefault(require("./attachments/AttachmentsItem"));
const Attachments = ({ attachments, id }) => {
    return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: attachments === null || attachments === void 0 ? void 0 : attachments.map((attachment, index) => (0, jsx_runtime_1.jsx)(AttachmentsItem_1.default, { id: id, attachment: Object.assign({}, attachment) }, index)) });
};
exports.default = Attachments;
