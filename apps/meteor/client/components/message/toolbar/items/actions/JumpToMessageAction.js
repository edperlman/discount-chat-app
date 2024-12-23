"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const setMessageJumpQueryStringParameter_1 = require("../../../../../lib/utils/setMessageJumpQueryStringParameter");
const MessageToolbarItem_1 = __importDefault(require("../../MessageToolbarItem"));
const JumpToMessageAction = ({ id, message }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsx)(MessageToolbarItem_1.default, { id: id, icon: 'jump', title: t('Jump_to_message'), qa: 'Jump_to_message', onClick: () => {
            (0, setMessageJumpQueryStringParameter_1.setMessageJumpQueryStringParameter)(message._id);
        } }));
};
exports.default = JumpToMessageAction;
