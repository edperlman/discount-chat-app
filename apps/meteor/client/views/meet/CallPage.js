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
const ui_avatar_1 = require("@rocket.chat/ui-avatar");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const moment_1 = __importDefault(require("moment"));
const react_1 = __importStar(require("react"));
const OngoingCallDuration_1 = __importDefault(require("./OngoingCallDuration"));
const SDKClient_1 = require("../../../app/utils/client/lib/SDKClient");
const client_1 = require("../../../app/webrtc/client");
const constants_1 = require("../../../app/webrtc/lib/constants");
require("./styles.css");
const CallPage = ({ roomId, visitorToken, visitorId, status, setStatus, isLayoutEmbedded, visitorName, agentName, callStartTime, }) => {
    if (!roomId) {
        throw new Error('Call Page - no room id');
    }
    const [isAgentActive, setIsAgentActive] = (0, react_1.useState)(false);
    const [isMicOn, setIsMicOn] = (0, react_1.useState)(false);
    const [isCameraOn, setIsCameraOn] = (0, react_1.useState)(false);
    const [isRemoteMobileDevice, setIsRemoteMobileDevice] = (0, react_1.useState)(false);
    const [callInIframe, setCallInIframe] = (0, react_1.useState)(false);
    const [isRemoteCameraOn, setIsRemoteCameraOn] = (0, react_1.useState)(false);
    const [isLocalMobileDevice, setIsLocalMobileDevice] = (0, react_1.useState)(false);
    let iconSize = 'x21';
    let buttonSize = 'x40';
    const avatarSize = 'x48';
    if (isLayoutEmbedded) {
        iconSize = 'x19';
        buttonSize = 'x35';
    }
    const subscribeNotifyUser = (0, ui_contexts_1.useStream)('notify-user');
    const subscribeNotifyRoom = (0, ui_contexts_1.useStream)('notify-room');
    const t = (0, ui_contexts_1.useTranslation)();
    (0, react_1.useEffect)(() => {
        if (visitorToken) {
            if (!visitorId) {
                throw new Error('Call Page - no visitor id');
            }
            const webrtcInstance = client_1.WebRTC.getInstanceByRoomId(roomId, visitorId);
            const isMobileDevice = () => {
                if (isLayoutEmbedded) {
                    setCallInIframe(true);
                }
                if (window.innerWidth <= 450 && window.innerHeight >= 629 && window.innerHeight <= 900) {
                    setIsLocalMobileDevice(true);
                    if (webrtcInstance)
                        webrtcInstance.media = {
                            audio: true,
                            video: {
                                width: { ideal: 440 },
                                height: { ideal: 580 },
                            },
                        };
                    return true;
                }
                return false;
            };
            const unsubNotifyUser = subscribeNotifyUser(`${visitorId}/${constants_1.WEB_RTC_EVENTS.WEB_RTC}`, (type, data) => {
                if (data.room == null) {
                    return;
                }
                switch (type) {
                    case 'candidate':
                        webrtcInstance === null || webrtcInstance === void 0 ? void 0 : webrtcInstance.onUserStream('candidate', data);
                        break;
                    case 'description':
                        webrtcInstance === null || webrtcInstance === void 0 ? void 0 : webrtcInstance.onUserStream('description', data);
                        break;
                    case 'join':
                        webrtcInstance === null || webrtcInstance === void 0 ? void 0 : webrtcInstance.onUserStream('join', data);
                        break;
                }
            });
            const unsubNotifyRoom = subscribeNotifyRoom(`${roomId}/${constants_1.WEB_RTC_EVENTS.WEB_RTC}`, (type, data) => {
                if (type === 'callStatus' && data.callStatus === 'ended') {
                    webrtcInstance === null || webrtcInstance === void 0 ? void 0 : webrtcInstance.stop();
                    setStatus(data.callStatus);
                }
                else if (type === 'getDeviceType') {
                    SDKClient_1.sdk.publish('notify-room', [
                        `${roomId}/${constants_1.WEB_RTC_EVENTS.WEB_RTC}`,
                        'deviceType',
                        {
                            isMobileDevice: isMobileDevice(),
                        },
                    ]);
                }
                else if (type === 'cameraStatus') {
                    setIsRemoteCameraOn(data.isCameraOn);
                }
            });
            SDKClient_1.sdk.publish('notify-room', [
                `${roomId}/${constants_1.WEB_RTC_EVENTS.WEB_RTC}`,
                'deviceType',
                {
                    isMobileDevice: isMobileDevice(),
                },
            ]);
            SDKClient_1.sdk.publish('notify-room', [
                `${roomId}/${constants_1.WEB_RTC_EVENTS.WEB_RTC}`,
                'callStatus',
                {
                    callStatus: 'inProgress',
                },
            ]);
            return () => {
                unsubNotifyRoom();
                unsubNotifyUser();
            };
        }
        if (!isAgentActive) {
            const webrtcInstance = client_1.WebRTC.getInstanceByRoomId(roomId);
            if (status === 'inProgress') {
                SDKClient_1.sdk.publish('notify-room', [`${roomId}/${constants_1.WEB_RTC_EVENTS.WEB_RTC}`, 'getDeviceType']);
                webrtcInstance === null || webrtcInstance === void 0 ? void 0 : webrtcInstance.startCall({
                    audio: true,
                    video: {
                        width: { ideal: 1920 },
                        height: { ideal: 1080 },
                    },
                });
            }
            setIsAgentActive(true);
            return subscribeNotifyRoom(`${roomId}/${constants_1.WEB_RTC_EVENTS.WEB_RTC}`, (type, data) => {
                if (type === 'callStatus') {
                    switch (data.callStatus) {
                        case 'ended':
                            webrtcInstance === null || webrtcInstance === void 0 ? void 0 : webrtcInstance.stop();
                            break;
                        case 'inProgress':
                            webrtcInstance === null || webrtcInstance === void 0 ? void 0 : webrtcInstance.startCall({
                                audio: true,
                                video: {
                                    width: { ideal: 1920 },
                                    height: { ideal: 1080 },
                                },
                            });
                    }
                    setStatus(data.callStatus);
                }
                else if (type === 'deviceType' && data.isMobileDevice) {
                    setIsRemoteMobileDevice(true);
                }
                else if (type === 'cameraStatus') {
                    setIsRemoteCameraOn(data.isCameraOn);
                }
            });
        }
    }, [isAgentActive, status, setStatus, visitorId, roomId, visitorToken, isLayoutEmbedded, subscribeNotifyUser, subscribeNotifyRoom]);
    const toggleButton = (control) => {
        var _a, _b;
        if (control === 'mic') {
            (_a = client_1.WebRTC.getInstanceByRoomId(roomId, visitorToken)) === null || _a === void 0 ? void 0 : _a.toggleAudio();
            return setIsMicOn(!isMicOn);
        }
        (_b = client_1.WebRTC.getInstanceByRoomId(roomId, visitorToken)) === null || _b === void 0 ? void 0 : _b.toggleVideo();
        setIsCameraOn(!isCameraOn);
        SDKClient_1.sdk.publish('notify-room', [
            `${roomId}/${constants_1.WEB_RTC_EVENTS.WEB_RTC}`,
            'cameraStatus',
            {
                isCameraOn: !isCameraOn,
            },
        ]);
    };
    const closeWindow = () => {
        if (isLayoutEmbedded) {
            return parent === null || parent === void 0 ? void 0 : parent.handleIframeClose();
        }
        return window.close();
    };
    const getCallDuration = (callStartTime) => moment_1.default.duration((0, moment_1.default)(new Date()).diff((0, moment_1.default)(callStartTime))).asSeconds();
    const showCallPage = (localAvatar, remoteAvatar) => ((0, jsx_runtime_1.jsx)(fuselage_1.Flex.Container, { direction: 'column', justifyContent: 'center', children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { width: 'full', minHeight: 'sh', alignItems: 'center', backgroundColor: 'dark', overflow: 'hidden', position: 'relative', children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { position: 'absolute', zIndex: 1, style: {
                        top: '5%',
                        right: '2%',
                    }, className: 'meet__video--self', alignItems: 'center', backgroundColor: 'dark', children: [(0, jsx_runtime_1.jsx)("video", { id: 'localVideo', autoPlay: true, playsInline: true, muted: true, style: {
                                width: '100%',
                                transform: 'scaleX(-1)',
                                display: isCameraOn ? 'block' : 'none',
                            } }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { style: {
                                display: isCameraOn ? 'none' : 'block',
                                margin: 'auto',
                            }, children: (0, jsx_runtime_1.jsx)(ui_avatar_1.UserAvatar, { username: localAvatar, size: isLocalMobileDevice || callInIframe ? 'x32' : 'x48' }) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { position: 'absolute', zIndex: 1, style: {
                        bottom: '5%',
                    }, children: (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { id: 'mic', square: true, title: isMicOn ? t('Mute_microphone') : t('Unmute_microphone'), onClick: () => toggleButton('mic'), className: isMicOn ? 'meet__button--on' : 'meet__button--off', size: Number(buttonSize), children: isMicOn ? (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'mic', size: iconSize }) : (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'mic-off', size: iconSize }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { id: 'camera', square: true, title: isCameraOn ? t('Turn_off_video') : t('Turn_on_video'), onClick: () => toggleButton('camera'), className: isCameraOn ? 'meet__button--on' : 'meet__button--off', size: parseInt(buttonSize), children: isCameraOn ? (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'video', size: iconSize }) : (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'video-off', size: iconSize }) }), isLayoutEmbedded && ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { square: true, backgroundColor: 'dark', borderColor: 'stroke-extra-dark', "data-title": t('Expand_view'), onClick: () => parent === null || parent === void 0 ? void 0 : parent.expandCall(), size: parseInt(buttonSize), children: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'arrow-expand', size: iconSize, color: 'white' }) })), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { square: true, danger: true, title: t('End_call'), onClick: closeWindow, size: parseInt(buttonSize), children: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'phone-off', size: iconSize, color: 'white' }) })] }) }), (0, jsx_runtime_1.jsx)("video", { id: 'remoteVideo', autoPlay: true, playsInline: true, style: {
                        width: isRemoteMobileDevice ? '45%' : '100%',
                        transform: 'scaleX(-1)',
                        display: isRemoteCameraOn ? 'block' : 'none',
                    }, children: (0, jsx_runtime_1.jsx)("track", { kind: 'captions' }) }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { position: 'absolute', zIndex: 1, display: isRemoteCameraOn ? 'none' : 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', style: {
                        top: isRemoteMobileDevice || isLocalMobileDevice ? '10%' : '30%',
                    }, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { style: {
                                display: 'block',
                                margin: 'auto',
                            }, children: (0, jsx_runtime_1.jsx)(ui_avatar_1.UserAvatar, { username: remoteAvatar, size: !callInIframe ? 'x124' : avatarSize }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { color: 'white', fontSize: callInIframe ? 12 : 18, textAlign: 'center', margin: 3, children: (0, jsx_runtime_1.jsx)(OngoingCallDuration_1.default, { counter: getCallDuration(callStartTime) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { style: Object.assign({ color: 'white', fontSize: callInIframe ? 12 : 22, margin: callInIframe ? 5 : 9 }, (callInIframe && { marginTop: 0 })), children: remoteAvatar })] })] }) }));
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [status === 'ringing' && ((0, jsx_runtime_1.jsx)(fuselage_1.Flex.Container, { direction: 'column', justifyContent: 'center', children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { width: 'full', minHeight: 'sh', alignItems: 'center', backgroundColor: 'dark', overflow: 'hidden', position: 'relative', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { position: 'absolute', zIndex: 1, style: {
                                top: '5%',
                                right: '2%',
                            }, className: 'meet__video--self', backgroundColor: 'dark', alignItems: 'center', children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { style: {
                                    display: 'block',
                                    margin: 'auto',
                                }, children: (0, jsx_runtime_1.jsx)(ui_avatar_1.UserAvatar, { username: agentName, size: isLocalMobileDevice ? 'x32' : 'x48' }) }) }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { position: 'absolute', zIndex: 1, style: {
                                top: '20%',
                                display: 'flex',
                                justifyContent: 'center',
                                flexDirection: 'column',
                            }, alignItems: 'center', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { style: {
                                        display: 'block',
                                        margin: 'auto',
                                    }, children: (0, jsx_runtime_1.jsx)(ui_avatar_1.UserAvatar, { username: visitorName, size: 'x124' }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { color: 'white', fontSize: 16, margin: 15, children: "Calling..." }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { style: {
                                        color: 'white',
                                        fontSize: isLocalMobileDevice ? 15 : 22,
                                    }, children: visitorName })] })] }) })), status === 'declined' && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { minHeight: '90%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: 's1', children: t('Call_declined') })), status === 'inProgress' && ((0, jsx_runtime_1.jsx)(fuselage_1.Flex.Container, { direction: 'column', justifyContent: 'center', children: visitorToken ? showCallPage(visitorName, agentName) : showCallPage(agentName, visitorName) }))] }));
};
exports.default = CallPage;
