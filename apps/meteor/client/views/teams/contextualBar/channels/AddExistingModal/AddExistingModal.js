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
const RoomsAvailableForTeamsAutoComplete_1 = __importDefault(require("./RoomsAvailableForTeamsAutoComplete"));
const AddExistingModal = ({ teamId, onClose, reload }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const addRoomEndpoint = (0, ui_contexts_1.useEndpoint)('POST', '/v1/teams.addRooms');
    const { control, formState: { isDirty }, handleSubmit, } = (0, react_hook_form_1.useForm)({ defaultValues: { rooms: [] } });
    const handleAddChannels = (0, react_1.useCallback)((_a) => __awaiter(void 0, [_a], void 0, function* ({ rooms }) {
        try {
            yield addRoomEndpoint({
                rooms,
                teamId,
            });
            dispatchToastMessage({ type: 'success', message: t('Channels_added') });
            reload === null || reload === void 0 ? void 0 : reload();
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
        finally {
            onClose();
        }
    }), [addRoomEndpoint, teamId, onClose, dispatchToastMessage, reload, t]);
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Modal, { wrapperFunction: (props) => (0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({ is: 'form', onSubmit: handleSubmit(handleAddChannels) }, props)), children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Modal.Header, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Modal.Title, { children: t('Team_Add_existing_channels') }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Close, { onClick: onClose })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Content, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { mbe: 24, children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('Channels') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'rooms', render: ({ field: { value, onChange } }) => (0, jsx_runtime_1.jsx)(RoomsAvailableForTeamsAutoComplete_1.default, { value: value, onChange: onChange }) })] }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Footer, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Modal.FooterControllers, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: onClose, children: t('Cancel') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { disabled: !isDirty, type: 'submit', primary: true, children: t('Add') })] }) })] }));
};
exports.default = (0, react_1.memo)(AddExistingModal);
