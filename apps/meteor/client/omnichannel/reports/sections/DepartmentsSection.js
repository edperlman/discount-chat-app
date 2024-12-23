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
exports.DepartmentsSection = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const components_1 = require("../components");
const hooks_1 = require("../hooks");
const ellipsis_1 = require("../utils/ellipsis");
const DepartmentsSection = () => {
    const _a = (0, hooks_1.useDepartmentsSection)(), { data } = _a, config = __rest(_a, ["data"]);
    return ((0, jsx_runtime_1.jsx)(components_1.ReportCard, Object.assign({}, config, { children: (0, jsx_runtime_1.jsx)(components_1.BarChart, { data: data, direction: 'horizontal', height: 360, margins: { left: 90, top: 30, right: 8 }, axis: {
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
exports.DepartmentsSection = DepartmentsSection;
