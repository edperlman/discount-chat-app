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
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_composer_1 = require("@rocket.chat/ui-composer");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_hook_form_1 = require("react-hook-form");
const RoomContext_1 = require("../contexts/RoomContext");
const ComposerJoinWithPassword = () => {
    const t = (0, ui_contexts_1.useTranslation)();
    const room = (0, RoomContext_1.useRoom)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const joinChannelEndpoint = (0, ui_contexts_1.useEndpoint)('POST', '/v1/channels.join');
    const { control, handleSubmit, setError, formState: { errors, isDirty }, } = (0, react_hook_form_1.useForm)({ defaultValues: { joinCode: '' } });
    const handleJoinChannel = (_a) => __awaiter(void 0, [_a], void 0, function* ({ joinCode }) {
        try {
            yield joinChannelEndpoint({
                roomId: room._id,
                joinCode,
            });
        }
        catch (error) {
            setError('joinCode', { type: error.errorType, message: error.error });
            dispatchToastMessage({ type: 'error', message: error });
        }
    });
    return ((0, jsx_runtime_1.jsxs)(ui_composer_1.MessageFooterCallout, { is: 'form', "aria-label": t('Join_with_password'), onSubmit: handleSubmit(handleJoinChannel), children: [(0, jsx_runtime_1.jsx)(ui_composer_1.MessageFooterCalloutContent, { children: t('you_are_in_preview') }), (0, jsx_runtime_1.jsx)(ui_composer_1.MessageFooterCalloutContent, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'joinCode', control: control, render: ({ field }) => {
                        var _a;
                        return ((0, jsx_runtime_1.jsx)(fuselage_1.PasswordInput, Object.assign({ error: (_a = errors.joinCode) === null || _a === void 0 ? void 0 : _a.message }, field, { placeholder: t('you_are_in_preview_please_insert_the_password') })));
                    } }) }), (0, jsx_runtime_1.jsx)(ui_composer_1.MessageFooterCalloutAction, { type: 'submit', disabled: !isDirty, children: t('Join_with_password') })] }));
};
exports.default = ComposerJoinWithPassword;
