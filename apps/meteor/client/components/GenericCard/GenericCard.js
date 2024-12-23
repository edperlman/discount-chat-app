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
exports.GenericCard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = __importDefault(require("react"));
const GenericCard = (_a) => {
    var { title, body, buttons, icon, type } = _a, props = __rest(_a, ["title", "body", "buttons", "icon", "type"]);
    const cardId = (0, fuselage_hooks_1.useUniqueId)();
    const descriptionId = (0, fuselage_hooks_1.useUniqueId)();
    const iconType = type && {
        [type]: true,
    };
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Card, Object.assign({ role: 'region', "aria-labelledby": cardId, "aria-describedby": descriptionId }, props, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.CardHeader, { children: [icon && (0, jsx_runtime_1.jsx)(fuselage_1.FramedIcon, Object.assign({ icon: icon }, (type && iconType))), (0, jsx_runtime_1.jsx)(fuselage_1.CardTitle, { id: cardId, children: title })] }), (0, jsx_runtime_1.jsx)(fuselage_1.CardBody, { id: descriptionId, children: body }), buttons && (0, jsx_runtime_1.jsx)(fuselage_1.CardControls, { children: buttons })] })));
};
exports.GenericCard = GenericCard;
