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
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const GenericTable_1 = require("../../../components/GenericTable");
const SendTestButton = ({ id }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const sendTest = (0, ui_contexts_1.useEndpoint)('POST', '/v1/email-inbox.send-test/:_id', { _id: id });
    const handleOnClick = (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        e.stopPropagation();
        try {
            yield sendTest();
            dispatchToastMessage({
                type: 'success',
                message: t('Email_sent'),
            });
        }
        catch (error) {
            dispatchToastMessage({
                type: 'error',
                message: error,
            });
        }
    });
    return ((0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { icon: 'send', small: true, onClick: handleOnClick, children: t('Send_Test_Email') }) }));
};
exports.default = SendTestButton;
