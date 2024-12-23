"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const WebdavFilePickerGridItem_1 = __importDefault(require("./WebdavFilePickerGridItem"));
const GenericNoResults_1 = __importDefault(require("../../../../../components/GenericNoResults"));
const getNodeIconType_1 = require("../lib/getNodeIconType");
const WebdavFilePickerGrid = ({ webdavNodes, onNodeClick, isLoading }) => {
    const hoverStyle = (0, css_in_js_1.css) `
		&:hover {
			background-color: ${fuselage_1.Palette.surface['surface-neutral']};
			cursor: pointer;
		}
	`;
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexWrap: 'wrap', children: [isLoading &&
                Array(6)
                    .fill('')
                    .map((_, index) => ((0, jsx_runtime_1.jsx)(WebdavFilePickerGridItem_1.default, { p: 4, children: (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { variant: 'rect', width: 'full', height: 'full' }) }, index))), !isLoading &&
                webdavNodes.map((webdavNode, index) => {
                    const { icon } = (0, getNodeIconType_1.getNodeIconType)(webdavNode.basename, webdavNode.type, webdavNode.mime);
                    return ((0, jsx_runtime_1.jsxs)(WebdavFilePickerGridItem_1.default, { className: hoverStyle, onClick: () => onNodeClick(webdavNode), children: [(0, jsx_runtime_1.jsx)(fuselage_1.Icon, { mie: 4, size: 'x72', name: icon }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { textAlign: 'center', children: webdavNode.basename })] }, index));
                }), !isLoading && (webdavNodes === null || webdavNodes === void 0 ? void 0 : webdavNodes.length) === 0 && (0, jsx_runtime_1.jsx)(GenericNoResults_1.default, {})] }));
};
exports.default = WebdavFilePickerGrid;
