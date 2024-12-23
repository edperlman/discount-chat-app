"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const VisitorAutoComplete = (_a) => {
    var { value, onChange } = _a, props = __rest(_a, ["value", "onChange"]);
    const [filter, setFilter] = (0, react_1.useState)('');
    const performVisitorSearch = (0, ui_contexts_1.useEndpoint)('GET', '/v1/livechat/visitors.autocomplete');
    const visitorAutocompleteQueryResult = (0, react_query_1.useQuery)(['audit', 'visitors', filter], () => performVisitorSearch({ selector: JSON.stringify({ term: filter !== null && filter !== void 0 ? filter : '' }) }));
    const options = (0, react_1.useMemo)(() => { var _a, _b; return (_b = (_a = visitorAutocompleteQueryResult.data) === null || _a === void 0 ? void 0 : _a.items.map((user) => { var _a; return ({ value: user._id, label: (_a = user.name) !== null && _a !== void 0 ? _a : user.username }); })) !== null && _b !== void 0 ? _b : []; }, [visitorAutocompleteQueryResult.data]);
    return ((0, jsx_runtime_1.jsx)(fuselage_1.AutoComplete, Object.assign({}, props, { value: value, onChange: onChange, filter: filter, setFilter: setFilter, renderSelected: ({ selected: { label } }) => (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: label }), renderItem: (_a) => {
            var { value } = _a, props = __rest(_a, ["value"]);
            return (0, jsx_runtime_1.jsx)(fuselage_1.Option, Object.assign({}, props), value);
        }, options: options })));
};
exports.default = (0, react_1.memo)(VisitorAutoComplete);
