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
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const crypto_1 = require("../../../app/livechat/client/externalFrame/crypto");
const SDKClient_1 = require("../../../app/utils/client/lib/SDKClient");
const RoomContext_1 = require("../room/contexts/RoomContext");
function ExternalFrameContainer() {
    const uid = (0, ui_contexts_1.useUserId)();
    const room = (0, RoomContext_1.useRoom)();
    const { 'X-Auth-Token': authToken } = SDKClient_1.sdk.rest.getCredentials() || {};
    const keyStr = (0, ui_contexts_1.useSetting)('Omnichannel_External_Frame_Encryption_JWK', '');
    const frameURLSetting = (0, ui_contexts_1.useSetting)('Omnichannel_External_Frame_URL', '');
    const token = (0, react_query_1.useQuery)(['externalFrame', keyStr, authToken], () => __awaiter(this, void 0, void 0, function* () {
        if (!keyStr || !authToken) {
            return '';
        }
        return (0, crypto_1.encrypt)(authToken, yield (0, crypto_1.getKeyFromString)(keyStr));
    }));
    const externalFrameUrl = (0, react_1.useMemo)(() => {
        if (!frameURLSetting || !uid || !room._id || !authToken || !token.data) {
            return '';
        }
        const frameURL = new URL(frameURLSetting);
        frameURL.searchParams.append('uid', uid);
        frameURL.searchParams.append('rid', room._id);
        frameURL.searchParams.append('t', authToken);
        return frameURL.toString();
    }, [frameURLSetting, uid, room._id, authToken, token.data]);
    if (!externalFrameUrl) {
        return null;
    }
    return ((0, jsx_runtime_1.jsx)("div", { className: 'flex-nav', children: (0, jsx_runtime_1.jsx)("iframe", { style: { width: '100%', height: '100%' }, title: 'external-frame', src: externalFrameUrl }) }));
}
exports.default = ExternalFrameContainer;
