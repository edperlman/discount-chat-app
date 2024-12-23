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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCallsRoomAction = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const RoomContext_1 = require("../../views/room/contexts/RoomContext");
const useHasLicenseModule_1 = require("../useHasLicenseModule");
const VideoConfList = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('../../views/room/contextualBar/VideoConference/VideoConfList'))));
const useCallsRoomAction = () => {
    var _a;
    const licensed = (0, useHasLicenseModule_1.useHasLicenseModule)('videoconference-enterprise') === true;
    const room = (_a = (0, react_1.useContext)(RoomContext_1.RoomContext)) === null || _a === void 0 ? void 0 : _a.room;
    const federated = room ? (0, core_typings_1.isRoomFederated)(room) : false;
    const { t } = (0, react_i18next_1.useTranslation)();
    return (0, react_1.useMemo)(() => {
        if (!licensed) {
            return undefined;
        }
        return Object.assign(Object.assign({ id: 'calls', groups: ['channel', 'group', 'team', 'direct', 'direct_multiple'], icon: 'phone', title: 'Calls' }, (federated && {
            tooltip: t('core.Video_Call_unavailable_for_this_type_of_room'),
            disabled: true,
        })), { tabComponent: VideoConfList, order: 999 });
    }, [licensed, federated, t]);
};
exports.useCallsRoomAction = useCallsRoomAction;
