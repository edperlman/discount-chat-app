"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const getNodeFileSize_1 = require("./lib/getNodeFileSize");
const getNodeIconType_1 = require("./lib/getNodeIconType");
const GenericNoResults_1 = __importDefault(require("../../../../components/GenericNoResults"));
const GenericTable_1 = require("../../../../components/GenericTable");
const timeAgo_1 = require("../../../../lib/utils/timeAgo");
const WebdavFilePickerTable = ({ webdavNodes, sortBy, sortDirection, onSort, onNodeClick, isLoading, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'column', overflowY: 'hidden', height: 'x256', children: [(isLoading || (webdavNodes === null || webdavNodes === void 0 ? void 0 : webdavNodes.length) > 0) && ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTable, { children: [(0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTableHeader, { children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { width: '300px', direction: sortDirection, active: sortBy === 'name', onClick: onSort, sort: 'name', children: t('Name') }, 'name'), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { direction: sortDirection, active: sortBy === 'size', onClick: onSort, sort: 'size', children: t('Size') }, 'size'), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { direction: sortDirection, active: sortBy === 'dataModified', onClick: onSort, sort: 'dataModified', children: t('Data_modified') }, 'dataModified')] }), (0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTableBody, { children: [isLoading &&
                                Array(5)
                                    .fill('')
                                    .map((_, index) => (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableLoadingRow, { cols: 3 }, index)), !isLoading &&
                                (webdavNodes === null || webdavNodes === void 0 ? void 0 : webdavNodes.map((webdavNode, index) => {
                                    const { icon } = (0, getNodeIconType_1.getNodeIconType)(webdavNode.basename, webdavNode.type, webdavNode.mime);
                                    return ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTableRow, { onClick: () => onNodeClick(webdavNode), tabIndex: index, role: 'link', action: true, children: [(0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTableCell, { fontScale: 'p2', color: 'default', w: 'x200', display: 'flex', alignItems: 'center', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Icon, { mie: 4, size: 'x20', name: icon }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { withTruncatedText: true, children: webdavNode.basename })] }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { fontScale: 'p2', color: 'default', children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { withTruncatedText: true, children: (0, getNodeFileSize_1.getNodeFileSize)(webdavNode.type, webdavNode === null || webdavNode === void 0 ? void 0 : webdavNode.size) }) }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { fontScale: 'p2', color: 'default', children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { withTruncatedText: true, children: (0, timeAgo_1.timeAgo)(new Date()) }) })] }, index));
                                }))] })] })), !isLoading && (webdavNodes === null || webdavNodes === void 0 ? void 0 : webdavNodes.length) === 0 && (0, jsx_runtime_1.jsx)(GenericNoResults_1.default, {})] }));
};
exports.default = WebdavFilePickerTable;
