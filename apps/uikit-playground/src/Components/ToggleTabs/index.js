"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const ToggleTabs = ({ tabsItem, onChange, selectedTab, }) => {
    const disableBorder = (0, css_in_js_1.css) `
    border-left: none !important;
    border-right: none !important;
    border-top: none !important;
    box-shadow: none !important;
    margin-right: 0 !important;
  `;
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Tabs, { children: tabsItem.map((item, index) => ((0, jsx_runtime_1.jsx)(fuselage_1.Tabs.Item, { selected: selectedTab === index, onClick: () => onChange(index), className: disableBorder, children: item }, index))) }));
};
exports.default = ToggleTabs;
