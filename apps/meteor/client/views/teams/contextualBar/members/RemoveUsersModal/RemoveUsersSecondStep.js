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
const GenericModal_1 = __importDefault(require("../../../../../components/GenericModal"));
const RemoveUsersSecondStep = (_a) => {
    var { onClose, onCancel, onConfirm, deletedRooms = {}, username, rooms = [] } = _a, props = __rest(_a, ["onClose", "onCancel", "onConfirm", "deletedRooms", "username", "rooms"]);
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsx)(GenericModal_1.default, Object.assign({ variant: 'danger', icon: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'modal-warning', size: 'x24', color: 'status-font-on-warning' }), cancelText: (rooms === null || rooms === void 0 ? void 0 : rooms.length) > 0 ? t('Back') : t('Cancel'), confirmText: t('Remove'), title: t('Confirmation'), onClose: onClose, onCancel: onCancel, onConfirm: () => onConfirm(deletedRooms) }, props, { children: t('Teams_removing__username__from_team', { username }) })));
};
exports.default = RemoveUsersSecondStep;
