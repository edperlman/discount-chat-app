"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const FileItemIcon_1 = __importDefault(require("./FileItemIcon"));
const FileItemMenu_1 = __importDefault(require("./FileItemMenu"));
const ImageItem_1 = __importDefault(require("./ImageItem"));
const useDownloadFromServiceWorker_1 = require("../../../../../hooks/useDownloadFromServiceWorker");
const useFormatDateAndTime_1 = require("../../../../../hooks/useFormatDateAndTime");
const hoverClass = (0, css_in_js_1.css) `
	&:hover {
		cursor: pointer;
		background: ${fuselage_1.Palette.surface['surface-hover']};
	}
`;
const FileItem = ({ fileData, onClickDelete }) => {
    const format = (0, useFormatDateAndTime_1.useFormatDateAndTime)();
    const { _id, path, name, uploadedAt, type, typeGroup, user } = fileData;
    const encryptedAnchorProps = (0, useDownloadFromServiceWorker_1.useDownloadFromServiceWorker)(path || '', name);
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', pb: 12, pi: 24, borderRadius: 4, className: hoverClass, children: [typeGroup === 'image' ? ((0, jsx_runtime_1.jsx)(ImageItem_1.default, { id: _id, url: path, name: name, username: user === null || user === void 0 ? void 0 : user.username, timestamp: format(uploadedAt) })) : ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, Object.assign({ is: 'a', minWidth: 0, download: true, rel: 'noopener noreferrer', target: '_blank', title: name, display: 'flex', flexGrow: 1, flexShrink: 1, href: path, textDecorationLine: 'none' }, ((path === null || path === void 0 ? void 0 : path.includes('/file-decrypt/')) ? encryptedAnchorProps : {}), { children: [(0, jsx_runtime_1.jsx)(FileItemIcon_1.default, { type: type }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { mis: 8, flexShrink: 1, overflow: 'hidden', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { withTruncatedText: true, color: 'default', fontScale: 'p2m', children: name }), (user === null || user === void 0 ? void 0 : user.username) && ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { withTruncatedText: true, color: 'hint', fontScale: 'p2', children: ["@", user === null || user === void 0 ? void 0 : user.username] })), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { color: 'hint', fontScale: 'micro', children: format(uploadedAt) })] })] }))), (0, jsx_runtime_1.jsx)(FileItemMenu_1.default, { fileData: fileData, onClickDelete: onClickDelete })] }));
};
exports.default = FileItem;
