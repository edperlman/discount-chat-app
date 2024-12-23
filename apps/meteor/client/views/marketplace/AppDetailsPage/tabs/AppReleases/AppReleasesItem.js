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
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const dompurify_1 = __importDefault(require("dompurify"));
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const useTimeAgo_1 = require("../../../../../hooks/useTimeAgo");
const purifyOptions_1 = require("../../../lib/purifyOptions");
const AppReleasesItem = (_a) => {
    var _b, _c;
    var { release } = _a, props = __rest(_a, ["release"]);
    const { t } = (0, react_i18next_1.useTranslation)();
    const formatDate = (0, useTimeAgo_1.useTimeAgo)();
    const title = ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'h4', fontScale: 'p1b', color: 'default', mie: 24, children: release.version }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'p', fontScale: 'p1', color: 'hint', children: formatDate(release.createdDate) })] }));
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Accordion.Item, Object.assign({ title: title }, props, { children: ((_b = release.detailedChangelog) === null || _b === void 0 ? void 0 : _b.rendered) ? ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { dangerouslySetInnerHTML: { __html: dompurify_1.default.sanitize((_c = release.detailedChangelog) === null || _c === void 0 ? void 0 : _c.rendered, purifyOptions_1.purifyOptions) }, color: 'default' })) : ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { color: 'default', children: t('No_release_information_provided') })) })));
};
exports.default = AppReleasesItem;
