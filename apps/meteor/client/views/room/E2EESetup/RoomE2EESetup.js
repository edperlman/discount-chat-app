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
const ui_client_1 = require("@rocket.chat/ui-client");
const accounts_base_1 = require("meteor/accounts-base");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const RoomE2EENotAllowed_1 = __importDefault(require("./RoomE2EENotAllowed"));
const client_1 = require("../../../../app/e2e/client");
const E2EEState_1 = require("../../../../app/e2e/client/E2EEState");
const E2ERoomState_1 = require("../../../../app/e2e/client/E2ERoomState");
const RoomBody_1 = __importDefault(require("../body/RoomBody"));
const RoomBodyV2_1 = __importDefault(require("../body/RoomBodyV2"));
const RoomContext_1 = require("../contexts/RoomContext");
const useE2EERoomState_1 = require("../hooks/useE2EERoomState");
const useE2EEState_1 = require("../hooks/useE2EEState");
const RoomE2EESetup = () => {
    const room = (0, RoomContext_1.useRoom)();
    const e2eeState = (0, useE2EEState_1.useE2EEState)();
    const e2eRoomState = (0, useE2EERoomState_1.useE2EERoomState)(room._id);
    const { t } = (0, react_i18next_1.useTranslation)();
    const randomPassword = accounts_base_1.Accounts.storageLocation.getItem('e2e.randomPassword');
    const onSavePassword = (0, react_1.useCallback)(() => {
        if (!randomPassword) {
            return;
        }
        client_1.e2e.openSaveE2EEPasswordModal(randomPassword);
    }, [randomPassword]);
    const onEnterE2EEPassword = (0, react_1.useCallback)(() => client_1.e2e.decodePrivateKeyFlow(), []);
    if (e2eeState === E2EEState_1.E2EEState.SAVE_PASSWORD) {
        return ((0, jsx_runtime_1.jsx)(RoomE2EENotAllowed_1.default, { title: t('__roomName__is_encrypted', { roomName: room.name }), subTitle: t('Save_your_encryption_password_to_access'), icon: 'key', action: onSavePassword, btnText: t('Save_E2EE_password') }));
    }
    if (e2eeState === E2EEState_1.E2EEState.ENTER_PASSWORD) {
        return ((0, jsx_runtime_1.jsx)(RoomE2EENotAllowed_1.default, { title: t('__roomName__is_encrypted', { roomName: room.name }), subTitle: t('Enter_your_E2E_password_to_access'), icon: 'key', action: onEnterE2EEPassword, btnText: t('Enter_your_E2E_password') }));
    }
    if (e2eRoomState === E2ERoomState_1.E2ERoomState.WAITING_KEYS) {
        return ((0, jsx_runtime_1.jsx)(RoomE2EENotAllowed_1.default, { title: t('Check_back_later'), subTitle: t('__roomName__encryption_keys_need_to_be_updated', { roomName: room.name }), icon: 'clock' }));
    }
    return ((0, jsx_runtime_1.jsxs)(ui_client_1.FeaturePreview, { feature: 'newNavigation', children: [(0, jsx_runtime_1.jsx)(ui_client_1.FeaturePreviewOn, { children: (0, jsx_runtime_1.jsx)(RoomBodyV2_1.default, {}) }), (0, jsx_runtime_1.jsx)(ui_client_1.FeaturePreviewOff, { children: (0, jsx_runtime_1.jsx)(RoomBody_1.default, {}) })] }));
};
exports.default = RoomE2EESetup;
