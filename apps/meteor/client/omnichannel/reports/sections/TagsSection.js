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
exports.TagsSection = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = __importDefault(require("react"));
const components_1 = require("../components");
const hooks_1 = require("../hooks");
const ellipsis_1 = require("../utils/ellipsis");
const TagsSection = () => {
    const _a = (0, hooks_1.useTagsSection)(), { data } = _a, config = __rest(_a, ["data"]);
    const { ref, contentBoxSize: { inlineSize: cardWidth = 200 } = {} } = (0, fuselage_hooks_1.useResizeObserver)();
    const width = cardWidth * 0.9;
    return ((0, jsx_runtime_1.jsx)(components_1.ReportCard, Object.assign({ ref: ref }, config, { children: (0, jsx_runtime_1.jsx)(components_1.BarChart, { data: data, direction: 'horizontal', height: 360, maxWidth: width, margins: { left: 40, top: 40, right: 20 }, axis: {
                axisLeft: {
                    tickSize: 0,
                    tickRotation: 0,
                    format: (v) => (0, ellipsis_1.ellipsis)(v, 10),
                },
                axisTop: {
                    tickSize: 0,
                    tickRotation: 0,
                    tickValues: 4,
                    format: (v) => (0, ellipsis_1.ellipsis)(v, 10),
                },
            } }) })));
};
exports.TagsSection = TagsSection;
