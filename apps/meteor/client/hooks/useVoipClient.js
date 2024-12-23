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
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOutboundClient = exports.useVoipClient = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const jsrsasign_1 = require("jsrsasign");
const react_1 = require("react");
const useHasLicenseModule_1 = require("./useHasLicenseModule");
const EEVoipClient_1 = require("../lib/voip/EEVoipClient");
const VoIPUser_1 = require("../lib/voip/VoIPUser");
const useWebRtcServers_1 = require("../providers/CallProvider/hooks/useWebRtcServers");
const empty = {};
const isSignedResponse = (data) => typeof (data === null || data === void 0 ? void 0 : data.result) === 'string';
// Currently we only support the websocket connection and the SIP proxy connection being from the same host,
// we need to add a new setting for SIP proxy if we want to support different hosts for them.
const useVoipClient = () => {
    const settingVoipEnabled = (0, ui_contexts_1.useSetting)('VoIP_Enabled', false);
    const [voipConnectorEnabled, setVoipConnectorEnabled] = (0, fuselage_hooks_1.useSafely)((0, react_1.useState)(true));
    const voipRetryCount = (0, ui_contexts_1.useSetting)('VoIP_Retry_Count');
    const enableKeepAlive = (0, ui_contexts_1.useSetting)('VoIP_Enable_Keep_Alive_For_Unstable_Networks');
    const registrationInfo = (0, ui_contexts_1.useEndpoint)('GET', '/v1/connector.extension.getRegistrationInfoByUserId');
    const membership = (0, ui_contexts_1.useEndpoint)('GET', '/v1/voip/queues.getMembershipSubscription');
    const user = (0, ui_contexts_1.useUser)();
    const subscribeToNotifyLoggedIn = (0, ui_contexts_1.useStream)('notify-logged');
    const iceServers = (0, useWebRtcServers_1.useWebRtcServers)();
    const [result, setResult] = (0, fuselage_hooks_1.useSafely)((0, react_1.useState)({}));
    const isEE = (0, useHasLicenseModule_1.useHasLicenseModule)('voip-enterprise');
    const voipEnabled = settingVoipEnabled && voipConnectorEnabled;
    (0, react_1.useEffect)(() => {
        if (user) {
            return subscribeToNotifyLoggedIn(`voip.statuschanged`, (enabled) => {
                setVoipConnectorEnabled(enabled);
            });
        }
    }, [setResult, setVoipConnectorEnabled, subscribeToNotifyLoggedIn, user]);
    (0, react_1.useEffect)(() => {
        const uid = user === null || user === void 0 ? void 0 : user._id;
        const userExtension = user === null || user === void 0 ? void 0 : user.extension;
        if (!uid || !userExtension || !voipEnabled) {
            setResult(empty);
            return;
        }
        let client;
        registrationInfo({ id: uid }).then((data) => {
            var _a;
            let parsedData;
            if (isSignedResponse(data)) {
                const result = jsrsasign_1.KJUR.jws.JWS.parse(data.result);
                parsedData = (_a = result.payloadObj) === null || _a === void 0 ? void 0 : _a.context;
            }
            else {
                parsedData = data;
            }
            const { extensionDetails: { extension, password }, callServerConfig: { websocketPath }, } = parsedData;
            (() => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const wsURL = new URL(websocketPath);
                    const subscription = yield membership({ extension });
                    const config = {
                        authUserName: extension,
                        authPassword: password,
                        sipRegistrarHostnameOrIP: wsURL.host,
                        webSocketURI: websocketPath,
                        enableVideo: true,
                        iceServers,
                        connectionRetryCount: Number(voipRetryCount),
                        enableKeepAliveUsingOptionsForUnstableNetworks: Boolean(enableKeepAlive),
                    };
                    client = yield (isEE ? EEVoipClient_1.EEVoipClient.create(config) : VoIPUser_1.VoIPUser.create(config));
                    // Today we are hardcoding workflow mode.
                    // In future, this should be ready from configuration
                    client.setWorkflowMode(core_typings_1.WorkflowTypes.CONTACT_CENTER_USER);
                    client.setMembershipSubscription(subscription);
                    setResult({ voipClient: client, registrationInfo: parsedData });
                }
                catch (error) {
                    setResult({ error });
                }
            }))();
        }, (error) => {
            setResult({ error });
        });
        return () => {
            if (client) {
                client.clear();
            }
        };
    }, [iceServers, registrationInfo, setResult, membership, voipEnabled, user === null || user === void 0 ? void 0 : user._id, user === null || user === void 0 ? void 0 : user.extension, voipRetryCount, enableKeepAlive, isEE]);
    return result;
};
exports.useVoipClient = useVoipClient;
const isOutboundClient = (client) => client instanceof EEVoipClient_1.EEVoipClient;
exports.isOutboundClient = isOutboundClient;
