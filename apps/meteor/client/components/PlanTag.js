"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const isTruthy_1 = require("../../lib/isTruthy");
const useLicense_1 = require("../hooks/useLicense");
const developmentTag = process.env.NODE_ENV === 'development' ? 'Development' : null;
function PlanTag() {
    var _a, _b, _c;
    const license = (0, useLicense_1.useLicense)();
    const tags = [
        developmentTag && { name: developmentTag },
        ...((_b = (_a = license.data) === null || _a === void 0 ? void 0 : _a.tags) !== null && _b !== void 0 ? _b : []),
        !license.isLoading && !license.isError && !((_c = license.data) === null || _c === void 0 ? void 0 : _c.license) && { name: 'Community' },
    ].filter(isTruthy_1.isTruthy);
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: tags.map(({ name }) => ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { marginInline: 4, display: 'inline-block', verticalAlign: 'middle', children: (0, jsx_runtime_1.jsx)(fuselage_1.Tag, { variant: 'primary', children: name }) }, name))) }));
}
exports.default = PlanTag;
