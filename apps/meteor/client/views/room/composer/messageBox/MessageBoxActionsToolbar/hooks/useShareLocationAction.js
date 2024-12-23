"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useShareLocationAction = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const core_typings_1 = require("@rocket.chat/core-typings");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const ShareLocationModal_1 = __importDefault(require("../../../../ShareLocation/ShareLocationModal"));
const useShareLocationAction = (room, tmid) => {
    var _a;
    if (!room) {
        throw new Error('Invalid room');
    }
    const { t } = (0, react_i18next_1.useTranslation)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const isMapViewEnabled = (0, ui_contexts_1.useSetting)('MapView_Enabled') === true;
    const isGeolocationCurrentPositionSupported = Boolean((_a = navigator.geolocation) === null || _a === void 0 ? void 0 : _a.getCurrentPosition);
    const googleMapsApiKey = (0, ui_contexts_1.useSetting)('MapView_GMapsAPIKey', '');
    const canGetGeolocation = isMapViewEnabled && isGeolocationCurrentPositionSupported && googleMapsApiKey && googleMapsApiKey.length;
    const handleShareLocation = () => setModal((0, jsx_runtime_1.jsx)(ShareLocationModal_1.default, { rid: room._id, tmid: tmid, onClose: () => setModal(null) }));
    const allowGeolocation = room && canGetGeolocation && !(0, core_typings_1.isRoomFederated)(room);
    return {
        id: 'share-location',
        content: t('Location'),
        icon: 'map-pin',
        onClick: handleShareLocation,
        disabled: !allowGeolocation,
    };
};
exports.useShareLocationAction = useShareLocationAction;
