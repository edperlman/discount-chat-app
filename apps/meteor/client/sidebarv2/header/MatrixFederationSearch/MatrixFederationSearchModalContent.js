"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const FederatedRoomList_1 = __importDefault(require("./FederatedRoomList"));
const FederatedRoomListErrorBoundary_1 = __importDefault(require("./FederatedRoomListErrorBoundary"));
const MatrixFederationManageServerModal_1 = __importDefault(require("./MatrixFederationManageServerModal"));
const MatrixFederationSearch_1 = __importDefault(require("./MatrixFederationSearch"));
const MatrixFederationSearchModalContent = ({ defaultSelectedServer, servers }) => {
    const [serverName, setServerName] = (0, react_1.useState)(() => {
        var _a;
        const defaultServer = servers.find((server) => server.name === defaultSelectedServer);
        return (_a = defaultServer === null || defaultServer === void 0 ? void 0 : defaultServer.name) !== null && _a !== void 0 ? _a : servers[0].name;
    });
    const [roomName, setRoomName] = (0, react_1.useState)('');
    const setModal = (0, ui_contexts_1.useSetModal)();
    const debouncedRoomName = (0, fuselage_hooks_1.useDebouncedValue)(roomName, 400);
    const { t } = (0, react_i18next_1.useTranslation)();
    const serverOptions = (0, react_1.useMemo)(() => servers.map((server) => [server.name, server.name]), [servers]);
    const manageServers = (0, react_1.useCallback)(() => {
        setModal((0, jsx_runtime_1.jsx)(MatrixFederationManageServerModal_1.default, { onClickClose: () => setModal((0, jsx_runtime_1.jsx)(MatrixFederationSearch_1.default, { onClose: () => setModal(null) })) }));
    }, [setModal]);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { mie: 4, flexGrow: 0, flexShrink: 4, children: (0, jsx_runtime_1.jsx)(fuselage_1.Select, { options: serverOptions, value: serverName, onChange: (value) => setServerName(String(value)) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, { placeholder: t('Search_rooms'), flexGrow: 4, flexShrink: 0, value: roomName, onChange: (e) => setRoomName(e.currentTarget.value) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'a', display: 'flex', flexDirection: 'row', mbe: 16, onClick: manageServers, children: t('Manage_server_list') }), (0, jsx_runtime_1.jsx)(FederatedRoomListErrorBoundary_1.default, { children: (0, jsx_runtime_1.jsx)(FederatedRoomList_1.default, { serverName: serverName, roomName: debouncedRoomName }) })] }));
};
exports.default = MatrixFederationSearchModalContent;
