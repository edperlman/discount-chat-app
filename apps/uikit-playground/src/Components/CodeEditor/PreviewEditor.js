"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = require("react");
const Context_1 = require("../../Context");
const useCodeMirror_1 = __importDefault(require("../../hooks/useCodeMirror"));
const intendCode_1 = __importDefault(require("../../utils/intendCode"));
const PreviewEditor = ({ extensions }) => {
    var _a, _b;
    const { state: { screens, activeScreen }, } = (0, react_1.useContext)(Context_1.context);
    const { editor, setValue } = (0, useCodeMirror_1.default)(extensions, (0, intendCode_1.default)((_a = screens[activeScreen]) === null || _a === void 0 ? void 0 : _a.actionPreview));
    (0, react_1.useEffect)(() => {
        var _a;
        setValue((0, intendCode_1.default)((_a = screens[activeScreen]) === null || _a === void 0 ? void 0 : _a.actionPreview), {});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [(_b = screens[activeScreen]) === null || _b === void 0 ? void 0 : _b.actionPreview]);
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: "grid", height: "100%", width: '100%', ref: editor }) }));
};
exports.default = PreviewEditor;
