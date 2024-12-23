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
exports.AgentsSection = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const components_1 = require("../components");
const hooks_1 = require("../hooks");
const ellipsis_1 = require("../utils/ellipsis");
const BREAKPOINT = 768;
const AgentsSection = () => {
    const _a = (0, hooks_1.useAgentsSection)(), { data, sortBy, sortDirection, setSort } = _a, config = __rest(_a, ["data", "sortBy", "sortDirection", "setSort"]);
    const { t } = (0, react_i18next_1.useTranslation)();
    const { ref, contentBoxSize: { inlineSize: cardWidth = 200 } = {} } = (0, fuselage_hooks_1.useResizeObserver)();
    const width = cardWidth * 0.9;
    const wrapped = cardWidth ? cardWidth < BREAKPOINT : false;
    return ((0, jsx_runtime_1.jsx)(components_1.ReportCard, Object.assign({ ref: ref }, config, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: wrapped ? 'column' : 'row', children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { flexGrow: 1, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'p', fontScale: 'p2', mbe: 8, children: t('Top_5_agents_with_the_most_conversations') }), (0, jsx_runtime_1.jsx)(components_1.BarChart, { data: data.slice(0, 5), maxWidth: wrapped ? width : width / 2, height: 360, indexBy: 'label', keys: ['value'], margins: { top: 40, right: 20, bottom: 48, left: 20 }, axis: {
                                axisBottom: {
                                    tickSize: 0,
                                    tickRotation: 0,
                                    format: (v) => (0, ellipsis_1.ellipsis)(v, 10),
                                },
                                axisLeft: {
                                    tickSize: 0,
                                    tickRotation: 0,
                                    tickValues: 4,
                                },
                            } })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', h: 'x360', minWidth: '50%', flexGrow: 1, children: (0, jsx_runtime_1.jsx)(components_1.AgentsTable, { data: data, sortBy: sortBy, sortDirection: sortDirection, setSort: setSort }) })] }) })));
};
exports.AgentsSection = AgentsSection;
