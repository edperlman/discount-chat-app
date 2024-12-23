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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallProvider = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const core_typings_1 = require("@rocket.chat/core-typings");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const random_1 = require("@rocket.chat/random");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_dom_1 = require("react-dom");
const useVoipSounds_1 = require("./hooks/useVoipSounds");
const CallContext_1 = require("../../contexts/CallContext");
const useDialModal_1 = require("../../hooks/useDialModal");
const useVoipClient_1 = require("../../hooks/useVoipClient");
const roomCoordinator_1 = require("../../lib/rooms/roomCoordinator");
const parseOutboundPhoneNumber_1 = require("../../lib/voip/parseOutboundPhoneNumber");
const WrapUpCallModal_1 = require("../../voip/components/modals/WrapUpCallModal");
const CallProvider = ({ children }) => {
    const [clientState, setClientState] = (0, react_1.useState)('unregistered');
    const voipEnabled = (0, ui_contexts_1.useSetting)('VoIP_Enabled');
    const subscribeToNotifyUser = (0, ui_contexts_1.useStream)('notify-user');
    const dispatchEvent = (0, ui_contexts_1.useEndpoint)('POST', '/v1/voip/events');
    const visitorEndpoint = (0, ui_contexts_1.useEndpoint)('POST', '/v1/livechat/visitor');
    const voipEndpoint = (0, ui_contexts_1.useEndpoint)('GET', '/v1/voip/room');
    const voipCloseRoomEndpoint = (0, ui_contexts_1.useEndpoint)('POST', '/v1/voip/room.close');
    const getContactBy = (0, ui_contexts_1.useEndpoint)('GET', '/v1/omnichannel/contact.search');
    const setModal = (0, ui_contexts_1.useSetModal)();
    const t = (0, ui_contexts_1.useTranslation)();
    const result = (0, useVoipClient_1.useVoipClient)();
    const user = (0, ui_contexts_1.useUser)();
    const router = (0, ui_contexts_1.useRouter)();
    const setOutputMediaDevice = (0, ui_contexts_1.useSetOutputMediaDevice)();
    const setInputMediaDevice = (0, ui_contexts_1.useSetInputMediaDevice)();
    const hasVoIPEnterpriseLicense = (0, CallContext_1.useIsVoipEnterprise)();
    const remoteAudioMediaRef = (0, react_1.useRef)(null); // TODO: Create a dedicated file for the AUDIO and make the controls accessible
    const [queueCounter, setQueueCounter] = (0, react_1.useState)(0);
    const [queueName, setQueueName] = (0, react_1.useState)('');
    const [roomInfo, setRoomInfo] = (0, react_1.useState)({ v: {}, rid: '' });
    const { openDialModal } = (0, useDialModal_1.useDialModal)();
    const voipSounds = (0, useVoipSounds_1.useVoipSounds)();
    const closeRoom = (0, react_1.useCallback)((...args_1) => __awaiter(void 0, [...args_1], void 0, function* (data = {}) {
        var _a;
        roomInfo &&
            (yield voipCloseRoomEndpoint({
                rid: roomInfo.rid,
                token: roomInfo.v.token || '',
                options: { comment: data === null || data === void 0 ? void 0 : data.comment, tags: data === null || data === void 0 ? void 0 : data.tags },
            }));
        router.navigate('/home');
        const queueAggregator = (_a = result.voipClient) === null || _a === void 0 ? void 0 : _a.getAggregator();
        if (queueAggregator) {
            queueAggregator.callEnded();
        }
    }), [router, result === null || result === void 0 ? void 0 : result.voipClient, roomInfo, voipCloseRoomEndpoint]);
    const openWrapUpModal = (0, react_1.useCallback)(() => {
        setModal(() => (0, jsx_runtime_1.jsx)(WrapUpCallModal_1.WrapUpCallModal, { closeRoom: closeRoom }));
    }, [closeRoom, setModal]);
    const changeAudioOutputDevice = (0, fuselage_hooks_1.useMutableCallback)((selectedAudioDevice) => {
        (remoteAudioMediaRef === null || remoteAudioMediaRef === void 0 ? void 0 : remoteAudioMediaRef.current) &&
            setOutputMediaDevice({ outputDevice: selectedAudioDevice, HTMLAudioElement: remoteAudioMediaRef.current });
    });
    const changeAudioInputDevice = (0, fuselage_hooks_1.useMutableCallback)((selectedAudioDevice) => {
        if (!result.voipClient) {
            return;
        }
        const constraints = { audio: { deviceId: { exact: selectedAudioDevice.id } } };
        // TODO: Migrate the classes that manage MediaStream to a more react based approach (using contexts/providers perhaps)
        // For now the MediaStream management is very coupled with the VoIP client,
        // decoupling it will make it usable by other areas of the project that needs to handle MediaStreams and avoid code duplication
        result.voipClient.changeAudioInputDevice(constraints);
        setInputMediaDevice(selectedAudioDevice);
    });
    const [queueAggregator, setQueueAggregator] = (0, react_1.useState)();
    const [networkStatus, setNetworkStatus] = (0, react_1.useState)('online');
    (0, react_1.useEffect)(() => {
        const { voipClient } = result || {};
        if (!voipClient) {
            return;
        }
        setQueueAggregator(voipClient.getAggregator());
        return () => {
            if (clientState === 'registered') {
                return voipClient.unregister();
            }
        };
    }, [result, clientState]);
    const openRoom = (0, react_1.useCallback)((rid) => {
        roomCoordinator_1.roomCoordinator.openRouteLink('v', { rid });
    }, []);
    const findOrCreateVisitor = (0, react_1.useCallback)((caller) => __awaiter(void 0, void 0, void 0, function* () {
        const phone = (0, parseOutboundPhoneNumber_1.parseOutboundPhoneNumber)(caller.callerId);
        const { contact } = yield getContactBy({ phone });
        if (contact) {
            return contact;
        }
        const { visitor } = yield visitorEndpoint({
            visitor: {
                token: random_1.Random.id(),
                phone,
                name: caller.callerName || phone,
            },
        });
        return visitor;
    }), [getContactBy, visitorEndpoint]);
    const createRoom = (0, react_1.useCallback)((caller_1, ...args_1) => __awaiter(void 0, [caller_1, ...args_1], void 0, function* (caller, direction = 'inbound') {
        var _a;
        if (!user) {
            return '';
        }
        try {
            const visitor = yield findOrCreateVisitor(caller);
            const voipRoom = yield voipEndpoint({ token: visitor.token, agentId: user._id, direction });
            openRoom(voipRoom.room._id);
            voipRoom.room && setRoomInfo({ v: { token: voipRoom.room.v.token }, rid: voipRoom.room._id });
            const queueAggregator = (_a = result.voipClient) === null || _a === void 0 ? void 0 : _a.getAggregator();
            if (queueAggregator) {
                queueAggregator.callStarted();
            }
            return voipRoom.room._id;
        }
        catch (error) {
            console.error(`Error while creating a visitor ${error}`);
            return '';
        }
    }), [openRoom, result.voipClient, user, voipEndpoint, findOrCreateVisitor]);
    (0, react_1.useEffect)(() => {
        if (!voipEnabled || !user || !queueAggregator) {
            return;
        }
        const handleEventReceived = (event) => __awaiter(void 0, void 0, void 0, function* () {
            if ((0, core_typings_1.isVoipEventAgentCalled)(event)) {
                const { data } = event;
                queueAggregator.callRinging({ queuename: data.queue, callerid: data.callerId });
                setQueueName(queueAggregator.getCurrentQueueName());
                return;
            }
            if ((0, core_typings_1.isVoipEventAgentConnected)(event)) {
                const { data } = event;
                queueAggregator.callPickedup({ queuename: data.queue, queuedcalls: data.queuedCalls, waittimeinqueue: data.waitTimeInQueue });
                setQueueName(queueAggregator.getCurrentQueueName());
                setQueueCounter(queueAggregator.getCallWaitingCount());
                return;
            }
            if ((0, core_typings_1.isVoipEventCallerJoined)(event)) {
                const { data } = event;
                queueAggregator.queueJoined({ queuename: data.queue, callerid: data.callerId, queuedcalls: data.queuedCalls });
                setQueueCounter(queueAggregator.getCallWaitingCount());
                return;
            }
            if ((0, core_typings_1.isVoipEventQueueMemberAdded)(event)) {
                const { data } = event;
                queueAggregator.memberAdded({ queuename: data.queue, queuedcalls: data.queuedCalls });
                setQueueName(queueAggregator.getCurrentQueueName());
                setQueueCounter(queueAggregator.getCallWaitingCount());
                return;
            }
            if ((0, core_typings_1.isVoipEventQueueMemberRemoved)(event)) {
                const { data } = event;
                queueAggregator.memberRemoved({ queuename: data.queue, queuedcalls: data.queuedCalls });
                setQueueCounter(queueAggregator.getCallWaitingCount());
                return;
            }
            if ((0, core_typings_1.isVoipEventCallAbandoned)(event)) {
                const { data } = event;
                queueAggregator.queueAbandoned({ queuename: data.queue, queuedcallafterabandon: data.queuedCallAfterAbandon });
                setQueueName(queueAggregator.getCurrentQueueName());
                setQueueCounter(queueAggregator.getCallWaitingCount());
                return;
            }
            console.warn('Unknown event received');
        });
        return subscribeToNotifyUser(`${user._id}/voip.events`, handleEventReceived);
    }, [subscribeToNotifyUser, user, queueAggregator, voipEnabled]);
    // This was causing event duplication before, so we'll leave this here for now
    (0, react_1.useEffect)(() => {
        if (!voipEnabled || !user || !queueAggregator) {
            return;
        }
        return subscribeToNotifyUser(`${user._id}/call.hangup`, (event) => {
            setQueueName(queueAggregator.getCurrentQueueName());
            if (hasVoIPEnterpriseLicense) {
                openWrapUpModal();
                return;
            }
            closeRoom();
            dispatchEvent({ event: core_typings_1.VoipClientEvents['VOIP-CALL-ENDED'], rid: event.roomId });
        });
    }, [openWrapUpModal, queueAggregator, subscribeToNotifyUser, user, voipEnabled, dispatchEvent, hasVoIPEnterpriseLicense, closeRoom]);
    (0, react_1.useEffect)(() => {
        if (!result.voipClient) {
            return;
        }
        const offRegistered = result.voipClient.on('registered', () => setClientState('registered'));
        const offUnregistered = result.voipClient.on('unregistered', () => setClientState('unregistered'));
        return () => {
            offRegistered();
            offUnregistered();
        };
    }, [result.voipClient]);
    (0, react_1.useEffect)(() => {
        if (!result.voipClient) {
            return;
        }
        /*
         * This code may need a revisit when we handle callinqueue differently.
         * Check clickup tasks for more details
         * https://app.clickup.com/t/22hy1k4
         * When customer called a queue (Either using skype or using internal number), call would get established
         * customer would hear agent's voice but agent would not hear anything from customer.
         * This issue was observed on unstable. It was found to be inconsistent to reproduce.
         * On some developer env, it would happen randomly. On Safari it did not happen if
         * user refreshes before taking every call.
         *
         * The reason behind this was as soon as agent accepts a call, queueCounter would change.
         * This change will trigger re-rendering of media and creation of audio element.
         * This audio element gets used by voipClient to render the remote audio.
         * Because the re-render happened, it would hold a stale reference.
         *
         * If the dom is inspected, audio element just before body is usually created by this class.
         * this audio element.srcObject contains null value. In working case, it should display
         * valid stream object.
         *
         * Reason for inconsistencies :
         * This element is utilized in VoIPUser::setupRemoteMedia
         * This function is called when webRTC receives a remote track event. i.e when the webrtc's peer connection
         * starts receiving media. This event call back depends on several factors. How does asterisk setup streams.
         * How does it creates a bridge which patches up the agent and customer (Media is flowing thru asterisk).
         * When it works in de-environment, it was observed that the audio element in dom and the audio element hold
         * by VoIPUser is different. Nonetheless, this stale audio element holds valid media stream, which is being played.
         * Hence sometimes the audio is heard.
         *
         * Ideally call component once gets stable, should not get rerendered. Queue, Room creation are the parameters
         * which should be independent and should not control the call component.
         *
         * Solution :
         * Either make the audio elemenent rendered independent of rest of the DOM.
         * or implement useEffect. This useEffect will reset the rendering elements with the latest audio tag.
         *
         * Note : If this code gets refactor, revisit the line below to check if this call is needed.
         *
         */
        remoteAudioMediaRef.current && result.voipClient.switchMediaRenderer({ remoteMediaElement: remoteAudioMediaRef.current });
    }, [result.voipClient]);
    (0, react_1.useEffect)(() => {
        if (!result.voipClient) {
            return;
        }
        if (!user) {
            return;
        }
        const onCallEstablished = (callDetails) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            if (!callDetails.callInfo) {
                return;
            }
            voipSounds.stopAll();
            if (callDetails.userState !== core_typings_1.UserState.UAC) {
                return;
            }
            // Agent has sent Invite. So it must create a room.
            const { callInfo } = callDetails;
            // While making the call, there is no remote media element available.
            // When the call is ringing we have that element created. But we still
            // do not want it to be attached.
            // When call gets established, then switch the media renderer.
            remoteAudioMediaRef.current && ((_a = result.voipClient) === null || _a === void 0 ? void 0 : _a.switchMediaRenderer({ remoteMediaElement: remoteAudioMediaRef.current }));
            const roomId = yield createRoom(callInfo, 'outbound');
            dispatchEvent({ event: core_typings_1.VoipClientEvents['VOIP-CALL-STARTED'], rid: roomId });
        });
        const onNetworkConnected = () => {
            if (networkStatus === 'offline') {
                setNetworkStatus('online');
            }
        };
        const onNetworkDisconnected = () => {
            var _a, _b, _c;
            // Transitioning from online -> offline
            // If there is ongoing call, terminate it or if we are processing an incoming/outgoing call
            // reject it.
            if (networkStatus === 'online') {
                setNetworkStatus('offline');
                switch ((_a = result.voipClient) === null || _a === void 0 ? void 0 : _a.callerInfo.state) {
                    case 'IN_CALL':
                    case 'ON_HOLD':
                        (_b = result.voipClient) === null || _b === void 0 ? void 0 : _b.endCall();
                        break;
                    case 'OFFER_RECEIVED':
                    case 'ANSWER_SENT':
                        (_c = result.voipClient) === null || _c === void 0 ? void 0 : _c.rejectCall();
                        break;
                }
            }
        };
        const onRinging = () => {
            voipSounds.play('outbound-call-ringing');
        };
        const onIncomingCallRinging = () => {
            voipSounds.play('telephone');
        };
        const onCallTerminated = () => {
            voipSounds.play('call-ended', false);
            voipSounds.stopAll();
        };
        const onCallFailed = (reason) => {
            switch (reason) {
                case 'Not Found':
                    // This happens when the call matches dialplan and goes to the world, but the trunk doesnt find the number.
                    openDialModal({ errorMessage: t('Dialed_number_doesnt_exist') });
                    break;
                case 'Address Incomplete':
                    // This happens when the dialed number doesnt match a valid asterisk dialplan pattern or the number is invalid.
                    openDialModal({ errorMessage: t('Dialed_number_is_incomplete') });
                    break;
                case 'Request Terminated':
                    break;
                default:
                    openDialModal({ errorMessage: t('Something_went_wrong_try_again_later') });
            }
        };
        result.voipClient.onNetworkEvent('connected', onNetworkConnected);
        result.voipClient.onNetworkEvent('disconnected', onNetworkDisconnected);
        result.voipClient.onNetworkEvent('connectionerror', onNetworkDisconnected);
        result.voipClient.onNetworkEvent('localnetworkonline', onNetworkConnected);
        result.voipClient.onNetworkEvent('localnetworkoffline', onNetworkDisconnected);
        result.voipClient.on('callestablished', onCallEstablished);
        result.voipClient.on('ringing', onRinging); // not called for incoming call
        result.voipClient.on('incomingcall', onIncomingCallRinging);
        result.voipClient.on('callterminated', onCallTerminated);
        if ((0, useVoipClient_1.isOutboundClient)(result.voipClient)) {
            result.voipClient.on('callfailed', onCallFailed);
        }
        return () => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            (_a = result.voipClient) === null || _a === void 0 ? void 0 : _a.offNetworkEvent('connected', onNetworkConnected);
            (_b = result.voipClient) === null || _b === void 0 ? void 0 : _b.offNetworkEvent('disconnected', onNetworkDisconnected);
            (_c = result.voipClient) === null || _c === void 0 ? void 0 : _c.offNetworkEvent('connectionerror', onNetworkDisconnected);
            (_d = result.voipClient) === null || _d === void 0 ? void 0 : _d.offNetworkEvent('localnetworkonline', onNetworkConnected);
            (_e = result.voipClient) === null || _e === void 0 ? void 0 : _e.offNetworkEvent('localnetworkoffline', onNetworkDisconnected);
            (_f = result.voipClient) === null || _f === void 0 ? void 0 : _f.off('incomingcall', onIncomingCallRinging);
            (_g = result.voipClient) === null || _g === void 0 ? void 0 : _g.off('ringing', onRinging);
            (_h = result.voipClient) === null || _h === void 0 ? void 0 : _h.off('callestablished', onCallEstablished);
            (_j = result.voipClient) === null || _j === void 0 ? void 0 : _j.off('callterminated', onCallTerminated);
            if ((0, useVoipClient_1.isOutboundClient)(result.voipClient)) {
                (_k = result.voipClient) === null || _k === void 0 ? void 0 : _k.off('callfailed', onCallFailed);
            }
        };
    }, [createRoom, dispatchEvent, networkStatus, openDialModal, result.voipClient, voipSounds, t, user]);
    const contextValue = (0, react_1.useMemo)(() => {
        if (!voipEnabled) {
            return {
                enabled: false,
                ready: false,
                outBoundCallsAllowed: undefined, // set to true only if enterprise license is present.
                outBoundCallsEnabled: undefined, // set to true even if enterprise license is not present.
                outBoundCallsEnabledForUser: undefined, // set to true if the user has enterprise license, but is not able to make outbound calls. (busy, or disabled)
            };
        }
        if (!(user === null || user === void 0 ? void 0 : user.extension)) {
            return {
                enabled: false,
                ready: false,
                outBoundCallsAllowed: undefined, // set to true only if enterprise license is present.
                outBoundCallsEnabled: undefined, // set to true even if enterprise license is not present.
                outBoundCallsEnabledForUser: undefined, // set to true if the user has enterprise license, but is not able to make outbound calls. (busy, or disabled)
            };
        }
        if (result.error) {
            return {
                enabled: true,
                ready: false,
                error: result.error,
                outBoundCallsAllowed: undefined, // set to true only if enterprise license is present.
                outBoundCallsEnabled: undefined, // set to true even if enterprise license is not present.
                outBoundCallsEnabledForUser: undefined, // set to true if the user has enterprise license, but is not able to make outbound calls. (busy, or disabled)
            };
        }
        if (!result.voipClient) {
            return {
                enabled: true,
                ready: false,
                outBoundCallsAllowed: undefined, // set to true only if enterprise license is present.
                outBoundCallsEnabled: undefined, // set to true even if enterprise license is not present.
                outBoundCallsEnabledForUser: undefined, // set to true if the user has enterprise license, but is not able to make outbound calls. (busy, or disabled)
            };
        }
        const { registrationInfo, voipClient } = result;
        return {
            outBoundCallsAllowed: hasVoIPEnterpriseLicense, // set to true only if enterprise license is present.
            outBoundCallsEnabled: hasVoIPEnterpriseLicense, // set to true even if enterprise license is not present.
            outBoundCallsEnabledForUser: hasVoIPEnterpriseLicense && clientState === 'registered' && !['IN_CALL', 'ON_HOLD'].includes(voipClient.callerInfo.state), // set to true if the user has enterprise license, but is not able to make outbound calls. (busy, or disabled)
            enabled: true,
            ready: true,
            openedRoomInfo: roomInfo,
            voipClient,
            registrationInfo,
            queueCounter,
            queueName,
            actions: {
                mute: () => voipClient.muteCall(true), // voipClient.mute(),
                unmute: () => voipClient.muteCall(false), // voipClient.unmute()
                pause: () => voipClient.holdCall(true), // voipClient.pause()
                resume: () => voipClient.holdCall(false), // voipClient.resume()
                end: () => voipClient.endCall(),
                pickUp: () => __awaiter(void 0, void 0, void 0, function* () { return remoteAudioMediaRef.current && voipClient.acceptCall({ remoteMediaElement: remoteAudioMediaRef.current }); }),
                reject: () => voipClient.rejectCall(),
            },
            openRoom,
            createRoom,
            closeRoom,
            networkStatus,
            openWrapUpModal,
            changeAudioOutputDevice,
            changeAudioInputDevice,
            register: () => voipClient.register(),
            unregister: () => voipClient.unregister(),
        };
    }, [
        voipEnabled,
        user === null || user === void 0 ? void 0 : user.extension,
        result,
        hasVoIPEnterpriseLicense,
        clientState,
        roomInfo,
        queueCounter,
        queueName,
        openRoom,
        createRoom,
        closeRoom,
        openWrapUpModal,
        changeAudioOutputDevice,
        changeAudioInputDevice,
        networkStatus,
    ]);
    return ((0, jsx_runtime_1.jsxs)(CallContext_1.CallContext.Provider, { value: contextValue, children: [children, contextValue.enabled &&
                (0, react_dom_1.createPortal)((0, jsx_runtime_1.jsx)("audio", { ref: remoteAudioMediaRef, children: (0, jsx_runtime_1.jsx)("track", { kind: 'captions' }) }), document.body)] }));
};
exports.CallProvider = CallProvider;
