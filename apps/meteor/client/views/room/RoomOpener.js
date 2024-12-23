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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_client_1 = require("@rocket.chat/ui-client");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const RoomSkeleton_1 = __importDefault(require("./RoomSkeleton"));
const RoomSidepanel_1 = __importDefault(require("./Sidepanel/RoomSidepanel"));
const useOpenRoom_1 = require("./hooks/useOpenRoom");
const FeaturePreviewSidePanelNavigation_1 = require("../../components/FeaturePreviewSidePanelNavigation");
const Header_1 = require("../../components/Header");
const errorHandling_1 = require("../../lib/errorHandling");
const NotAuthorizedError_1 = require("../../lib/errors/NotAuthorizedError");
const OldUrlRoomError_1 = require("../../lib/errors/OldUrlRoomError");
const RoomNotFoundError_1 = require("../../lib/errors/RoomNotFoundError");
const RoomProvider = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./providers/RoomProvider'))));
const RoomNotFound = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./RoomNotFound'))));
const Room = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./Room'))));
const RoomLayout = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./layout/RoomLayout'))));
const NotAuthorizedPage = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('../notAuthorized/NotAuthorizedPage'))));
const isDirectOrOmnichannelRoom = (type) => type === 'd' || type === 'l';
const RoomOpener = ({ type, reference }) => {
    const { data, error, isSuccess, isError, isLoading } = (0, useOpenRoom_1.useOpenRoom)({ type, reference });
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', w: 'full', h: 'full', children: [!isDirectOrOmnichannelRoom(type) && ((0, jsx_runtime_1.jsxs)(FeaturePreviewSidePanelNavigation_1.FeaturePreviewSidePanelNavigation, { children: [(0, jsx_runtime_1.jsx)(ui_client_1.FeaturePreviewOff, { children: null }), (0, jsx_runtime_1.jsx)(ui_client_1.FeaturePreviewOn, { children: (0, jsx_runtime_1.jsx)(RoomSidepanel_1.default, {}) })] })), (0, jsx_runtime_1.jsxs)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)(RoomSkeleton_1.default, {}), children: [isLoading && (0, jsx_runtime_1.jsx)(RoomSkeleton_1.default, {}), isSuccess && ((0, jsx_runtime_1.jsx)(RoomProvider, { rid: data.rid, children: (0, jsx_runtime_1.jsx)(Room, {}) })), isError &&
                        (() => {
                            if (error instanceof OldUrlRoomError_1.OldUrlRoomError) {
                                return (0, jsx_runtime_1.jsx)(RoomSkeleton_1.default, {});
                            }
                            if (error instanceof RoomNotFoundError_1.RoomNotFoundError) {
                                return (0, jsx_runtime_1.jsx)(RoomNotFound, {});
                            }
                            if (error instanceof NotAuthorizedError_1.NotAuthorizedError) {
                                return (0, jsx_runtime_1.jsx)(NotAuthorizedPage, {});
                            }
                            return ((0, jsx_runtime_1.jsx)(RoomLayout, { header: (0, jsx_runtime_1.jsx)(Header_1.Header, {}), body: (0, jsx_runtime_1.jsxs)(fuselage_1.States, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.StatesIcon, { name: 'circle-exclamation', variation: 'danger' }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesTitle, { children: t('core.Error') }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesSubtitle, { children: (0, errorHandling_1.getErrorMessage)(error) })] }) }));
                        })()] })] }));
};
exports.default = RoomOpener;
