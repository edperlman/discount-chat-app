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
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const GenericModal_1 = __importDefault(require("../../../../components/GenericModal"));
const ChannelDesertionTable_1 = __importDefault(require("../../ChannelDesertionTable"));
const FirstStep = (_a) => {
    var { onClose, onCancel, onConfirm, rooms, onToggleAllRooms, onChangeRoomSelection, selectedRooms, eligibleRoomsLength } = _a, props = __rest(_a, ["onClose", "onCancel", "onConfirm", "rooms", "onToggleAllRooms", "onChangeRoomSelection", "selectedRooms", "eligibleRoomsLength"]);
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsxs)(GenericModal_1.default, Object.assign({ variant: 'warning', icon: 'warning', title: t('Converting_team_to_channel'), cancelText: t('Cancel'), confirmText: t('Continue'), onClose: onClose, onCancel: onCancel, onConfirm: onConfirm }, props, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { mbe: 24, fontScale: 'p2', children: t('Select_the_teams_channels_you_would_like_to_delete') }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { mbe: 24, fontScale: 'p2', children: t('Notice_that_public_channels_will_be_public_and_visible_to_everyone') }), (0, jsx_runtime_1.jsx)(ChannelDesertionTable_1.default, { lastOwnerWarning: undefined, onToggleAllRooms: onToggleAllRooms, rooms: rooms, onChangeRoomSelection: onChangeRoomSelection, selectedRooms: selectedRooms, eligibleRoomsLength: eligibleRoomsLength })] })));
};
exports.default = FirstStep;
