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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_avatar_1 = require("@rocket.chat/ui-avatar");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const query = (term = '') => ({ selector: JSON.stringify({ term }) });
// TODO: useDisplayUsername
const UserAutoCompleteMultiple = (_a) => {
    var { onChange } = _a, props = __rest(_a, ["onChange"]);
    const [filter, setFilter] = (0, react_1.useState)('');
    const debouncedFilter = (0, fuselage_hooks_1.useDebouncedValue)(filter, 1000);
    const usersAutoCompleteEndpoint = (0, ui_contexts_1.useEndpoint)('GET', '/v1/users.autocomplete');
    const { data } = (0, react_query_1.useQuery)(['usersAutoComplete', debouncedFilter], () => __awaiter(void 0, void 0, void 0, function* () { return usersAutoCompleteEndpoint(query(debouncedFilter)); }));
    const options = (0, react_1.useMemo)(() => (data === null || data === void 0 ? void 0 : data.items.map((user) => ({ value: user.username, label: user.name }))) || [], [data]);
    return ((0, jsx_runtime_1.jsx)(fuselage_1.AutoComplete, Object.assign({}, props, { filter: filter, setFilter: setFilter, onChange: onChange, multiple: true, renderSelected: (_a) => {
            var { selected: { value, label }, onRemove } = _a, props = __rest(_a, ["selected", "onRemove"]);
            return ((0, jsx_runtime_1.jsxs)(fuselage_1.Chip, Object.assign({}, props, { height: 'x20', value: value, onClick: onRemove, mie: 4, children: [(0, jsx_runtime_1.jsx)(ui_avatar_1.UserAvatar, { size: 'x20', username: value }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'span', margin: 'none', mis: 4, children: label })] })));
        }, renderItem: (_a) => {
            var { value, label } = _a, props = __rest(_a, ["value", "label"]);
            return ((0, jsx_runtime_1.jsxs)(fuselage_1.Option, Object.assign({ "data-qa-type": 'autocomplete-user-option' }, props, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.OptionAvatar, { children: (0, jsx_runtime_1.jsx)(ui_avatar_1.UserAvatar, { username: value, size: 'x20' }) }), (0, jsx_runtime_1.jsxs)(fuselage_1.OptionContent, { children: [label, " ", (0, jsx_runtime_1.jsxs)(fuselage_1.OptionDescription, { children: ["(", value, ")"] })] })] }), value));
        }, options: options })));
};
exports.default = (0, react_1.memo)(UserAutoCompleteMultiple);
