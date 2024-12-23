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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importDefault(require("react"));
const getGeolocationPermission_1 = require("./getGeolocationPermission");
const getGeolocationPosition_1 = require("./getGeolocationPosition");
const GenericModal_1 = __importDefault(require("../../../components/GenericModal"));
const MapView_1 = __importDefault(require("../../../components/message/content/location/MapView"));
const ShareLocationModal = ({ rid, tmid, onClose }) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const dispatchToast = (0, ui_contexts_1.useToastMessageDispatch)();
    const { data: permissionData, isLoading: permissionLoading } = (0, react_query_1.useQuery)(['geolocationPermission'], getGeolocationPermission_1.getGeolocationPermission);
    const { data: positionData } = (0, react_query_1.useQuery)(['geolocationPosition', permissionData], () => __awaiter(void 0, void 0, void 0, function* () {
        if (permissionLoading || permissionData === 'prompt' || permissionData === 'denied') {
            return;
        }
        return (0, getGeolocationPosition_1.getGeolocationPosition)();
    }));
    const queryClient = (0, react_query_1.useQueryClient)();
    const sendMessage = (0, ui_contexts_1.useEndpoint)('POST', '/v1/chat.sendMessage');
    const onConfirm = () => {
        if (!positionData) {
            throw new Error('Failed to load position');
        }
        try {
            sendMessage({
                message: {
                    rid,
                    tmid,
                    location: {
                        type: 'Point',
                        coordinates: [positionData.coords.longitude, positionData.coords.latitude],
                    },
                },
            });
        }
        catch (error) {
            dispatchToast({ type: 'error', message: error });
        }
        finally {
            onClose();
        }
    };
    const onConfirmRequestLocation = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const position = yield (0, getGeolocationPosition_1.getGeolocationPosition)();
            queryClient.setQueryData(['geolocationPosition', 'granted'], position);
            queryClient.setQueryData(['geolocationPermission'], 'granted');
        }
        catch (e) {
            queryClient.setQueryData(['geolocationPermission'], () => getGeolocationPermission_1.getGeolocationPermission);
        }
    });
    if (permissionLoading || permissionData === 'prompt') {
        return ((0, jsx_runtime_1.jsx)(GenericModal_1.default, { title: t('You_will_be_asked_for_permissions'), confirmText: t('Continue'), onConfirm: onConfirmRequestLocation, onClose: onClose, onCancel: onClose }));
    }
    if (permissionData === 'denied' || !positionData) {
        return ((0, jsx_runtime_1.jsx)(GenericModal_1.default, { title: t('Cannot_share_your_location'), confirmText: t('Ok'), onConfirm: onClose, onClose: onClose, children: t('The_necessary_browser_permissions_for_location_sharing_are_not_granted') }));
    }
    return ((0, jsx_runtime_1.jsx)(GenericModal_1.default, { title: t('Share_Location_Title'), confirmText: t('Share'), onConfirm: onConfirm, onClose: onClose, onCancel: onClose, children: (0, jsx_runtime_1.jsx)(MapView_1.default, { latitude: positionData.coords.latitude, longitude: positionData.coords.longitude }) }));
};
exports.default = ShareLocationModal;
