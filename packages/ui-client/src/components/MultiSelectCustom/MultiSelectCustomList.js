"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const useFilteredOptions_1 = require("./useFilteredOptions");
const MultiSelectCustomList = ({ options, onSelected, searchBarText, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const [text, setText] = (0, react_1.useState)('');
    const handleChange = (0, react_1.useCallback)((event) => setText(event.currentTarget.value), []);
    const filteredOptions = (0, useFilteredOptions_1.useFilteredOptions)(text, options);
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Tile, { overflow: 'auto', pb: 12, pi: 0, elevation: '2', w: 'full', bg: 'light', borderRadius: 2, maxHeight: '50vh', children: [searchBarText && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { pi: 12, mbe: 12, children: (0, jsx_runtime_1.jsx)(fuselage_1.SearchInput, { name: 'select-search', placeholder: t(searchBarText), autoComplete: 'off', addon: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'magnifier', size: 'x20' }), onChange: handleChange, value: text }) })), filteredOptions.map((option) => ((0, jsx_runtime_1.jsx)(react_1.Fragment, { children: option.isGroupTitle || !option.hasOwnProperty('checked') ? ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { mi: 'x10', mb: 4, fontScale: 'p2b', color: 'default', children: t(option.text) })) : ((0, jsx_runtime_1.jsx)(fuselage_1.Option, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { w: 'full', display: 'flex', justifyContent: 'space-between', is: 'label', children: [t(option.text), (0, jsx_runtime_1.jsx)(fuselage_1.CheckBox, { checked: option.checked, pi: 0, name: option.text, id: option.id, onChange: () => onSelected(option) })] }) }, option.id)) }, option.id)))] }));
};
exports.default = MultiSelectCustomList;
