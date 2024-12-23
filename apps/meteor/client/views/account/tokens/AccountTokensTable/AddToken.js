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
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const GenericModal_1 = __importDefault(require("../../../../components/GenericModal"));
const AddToken = ({ reload }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const userId = (0, ui_contexts_1.useUserId)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const createTokenFn = (0, ui_contexts_1.useMethod)('personalAccessTokens:generateToken');
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const initialValues = (0, react_1.useMemo)(() => ({ name: '', bypassTwoFactor: 'require' }), []);
    const { register, resetField, handleSubmit, control, formState: { isSubmitted, submitCount }, } = (0, react_hook_form_1.useForm)({ defaultValues: initialValues });
    const twoFactorAuthOptions = (0, react_1.useMemo)(() => [
        ['require', t('Require_Two_Factor_Authentication')],
        ['bypass', t('Ignore_Two_Factor_Authentication')],
    ], [t]);
    const handleAddToken = (0, react_1.useCallback)((_a) => __awaiter(void 0, [_a], void 0, function* ({ name: tokenName, bypassTwoFactor }) {
        try {
            const token = yield createTokenFn({ tokenName, bypassTwoFactor: bypassTwoFactor === 'bypass' });
            setModal((0, jsx_runtime_1.jsx)(GenericModal_1.default, { title: t('API_Personal_Access_Token_Generated'), onConfirm: () => setModal(null), onClose: () => setModal(null), children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { dangerouslySetInnerHTML: {
                        __html: t('API_Personal_Access_Token_Generated_Text_Token_s_UserId_s', {
                            token,
                            userId,
                        }),
                    } }) }));
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
    }), [createTokenFn, dispatchToastMessage, setModal, t, userId]);
    (0, react_1.useEffect)(() => {
        resetField('name');
        reload();
    }, [isSubmitted, submitCount, reload, resetField]);
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', is: 'form', onSubmit: handleSubmit(handleAddToken), mb: 8, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', width: '100%', children: (0, jsx_runtime_1.jsxs)(fuselage_1.Margins, { inlineEnd: 4, children: [(0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ "data-qa": 'PersonalTokenField' }, register('name'), { placeholder: t('API_Add_Personal_Access_Token') })), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'bypassTwoFactor', control: control, render: ({ field }) => (0, jsx_runtime_1.jsx)(fuselage_1.Select, Object.assign({}, field, { options: twoFactorAuthOptions })) }) })] }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, type: 'submit', children: t('Add') })] }));
};
exports.default = AddToken;
