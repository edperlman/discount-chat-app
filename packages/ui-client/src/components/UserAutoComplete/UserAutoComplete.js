"use strict";
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
const react_1 = require("react");
const query = (term = '', conditions = {}) => ({ selector: JSON.stringify({ term, conditions }) });
const UserAutoComplete = (_a) => {
    var { value, onChange } = _a, props = __rest(_a, ["value", "onChange"]);
    const { conditions = {} } = props;
    const [filter, setFilter] = (0, react_1.useState)('');
    const debouncedFilter = (0, fuselage_hooks_1.useDebouncedValue)(filter, 1000);
    const usersAutoCompleteEndpoint = (0, ui_contexts_1.useEndpoint)('GET', '/v1/users.autocomplete');
    const { data } = (0, react_query_1.useQuery)(['usersAutoComplete', debouncedFilter, conditions], () => __awaiter(void 0, void 0, void 0, function* () { return usersAutoCompleteEndpoint(query(debouncedFilter, conditions)); }));
    const options = (0, react_1.useMemo)(() => (data === null || data === void 0 ? void 0 : data.items.map((user) => ({ value: user.username, label: user.name || user.username }))) || [], [data]);
    return ((0, jsx_runtime_1.jsx)(fuselage_1.AutoComplete, Object.assign({}, props, { value: value, onChange: onChange, filter: filter, setFilter: setFilter, "data-qa-id": 'UserAutoComplete', renderSelected: ({ selected: { value, label } }) => ((0, jsx_runtime_1.jsxs)(fuselage_1.Chip, { height: 'x20', value: value, mie: 4, children: [(0, jsx_runtime_1.jsx)(ui_avatar_1.UserAvatar, { size: 'x20', username: value }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { verticalAlign: 'middle', is: 'span', margin: 'none', mi: 4, children: label })] })), renderItem: (_a) => {
            var { value, label } = _a, props = __rest(_a, ["value", "label"]);
            return ((0, jsx_runtime_1.jsx)(fuselage_1.Option, Object.assign({ label: label, avatar: (0, jsx_runtime_1.jsx)(ui_avatar_1.UserAvatar, { size: 'x20', username: value }) }, props), value));
        }, options: options })));
};
exports.default = (0, react_1.memo)(UserAutoComplete);
