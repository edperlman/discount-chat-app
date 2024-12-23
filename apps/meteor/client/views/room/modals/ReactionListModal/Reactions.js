"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const ReactionUserTag_1 = __importDefault(require("./ReactionUserTag"));
const Emoji_1 = __importDefault(require("../../../../components/Emoji"));
const Reactions = ({ reactions }) => {
    const useRealName = (0, ui_contexts_1.useSetting)('UI_Use_Real_Name');
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', flexDirection: 'column', children: Object.entries(reactions).map(([reaction, { names = [], usernames }]) => ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', alignItems: 'center', flexDirection: 'row', overflowX: 'hidden', mb: 8, children: [(0, jsx_runtime_1.jsx)(Emoji_1.default, { emojiHandle: reaction }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', flexWrap: 'wrap', paddingBlock: 4, mis: 4, children: usernames.map((username, i) => ((0, jsx_runtime_1.jsx)(ReactionUserTag_1.default, { displayName: useRealName ? names[i] || username : username }, username))) })] }, reaction))) }));
};
exports.default = Reactions;
