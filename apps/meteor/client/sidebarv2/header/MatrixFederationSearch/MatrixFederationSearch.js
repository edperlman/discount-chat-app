"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const MatrixFederationSearchModalContent_1 = __importDefault(require("./MatrixFederationSearchModalContent"));
const useMatrixServerList_1 = require("./useMatrixServerList");
const MatrixFederationSearch = ({ onClose, defaultSelectedServer }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { data, isLoading } = (0, useMatrixServerList_1.useMatrixServerList)();
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Modal, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Modal.Header, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Modal.Title, { children: t('Federation_Federated_room_search') }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Close, { onClick: onClose })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Modal.Content, { display: 'flex', flexDirection: 'column', children: [isLoading && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, {}), (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, {}), (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, {}), (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, {})] })), !isLoading && (data === null || data === void 0 ? void 0 : data.servers) && ((0, jsx_runtime_1.jsx)(MatrixFederationSearchModalContent_1.default, { defaultSelectedServer: defaultSelectedServer, servers: data.servers }))] }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Footer, {})] }));
};
exports.default = MatrixFederationSearch;
