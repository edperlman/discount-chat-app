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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const MatrixFederationRemoveServerList_1 = __importDefault(require("./MatrixFederationRemoveServerList"));
const MatrixFederationSearch_1 = __importDefault(require("./MatrixFederationSearch"));
const useMatrixServerList_1 = require("./useMatrixServerList");
const getErrorKey = (error) => {
    if (!error) {
        return;
    }
    if (error.error === 'invalid-server-name') {
        return 'Server_doesnt_exist';
    }
    if (error.error === 'invalid-server-name') {
        return 'Server_already_added';
    }
};
const MatrixFederationAddServerModal = ({ onClickClose }) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const addMatrixServer = (0, ui_contexts_1.useEndpoint)('POST', '/v1/federation/addServerByUser');
    const [serverName, setServerName] = (0, react_1.useState)('');
    const [errorKey, setErrorKey] = (0, react_1.useState)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const queryClient = (0, react_query_1.useQueryClient)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const { mutate: addServer, isLoading, isError, } = (0, react_query_1.useMutation)(['v1/federation/addServerByUser', serverName], () => addMatrixServer({ serverName }), {
        onSuccess: () => __awaiter(void 0, void 0, void 0, function* () {
            yield queryClient.invalidateQueries(['federation/listServersByUsers']);
            setModal((0, jsx_runtime_1.jsx)(MatrixFederationSearch_1.default, { defaultSelectedServer: serverName, onClose: onClickClose }, serverName));
        }),
        onError: (error) => {
            const errorKey = getErrorKey(error);
            if (!errorKey) {
                dispatchToastMessage({ type: 'error', message: error });
                return;
            }
            setErrorKey(errorKey);
        },
    });
    const { data, isLoading: isLoadingServerList } = (0, useMatrixServerList_1.useMatrixServerList)();
    const titleId = (0, fuselage_hooks_1.useUniqueId)();
    const serverNameId = (0, fuselage_hooks_1.useUniqueId)();
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Modal, { maxHeight: 'x600', open: true, "aria-labelledby": titleId, children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Modal.Header, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Modal.Title, { id: titleId, children: t('Manage_servers') }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Close, { onClick: onClickClose })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Modal.Content, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: serverNameId, children: t('Server_name') }), (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.TextInput, { id: serverNameId, disabled: isLoading, value: serverName, onChange: (e) => {
                                            setServerName(e.currentTarget.value);
                                            if (errorKey) {
                                                setErrorKey(undefined);
                                            }
                                        }, mie: 4 }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, loading: isLoading, onClick: () => addServer(), children: t('Add') })] }), isError && errorKey && (0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { children: t(errorKey) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { children: t('Federation_Example_matrix_server') })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Divider, { mb: 16 }), !isLoadingServerList && (data === null || data === void 0 ? void 0 : data.servers) && (0, jsx_runtime_1.jsx)(MatrixFederationRemoveServerList_1.default, { servers: data.servers })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Footer, { children: (0, jsx_runtime_1.jsx)(fuselage_1.ButtonGroup, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: onClickClose, children: t('Cancel') }) }) })] }));
};
exports.default = MatrixFederationAddServerModal;
