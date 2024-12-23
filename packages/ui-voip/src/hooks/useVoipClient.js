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
exports.useVoipClient = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("react");
const useWebRtcServers_1 = require("./useWebRtcServers");
const VoipClient_1 = __importDefault(require("../lib/VoipClient"));
const useVoipClient = ({ enabled = true, autoRegister = true } = {}) => {
    const { _id: userId } = (0, ui_contexts_1.useUser)() || {};
    const voipClientRef = (0, react_1.useRef)(null);
    const getRegistrationInfo = (0, ui_contexts_1.useEndpoint)('GET', '/v1/voip-freeswitch.extension.getRegistrationInfoByUserId');
    const iceServers = (0, useWebRtcServers_1.useWebRtcServers)();
    const { data: voipClient, error } = (0, react_query_1.useQuery)(['voip-client', enabled, userId, iceServers], () => __awaiter(void 0, void 0, void 0, function* () {
        if (voipClientRef.current) {
            voipClientRef.current.clear();
        }
        if (!userId) {
            throw Error('error-user-not-found');
        }
        const registrationInfo = yield getRegistrationInfo({ userId })
            .then((registration) => {
            if (!registration) {
                throw Error('error-registration-not-found');
            }
            return registration;
        })
            .catch((e) => {
            throw Error(e.error || 'error-registration-not-found');
        });
        const { extension: { extension }, credentials: { websocketPath, password }, } = registrationInfo;
        const config = {
            iceServers,
            authUserName: extension,
            authPassword: password,
            sipRegistrarHostnameOrIP: new URL(websocketPath).host,
            webSocketURI: websocketPath,
            connectionRetryCount: Number(10), // TODO: get from settings
            enableKeepAliveUsingOptionsForUnstableNetworks: true, // TODO: get from settings
        };
        const voipClient = yield VoipClient_1.default.create(config);
        if (autoRegister) {
            voipClient.register();
        }
        return voipClient;
    }), {
        initialData: null,
        enabled,
    });
    (0, react_1.useEffect)(() => {
        voipClientRef.current = voipClient;
        return () => { var _a; return (_a = voipClientRef.current) === null || _a === void 0 ? void 0 : _a.clear(); };
    }, [voipClient]);
    return { voipClient, error };
};
exports.useVoipClient = useVoipClient;
