"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const OmnichannelVerificationTag_1 = __importDefault(require("../../../omnichannel/components/OmnichannelVerificationTag"));
const AdvancedContactModal_1 = __importDefault(require("../../../omnichannel/contactInfo/AdvancedContactModal"));
const RoomContext_1 = require("../../contexts/RoomContext");
const OmnichannelRoomHeaderTag = () => {
    const setModal = (0, ui_contexts_1.useSetModal)();
    const { verified } = (0, RoomContext_1.useOmnichannelRoom)();
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { mis: 4, withTruncatedText: true, children: (0, jsx_runtime_1.jsx)(OmnichannelVerificationTag_1.default, { verified: verified, onClick: () => setModal((0, jsx_runtime_1.jsx)(AdvancedContactModal_1.default, { onCancel: () => setModal(null) })) }) }));
};
exports.default = OmnichannelRoomHeaderTag;
