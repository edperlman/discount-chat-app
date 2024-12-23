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
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const InviteUsers_1 = __importDefault(require("./InviteUsers"));
const useFormatDateAndTime_1 = require("../../../../../hooks/useFormatDateAndTime");
const RoomToolboxContext_1 = require("../../../contexts/RoomToolboxContext");
const InviteUsersWithData = ({ rid, onClickBack }) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const [{ isEditing, url, caption, error, daysAndMaxUses: { days, maxUses }, }, setInviteState,] = (0, react_1.useState)({
        isEditing: false,
        daysAndMaxUses: { days: '1', maxUses: '0' },
        url: '',
        caption: '',
        error: undefined,
    });
    const { closeTab } = (0, RoomToolboxContext_1.useRoomToolbox)();
    const format = (0, useFormatDateAndTime_1.useFormatDateAndTime)();
    const findOrCreateInvite = (0, ui_contexts_1.useEndpoint)('POST', '/v1/findOrCreateInvite');
    const handleEdit = (0, fuselage_hooks_1.useMutableCallback)(() => setInviteState((prevState) => (Object.assign(Object.assign({}, prevState), { isEditing: true }))));
    const handleBackToLink = (0, fuselage_hooks_1.useMutableCallback)(() => setInviteState((prevState) => (Object.assign(Object.assign({}, prevState), { isEditing: false }))));
    const linkExpirationText = (0, fuselage_hooks_1.useMutableCallback)((data) => {
        if (!data) {
            return '';
        }
        if (data.expires) {
            const expiration = new Date(data.expires);
            if (data.maxUses) {
                const usesLeft = data.maxUses - data.uses;
                return t('Your_invite_link_will_expire_on__date__or_after__usesLeft__uses', {
                    date: format(expiration),
                    usesLeft,
                });
            }
            return t('Your_invite_link_will_expire_on__date__', { date: format(expiration) });
        }
        if (data.maxUses) {
            const usesLeft = data.maxUses - data.uses;
            return t('Your_invite_link_will_expire_after__usesLeft__uses', { usesLeft });
        }
        return t('Your_invite_link_will_never_expire');
    });
    (0, react_1.useEffect)(() => {
        (() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const data = yield findOrCreateInvite({ rid, days: Number(days), maxUses: Number(maxUses) });
                setInviteState((prevState) => (Object.assign(Object.assign({}, prevState), { url: data === null || data === void 0 ? void 0 : data.url, caption: linkExpirationText(data) })));
                dispatchToastMessage({ type: 'success', message: t('Invite_link_generated') });
            }
            catch (error) {
                setInviteState((prevState) => (Object.assign(Object.assign({}, prevState), { error: error })));
            }
        }))();
    }, [dispatchToastMessage, t, findOrCreateInvite, linkExpirationText, rid, days, maxUses]);
    const handleGenerateLink = (0, fuselage_hooks_1.useMutableCallback)((daysAndMaxUses) => {
        setInviteState((prevState) => (Object.assign(Object.assign({}, prevState), { daysAndMaxUses, isEditing: false })));
    });
    return ((0, jsx_runtime_1.jsx)(InviteUsers_1.default, { isEditing: isEditing, error: error, linkText: url, captionText: caption, daysAndMaxUses: { days, maxUses }, onClose: closeTab, onClickBackMembers: onClickBack, onClickBackLink: handleBackToLink, onClickEdit: handleEdit, onClickNewLink: handleGenerateLink }));
};
exports.default = InviteUsersWithData;
