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
const core_typings_1 = require("@rocket.chat/core-typings");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const string_helpers_1 = require("@rocket.chat/string-helpers");
const ui_avatar_1 = require("@rocket.chat/ui-avatar");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const roomCoordinator_1 = require("../../lib/rooms/roomCoordinator");
const UserAndRoomAutoCompleteMultiple = (_a) => {
    var { value, onChange } = _a, props = __rest(_a, ["value", "onChange"]);
    const user = (0, ui_contexts_1.useUser)();
    const [filter, setFilter] = (0, react_1.useState)('');
    const debouncedFilter = (0, fuselage_hooks_1.useDebouncedValue)(filter, 1000);
    const rooms = (0, ui_contexts_1.useUserSubscriptions)((0, react_1.useMemo)(() => ({
        open: { $ne: false },
        $or: [
            { lowerCaseFName: new RegExp((0, string_helpers_1.escapeRegExp)(debouncedFilter), 'i') },
            { lowerCaseName: new RegExp((0, string_helpers_1.escapeRegExp)(debouncedFilter), 'i') },
        ],
    }), [debouncedFilter])).filter((room) => {
        if (!user) {
            return;
        }
        if ((0, core_typings_1.isDirectMessageRoom)(room) && (room.blocked || room.blocker)) {
            return;
        }
        return !roomCoordinator_1.roomCoordinator.readOnly(room.rid, user);
    });
    const options = (0, react_1.useMemo)(() => rooms.map(({ rid, fname, name, avatarETag, t }) => ({
        value: rid,
        label: { name: fname || name, avatarETag, type: t },
    })), [rooms]);
    return ((0, jsx_runtime_1.jsx)(fuselage_1.AutoComplete, Object.assign({}, props, { value: value, onChange: onChange, filter: filter, setFilter: setFilter, multiple: true, renderSelected: (_a) => {
            var { selected: { value, label }, onRemove } = _a, props = __rest(_a, ["selected", "onRemove"]);
            return ((0, jsx_runtime_1.jsxs)(fuselage_1.Chip, Object.assign({}, props, { height: 'x20', value: value, onClick: onRemove, mie: 4, children: [label.t === 'd' ? ((0, jsx_runtime_1.jsx)(ui_avatar_1.UserAvatar, { size: 'x20', username: value })) : ((0, jsx_runtime_1.jsx)(ui_avatar_1.RoomAvatar, { size: 'x20', room: Object.assign({ type: label === null || label === void 0 ? void 0 : label.type, _id: value }, label) })), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'span', margin: 'none', mis: 4, children: label.name })] })));
        }, renderItem: (_a) => {
            var { value, label } = _a, props = __rest(_a, ["value", "label"]);
            return ((0, jsx_runtime_1.jsxs)(fuselage_1.Option, Object.assign({}, props, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.OptionAvatar, { children: label.t === 'd' ? ((0, jsx_runtime_1.jsx)(ui_avatar_1.UserAvatar, { size: 'x20', username: value })) : ((0, jsx_runtime_1.jsx)(ui_avatar_1.RoomAvatar, { size: 'x20', room: Object.assign({ type: label === null || label === void 0 ? void 0 : label.type, _id: value }, label) })) }), (0, jsx_runtime_1.jsx)(fuselage_1.OptionContent, { children: label.name })] }), value));
        }, options: options })));
};
exports.default = (0, react_1.memo)(UserAndRoomAutoCompleteMultiple);
