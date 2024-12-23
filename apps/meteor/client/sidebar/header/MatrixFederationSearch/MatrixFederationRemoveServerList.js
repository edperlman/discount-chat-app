"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importDefault(require("react"));
const style = (0, css_in_js_1.css) `
	i {
		visibility: hidden;
	}
	li {
		cursor: default;
	}
	li:hover {
		i {
			cursor: pointer;
			visibility: visible;
		}
	}
`;
const MatrixFederationRemoveServerList = ({ servers }) => {
    const removeMatrixServer = (0, ui_contexts_1.useEndpoint)('POST', '/v1/federation/removeServerByUser');
    const queryClient = (0, react_query_1.useQueryClient)();
    const { mutate: removeServer, isLoading: isRemovingServer } = (0, react_query_1.useMutation)(['federation/removeServerByUser'], (serverName) => removeMatrixServer({ serverName }), { onSuccess: () => queryClient.invalidateQueries(['federation/listServersByUsers']) });
    const t = (0, ui_contexts_1.useTranslation)();
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'column', className: [style], children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'h2', fontScale: 'p1', fontWeight: 'bolder', children: t('Servers') }), servers.map(({ name, default: isDefault }) => ((0, jsx_runtime_1.jsx)(fuselage_1.Option, { title: name, label: name, children: !isDefault && ((0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { icon: 'cross', tiny: true, danger: !isRemovingServer, disabled: isRemovingServer, "aria-label": t('Remove'), onClick: () => removeServer(name) })) }, name)))] }));
};
exports.default = MatrixFederationRemoveServerList;
