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
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = require("react");
// TODO: remove any and type correctly
const HeaderToolbarAction = (0, react_1.forwardRef)(function HeaderToolbarAction(_a, ref) {
    var { id, icon, action, index, title, 'data-tooltip': tooltip } = _a, props = __rest(_a, ["id", "icon", "action", "index", "title", 'data-tooltip']);
    return ((0, jsx_runtime_1.jsx)(fuselage_1.IconButton, Object.assign({ "data-qa-id": `ToolBoxAction-${icon}`, ref: ref, onClick: () => action(id), "data-toolbox": index, icon: icon, small: true, position: 'relative', overflow: 'visible' }, (tooltip ? { 'data-tooltip': tooltip, 'title': '' } : { title }), props), id));
});
exports.default = HeaderToolbarAction;
