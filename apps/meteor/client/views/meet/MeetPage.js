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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_avatar_1 = require("@rocket.chat/ui-avatar");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const meteor_1 = require("meteor/meteor");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const CallPage_1 = __importDefault(require("./CallPage"));
const SDKClient_1 = require("../../../app/utils/client/lib/SDKClient");
const useEmbeddedLayout_1 = require("../../hooks/useEmbeddedLayout");
const NotFoundPage_1 = __importDefault(require("../notFound/NotFoundPage"));
const PageLoading_1 = __importDefault(require("../root/PageLoading"));
require("./styles.css");
const MeetPage = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const [isRoomMember, setIsRoomMember] = (0, react_1.useState)(false);
    const [status, setStatus] = (0, react_1.useState)(null);
    const [visitorId, setVisitorId] = (0, react_1.useState)(null);
    const roomId = (0, ui_contexts_1.useRouteParameter)('rid');
    const visitorToken = (0, ui_contexts_1.useSearchParameter)('token');
    const isLayoutEmbedded = (0, useEmbeddedLayout_1.useEmbeddedLayout)();
    const [visitorName, setVisitorName] = (0, react_1.useState)('');
    const [agentName, setAgentName] = (0, react_1.useState)('');
    const [callStartTime, setCallStartTime] = (0, react_1.useState)(undefined);
    const isMobileDevice = () => window.innerWidth <= 450;
    const closeCallTab = () => window.close();
    const setupCallForVisitor = (0, react_1.useCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        if (!visitorToken || !roomId) {
            throw new Error('Missing parameters');
        }
        const room = (yield SDKClient_1.sdk.rest.get('/v1/livechat/room', {
            token: visitorToken,
            rid: roomId,
        }));
        if (((_b = (_a = room === null || room === void 0 ? void 0 : room.room) === null || _a === void 0 ? void 0 : _a.v) === null || _b === void 0 ? void 0 : _b.token) === visitorToken) {
            setVisitorId(room.room.v._id);
            setVisitorName(room.room.fname);
            ((_d = (_c = room === null || room === void 0 ? void 0 : room.room) === null || _c === void 0 ? void 0 : _c.responseBy) === null || _d === void 0 ? void 0 : _d.username) ? setAgentName(room.room.responseBy.username) : setAgentName(room.room.servedBy.username);
            setStatus(((_e = room === null || room === void 0 ? void 0 : room.room) === null || _e === void 0 ? void 0 : _e.callStatus) || 'ended');
            setCallStartTime(room.room.webRtcCallStartTime);
            return setIsRoomMember(true);
        }
    }), [visitorToken, roomId]);
    const setupCallForAgent = (0, react_1.useCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        if (!roomId) {
            throw new Error('Missing parameters');
        }
        const room = (yield SDKClient_1.sdk.rest.get('/v1/rooms.info', { roomId }));
        if (((_b = (_a = room === null || room === void 0 ? void 0 : room.room) === null || _a === void 0 ? void 0 : _a.servedBy) === null || _b === void 0 ? void 0 : _b._id) === meteor_1.Meteor.userId()) {
            setVisitorName(room.room.fname);
            ((_d = (_c = room === null || room === void 0 ? void 0 : room.room) === null || _c === void 0 ? void 0 : _c.responseBy) === null || _d === void 0 ? void 0 : _d.username) ? setAgentName(room.room.responseBy.username) : setAgentName(room.room.servedBy.username);
            setStatus(((_e = room === null || room === void 0 ? void 0 : room.room) === null || _e === void 0 ? void 0 : _e.callStatus) || 'ended');
            setCallStartTime(room.room.webRtcCallStartTime);
            return setIsRoomMember(true);
        }
    }), [roomId]);
    (0, react_1.useEffect)(() => {
        if (visitorToken) {
            setupCallForVisitor();
            return;
        }
        setupCallForAgent();
    }, [setupCallForAgent, setupCallForVisitor, visitorToken]);
    if (status === null) {
        return (0, jsx_runtime_1.jsx)(PageLoading_1.default, {});
    }
    if (!isRoomMember) {
        return (0, jsx_runtime_1.jsx)(NotFoundPage_1.default, {});
    }
    if (status === 'ended') {
        return ((0, jsx_runtime_1.jsx)(fuselage_1.Flex.Container, { direction: 'column', justifyContent: 'center', children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { width: 'full', minHeight: 'sh', alignItems: 'center', backgroundColor: 'dark', overflow: 'hidden', position: 'relative', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { position: 'absolute', style: {
                            top: '5%',
                            right: '2%',
                        }, className: 'meet__video--self', backgroundColor: 'dark', alignItems: 'center', children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { style: {
                                display: 'block',
                                margin: 'auto',
                            }, children: (0, jsx_runtime_1.jsx)(ui_avatar_1.UserAvatar, { username: visitorToken ? visitorName : agentName, size: isMobileDevice() ? 'x32' : 'x48' }) }) }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { position: 'absolute', zIndex: 1, style: {
                            top: isMobileDevice() ? '30%' : '20%',
                            display: 'flex',
                            justifyContent: 'center',
                            flexDirection: 'column',
                        }, alignItems: 'center', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { style: {
                                    display: 'block',
                                    margin: 'auto',
                                }, children: (0, jsx_runtime_1.jsx)(ui_avatar_1.UserAvatar, { username: visitorToken ? agentName : visitorName, size: 'x124' }) }), (0, jsx_runtime_1.jsx)("p", { style: { color: 'white', fontSize: 16, margin: 15 }, children: "Call Ended!" }), (0, jsx_runtime_1.jsx)("p", { style: {
                                    color: 'white',
                                    fontSize: isMobileDevice() ? 15 : 22,
                                }, children: visitorToken ? agentName : visitorName })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { position: 'absolute', alignItems: 'center', style: { bottom: '20%' }, children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { icon: 'cross', square: true, title: t('Close_Window'), onClick: closeCallTab, backgroundColor: 'dark', borderColor: 'extra-dark' }) })] }) }));
    }
    return ((0, jsx_runtime_1.jsx)(CallPage_1.default, { roomId: roomId, status: status, visitorToken: visitorToken, visitorId: visitorId, setStatus: setStatus, visitorName: visitorName, agentName: agentName, isLayoutEmbedded: isLayoutEmbedded, callStartTime: callStartTime }));
};
exports.default = MeetPage;
