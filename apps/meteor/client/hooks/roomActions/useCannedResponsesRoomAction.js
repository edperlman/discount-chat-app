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
exports.useCannedResponsesRoomAction = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const useHasLicenseModule_1 = require("../useHasLicenseModule");
const CannedResponse = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('../../omnichannel/cannedResponses/contextualBar/CannedResponse/WrapCannedResponseList'))));
const useCannedResponsesRoomAction = () => {
    const licensed = (0, useHasLicenseModule_1.useHasLicenseModule)('canned-responses') === true;
    const enabled = (0, ui_contexts_1.useSetting)('Canned_Responses_Enable', false);
    return (0, react_1.useMemo)(() => {
        if (!licensed || !enabled) {
            return undefined;
        }
        return {
            id: 'canned-responses',
            groups: ['live'],
            title: 'Canned_Responses',
            icon: 'canned-response',
            tabComponent: CannedResponse,
            order: 0,
        };
    }, [enabled, licensed]);
};
exports.useCannedResponsesRoomAction = useCannedResponsesRoomAction;
