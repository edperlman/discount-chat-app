"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = __importDefault(require("react"));
const MessageAction_1 = __importDefault(require("./actions/MessageAction"));
const actionLinks_1 = require("../../../lib/actionLinks");
const MessageActions = ({ message, actions }) => {
    var _a;
    const runAction = (0, fuselage_hooks_1.useMutableCallback)((action) => () => {
        actionLinks_1.actionLinks.run(action, message);
    });
    const alignment = ((_a = actions[0]) === null || _a === void 0 ? void 0 : _a.actionLinksAlignment) || 'center';
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', mb: 4, mi: -4, width: 'full', justifyContent: alignment, children: (0, jsx_runtime_1.jsx)(fuselage_1.ButtonGroup, { align: 'center', children: actions.map((action, key) => ((0, jsx_runtime_1.jsx)(MessageAction_1.default, Object.assign({ runAction: runAction }, action), key))) }) }));
};
exports.default = MessageActions;
