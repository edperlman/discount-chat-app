"use strict";
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
exports.MultiSelectCustom = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = require("react");
const MultiSelectCustomAnchor_1 = __importDefault(require("./MultiSelectCustomAnchor"));
const MultiSelectCustomList_1 = __importDefault(require("./MultiSelectCustomList"));
const MultiSelectCustomListWrapper_1 = __importDefault(require("./MultiSelectCustomListWrapper"));
const isValidReference = (reference, e) => {
    var _a;
    const isValidTarget = Boolean(e.target);
    const isValidReference = e.target !== reference.current && !((_a = reference.current) === null || _a === void 0 ? void 0 : _a.contains(e.target));
    return isValidTarget && isValidReference;
};
const onMouseEventPreventSideEffects = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
};
const MultiSelectCustom = (_a) => {
    var { dropdownOptions, defaultTitle, selectedOptionsTitle, selectedOptions, setSelectedOptions, searchBarText } = _a, props = __rest(_a, ["dropdownOptions", "defaultTitle", "selectedOptionsTitle", "selectedOptions", "setSelectedOptions", "searchBarText"]);
    const reference = (0, react_1.useRef)(null);
    const target = (0, react_1.useRef)(null);
    const [collapsed, toggleCollapsed] = (0, fuselage_hooks_1.useToggle)(false);
    const onClose = (0, react_1.useCallback)((e) => {
        if (isValidReference(reference, e)) {
            toggleCollapsed(false);
            return;
        }
        onMouseEventPreventSideEffects(e);
    }, [toggleCollapsed]);
    (0, fuselage_hooks_1.useOutsideClick)([target], onClose);
    const onSelect = (0, react_1.useCallback)((selectedOption, e) => {
        e === null || e === void 0 ? void 0 : e.stopPropagation();
        if (selectedOption.hasOwnProperty('checked')) {
            selectedOption.checked = !selectedOption.checked;
            if (selectedOption.checked) {
                setSelectedOptions([...new Set([...selectedOptions, selectedOption])]);
                return;
            }
            // the user has disabled this option -> remove this from the selected options list
            setSelectedOptions(selectedOptions.filter((option) => option.id !== selectedOption.id));
        }
    }, [selectedOptions, setSelectedOptions]);
    const selectedOptionsCount = dropdownOptions.filter((option) => option.hasOwnProperty('checked') && option.checked).length;
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', position: 'relative', children: [(0, jsx_runtime_1.jsx)(MultiSelectCustomAnchor_1.default, Object.assign({ ref: reference, collapsed: collapsed, onClick: () => toggleCollapsed(!collapsed), onKeyDown: (e) => (e.code === 'Enter' || e.code === 'Space') && toggleCollapsed(!collapsed), defaultTitle: defaultTitle, selectedOptionsTitle: selectedOptionsTitle, selectedOptionsCount: selectedOptionsCount, maxCount: dropdownOptions.length }, props)), collapsed && ((0, jsx_runtime_1.jsx)(MultiSelectCustomListWrapper_1.default, { ref: target, children: (0, jsx_runtime_1.jsx)(MultiSelectCustomList_1.default, { options: dropdownOptions, onSelected: onSelect, searchBarText: searchBarText }) }))] }));
};
exports.MultiSelectCustom = MultiSelectCustom;
