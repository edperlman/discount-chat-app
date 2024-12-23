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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = __importStar(require("react"));
const isValidReference_1 = require("../../helpers/isValidReference");
const onMouseEventPreventSideEffects_1 = require("../../helpers/onMouseEventPreventSideEffects");
const DropDownListWrapper_1 = __importDefault(require("../DropDownListWrapper"));
const RadioButtonList_1 = __importDefault(require("../RadioButtonList"));
const RadioDownAnchor_1 = __importDefault(require("./RadioDownAnchor"));
const RadioDropDown = (_a) => {
    var { group, onSelected } = _a, props = __rest(_a, ["group", "onSelected"]);
    const reference = (0, react_1.useRef)(null);
    const [collapsed, toggleCollapsed] = (0, fuselage_hooks_1.useToggle)(false);
    const onClose = (0, react_1.useCallback)((e) => {
        if ((0, isValidReference_1.isValidReference)(reference, e)) {
            toggleCollapsed(false);
            return;
        }
        (0, onMouseEventPreventSideEffects_1.onMouseEventPreventSideEffects)(e);
        return false;
    }, [toggleCollapsed]);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(RadioDownAnchor_1.default, Object.assign({ ref: reference, group: group, onClick: toggleCollapsed }, props)), collapsed && ((0, jsx_runtime_1.jsx)(DropDownListWrapper_1.default, { ref: reference, onClose: onClose, children: (0, jsx_runtime_1.jsx)(RadioButtonList_1.default, { group: group, onSelected: onSelected }) }))] }));
};
exports.default = RadioDropDown;
