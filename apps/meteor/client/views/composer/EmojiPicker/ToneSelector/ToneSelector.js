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
const react_1 = __importStar(require("react"));
const ToneItem_1 = __importDefault(require("./ToneItem"));
const ToneSelector = ({ tone, setTone }) => {
    const options = (0, react_1.useMemo)(() => {
        const renderOption = (tone) => (0, jsx_runtime_1.jsx)(ToneItem_1.default, { tone: tone });
        const statuses = [
            [0, renderOption(0), tone === 0],
            [1, renderOption(1), tone === 1],
            [2, renderOption(2), tone === 2],
            [3, renderOption(3), tone === 3],
            [4, renderOption(4), tone === 4],
            [5, renderOption(5), tone === 5],
        ];
        return statuses;
    }, [tone]);
    const [cursor, handleKeyDown, handleKeyUp, reset, [visible, hide, show]] = (0, fuselage_1.useCursor)(-1, options, ([selected], [, hide]) => {
        setTone(selected);
        reset();
        hide();
    });
    const ref = (0, react_1.useRef)(null);
    const onClick = (0, react_1.useCallback)(() => {
        if (!(ref === null || ref === void 0 ? void 0 : ref.current)) {
            return;
        }
        ref.current.focus();
        show();
        ref.current.classList.add('focus-visible');
    }, [show]);
    const handleSelection = (0, react_1.useCallback)(([selected]) => {
        setTone(selected);
        reset();
        hide();
    }, [hide, reset, setTone]);
    (0, react_1.useEffect)(() => setTone(tone), [tone, setTone]);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { medium: true, ref: ref, onClick: onClick, onBlur: hide, onKeyUp: handleKeyUp, onKeyDown: handleKeyDown, mis: 4, icon: (0, jsx_runtime_1.jsx)(ToneItem_1.default, { tone: tone }) }), (0, jsx_runtime_1.jsx)(fuselage_1.PositionAnimated, { width: 'auto', visible: visible, anchor: ref, placement: 'left-middle', children: (0, jsx_runtime_1.jsx)(fuselage_1.Options, { onSelect: handleSelection, options: options, cursor: cursor }) })] }));
};
exports.default = ToneSelector;
