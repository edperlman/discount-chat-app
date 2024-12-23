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
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_avatar_1 = require("@rocket.chat/ui-avatar");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const generateQuery = (term = '') => ({ selector: JSON.stringify({ name: term }) });
const AVATAR_SIZE = 'x20';
const ROOM_AUTOCOMPLETE_PARAMS = {
    admin: {
        endpoint: '/v1/rooms.autocomplete.adminRooms',
        key: 'roomsAutoCompleteAdmin',
    },
    regular: {
        endpoint: '/v1/rooms.autocomplete.channelAndPrivate',
        key: 'roomsAutoCompleteRegular',
    },
};
const RoomAutoComplete = (_a) => {
    var _b;
    var { value, onChange, scope = 'regular', renderRoomIcon, setSelectedRoom } = _a, props = __rest(_a, ["value", "onChange", "scope", "renderRoomIcon", "setSelectedRoom"]);
    const [filter, setFilter] = (0, react_1.useState)('');
    const filterDebounced = (0, fuselage_hooks_1.useDebouncedValue)(filter, 300);
    const roomsAutoCompleteEndpoint = (0, ui_contexts_1.useEndpoint)('GET', ROOM_AUTOCOMPLETE_PARAMS[scope].endpoint);
    const result = (0, react_query_1.useQuery)([ROOM_AUTOCOMPLETE_PARAMS[scope].key, filterDebounced], () => roomsAutoCompleteEndpoint(generateQuery(filterDebounced)), {
        keepPreviousData: true,
    });
    const options = (0, react_1.useMemo)(() => result.isSuccess
        ? result.data.items.map(({ name, fname, _id, avatarETag, t, encrypted }) => ({
            value: _id,
            label: { name: fname || name, avatarETag, type: t, encrypted },
        }))
        : [], [(_b = result.data) === null || _b === void 0 ? void 0 : _b.items, result.isSuccess]);
    return ((0, jsx_runtime_1.jsx)(fuselage_1.AutoComplete, Object.assign({}, props, { value: value, onChange: (val) => {
            var _a;
            onChange(val);
            if (setSelectedRoom && typeof setSelectedRoom === 'function') {
                const selectedRoom = (_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.items.find(({ _id }) => _id === val);
                setSelectedRoom(selectedRoom);
            }
        }, filter: filter, setFilter: setFilter, renderSelected: ({ selected: { value, label } }) => ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { margin: 'none', mi: 2, children: (0, jsx_runtime_1.jsx)(ui_avatar_1.RoomAvatar, { size: AVATAR_SIZE, room: Object.assign({ type: (label === null || label === void 0 ? void 0 : label.type) || 'c', _id: value }, label) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { margin: 'none', mi: 2, children: label === null || label === void 0 ? void 0 : label.name }), renderRoomIcon === null || renderRoomIcon === void 0 ? void 0 : renderRoomIcon(Object.assign({}, label))] })), renderItem: (_a) => {
            var { value, label } = _a, props = __rest(_a, ["value", "label"]);
            return ((0, jsx_runtime_1.jsx)(fuselage_1.Option, Object.assign({}, props, { label: label.name, avatar: (0, jsx_runtime_1.jsx)(ui_avatar_1.RoomAvatar, { size: AVATAR_SIZE, room: Object.assign({ _id: value }, label) }) })));
        }, options: options })));
};
exports.default = (0, react_1.memo)(RoomAutoComplete);
