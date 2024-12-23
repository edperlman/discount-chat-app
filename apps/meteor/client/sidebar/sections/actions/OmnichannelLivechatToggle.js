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
exports.OmnichannelLivechatToggle = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const useOmnichannelAgentAvailable_1 = require("../../../hooks/omnichannel/useOmnichannelAgentAvailable");
const OmnichannelLivechatToggle = (props) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const agentAvailable = (0, useOmnichannelAgentAvailable_1.useOmnichannelAgentAvailable)();
    const changeAgentStatus = (0, ui_contexts_1.useEndpoint)('POST', '/v1/livechat/agent.status');
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const handleAvailableStatusChange = (0, fuselage_hooks_1.useMutableCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield changeAgentStatus({});
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
    }));
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Sidebar.TopBar.Action, Object.assign({}, props, { id: 'omnichannel-status-toggle', title: agentAvailable ? t('Turn_off_answer_chats') : t('Turn_on_answer_chats'), success: agentAvailable, icon: agentAvailable ? 'message' : 'message-disabled', onClick: handleAvailableStatusChange })));
};
exports.OmnichannelLivechatToggle = OmnichannelLivechatToggle;
