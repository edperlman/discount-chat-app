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
const UserAutoCompleteMultipleOptions_1 = __importStar(require("./UserAutoCompleteMultipleOptions"));
const matrixRegex = new RegExp('@(.*:.*)');
const UserAutoCompleteMultipleFederated = (_a) => {
    var { onChange, value, placeholder } = _a, props = __rest(_a, ["onChange", "value", "placeholder"]);
    const [filter, setFilter] = (0, react_1.useState)('');
    const [selectedCache, setSelectedCache] = (0, react_1.useState)({});
    const debouncedFilter = (0, fuselage_hooks_1.useDebouncedValue)(filter, 500);
    const getUsers = (0, ui_contexts_1.useEndpoint)('GET', '/v1/users.autocomplete');
    const { data } = (0, react_query_1.useQuery)(['users.autocomplete', debouncedFilter], () => __awaiter(void 0, void 0, void 0, function* () {
        const users = yield getUsers({ selector: JSON.stringify({ term: debouncedFilter }) });
        const options = users.items.map((item) => [item.username, item]);
        // Add extra option if filter text matches `username:server`
        // Used to add federated users that do not exist yet
        if (matrixRegex.test(debouncedFilter)) {
            options.unshift([debouncedFilter, { name: debouncedFilter, username: debouncedFilter, _federated: true }]);
        }
        return options;
    }), { keepPreviousData: true });
    const options = (0, react_1.useMemo)(() => data || [], [data]);
    const onAddUser = (0, react_1.useCallback)((username) => {
        var _a;
        const user = (_a = options.find(([val]) => val === username)) === null || _a === void 0 ? void 0 : _a[1];
        if (!user) {
            throw new Error('UserAutoCompleteMultiple - onAddSelected - failed to cache option');
        }
        setSelectedCache((selectedCache) => (Object.assign(Object.assign({}, selectedCache), { [username]: user })));
    }, [setSelectedCache, options]);
    const onRemoveUser = (0, react_1.useCallback)((username) => setSelectedCache((selectedCache) => {
        const users = Object.assign({}, selectedCache);
        delete users[username];
        return users;
    }), [setSelectedCache]);
    const handleOnChange = (0, react_1.useCallback)((usernames) => {
        onChange(usernames);
        const newAddedUsername = usernames.filter((username) => !value.includes(username))[0];
        const removedUsername = value.filter((username) => !usernames.includes(username))[0];
        setFilter('');
        newAddedUsername && onAddUser(newAddedUsername);
        removedUsername && onRemoveUser(removedUsername);
    }, [onChange, setFilter, onAddUser, onRemoveUser, value]);
    return ((0, jsx_runtime_1.jsx)(UserAutoCompleteMultipleOptions_1.OptionsContext.Provider, { value: { options }, children: (0, jsx_runtime_1.jsx)(fuselage_1.MultiSelectFiltered, Object.assign({}, props, { "data-qa-type": 'user-auto-complete-input', placeholder: placeholder, value: value, onChange: handleOnChange, filter: filter, setFilter: setFilter, renderSelected: ({ value, onMouseDown }) => {
                const currentCachedOption = selectedCache[value] || {};
                return ((0, jsx_runtime_1.jsxs)(fuselage_1.Chip, { height: 'x20', onMouseDown: onMouseDown, mie: 4, mb: 2, children: [currentCachedOption._federated ? (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { size: 'x20', name: 'globe' }) : (0, jsx_runtime_1.jsx)(ui_avatar_1.UserAvatar, { size: 'x20', username: value }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'span', margin: 'none', mis: 4, children: currentCachedOption.name || currentCachedOption.username || value })] }, value));
            }, renderOptions: UserAutoCompleteMultipleOptions_1.default, options: options.concat(Object.entries(selectedCache)).map(([, item]) => [item.username, item.name || item.username]), "data-qa": 'create-channel-users-autocomplete' })) }));
};
exports.default = (0, react_1.memo)(UserAutoCompleteMultipleFederated);
