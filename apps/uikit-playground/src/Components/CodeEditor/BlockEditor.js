"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = require("react");
const Context_1 = require("../../Context");
const useCodeMirror_1 = __importDefault(require("../../hooks/useCodeMirror"));
const intendCode_1 = __importDefault(require("../../utils/intendCode"));
const useFormatCodeMirrorValue_1 = __importDefault(require("../../hooks/useFormatCodeMirrorValue"));
const BlockEditor = ({ extensions }) => {
    var _a, _b, _c;
    const { state: { screens, activeScreen }, dispatch, } = (0, react_1.useContext)(Context_1.context);
    const { editor, changes, setValue } = (0, useCodeMirror_1.default)(extensions, (0, intendCode_1.default)((_a = screens[activeScreen]) === null || _a === void 0 ? void 0 : _a.payload));
    const debounceValue = (0, fuselage_hooks_1.useDebouncedValue)(changes, 1500);
    (0, useFormatCodeMirrorValue_1.default)((parsedCode, prettifiedCode) => {
        dispatch((0, Context_1.updatePayloadAction)({
            blocks: parsedCode.blocks,
            surface: parsedCode.surface,
        }));
        setValue(prettifiedCode.formatted, {
            cursor: prettifiedCode.cursorOffset,
        });
    }, debounceValue);
    (0, react_1.useEffect)(() => {
        var _a, _b;
        if (!((_a = screens[activeScreen]) === null || _a === void 0 ? void 0 : _a.changedByEditor)) {
            setValue((0, intendCode_1.default)((_b = screens[activeScreen]) === null || _b === void 0 ? void 0 : _b.payload), {});
        }
    }, [
        (_b = screens[activeScreen]) === null || _b === void 0 ? void 0 : _b.payload.blocks,
        (_c = screens[activeScreen]) === null || _c === void 0 ? void 0 : _c.payload.surface,
        activeScreen,
    ]);
    (0, react_1.useEffect)(() => {
        var _a;
        setValue((0, intendCode_1.default)((_a = screens[activeScreen]) === null || _a === void 0 ? void 0 : _a.payload), {});
    }, [activeScreen]);
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: "grid", height: "100%", width: '100%', ref: editor }) }));
};
exports.default = BlockEditor;
