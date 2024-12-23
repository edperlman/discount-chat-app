"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const clampLine = (0, css_in_js_1.css) `
	line-clamp: 6;
`;
const FederatedRoomListItem = ({ name, topic, canonicalAlias, joinedMembers, onClickJoin, canJoin, disabled, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const nameId = (0, fuselage_hooks_1.useUniqueId)();
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { mb: 16, pi: 24, is: 'li', display: 'flex', flexDirection: 'column', w: 'full', name: canonicalAlias, "aria-labelledby": nameId, children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', mbe: 4, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { flexGrow: 1, flexShrink: 1, fontScale: 'p1', fontWeight: 'bold', title: name, withTruncatedText: true, id: nameId, children: name }), canJoin && ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, flexShrink: 0, onClick: onClickJoin, disabled: disabled, small: true, children: t('Join') })), !canJoin && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { flexShrink: 0, color: 'danger', title: t('Currently_we_dont_support_joining_servers_with_this_many_people'), children: t('Cant_join') }))] }), topic && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'p', fontScale: 'c1', mb: 4, maxHeight: 'x120', overflow: 'hidden', withTruncatedText: true, className: [clampLine], children: topic })), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { mbs: 4, fontScale: 'micro', fontWeight: 'bolder', verticalAlign: 'top', children: [canonicalAlias, ' ', (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { color: 'hint', is: 'span', verticalAlign: 'top', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'user', size: 'x12', mbe: 2 }), joinedMembers] })] })] }));
};
exports.default = FederatedRoomListItem;
