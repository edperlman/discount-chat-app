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
exports.ComposerOmnichannelJoin = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_composer_1 = require("@rocket.chat/ui-composer");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const RoomContext_1 = require("../../contexts/RoomContext");
const ComposerOmnichannelJoin = () => {
    const room = (0, RoomContext_1.useOmnichannelRoom)();
    const join = (0, ui_contexts_1.useEndpoint)('GET', `/v1/livechat/room.join`);
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsxs)(ui_composer_1.MessageFooterCallout, { children: [(0, jsx_runtime_1.jsx)(ui_composer_1.MessageFooterCalloutContent, { children: t('room_is_read_only') }), (0, jsx_runtime_1.jsx)(ui_composer_1.MessageFooterCalloutAction, { onClick: () => __awaiter(void 0, void 0, void 0, function* () {
                    try {
                        yield join({
                            roomId: room._id,
                        });
                    }
                    catch (error) {
                        dispatchToastMessage({ type: 'error', message: error });
                    }
                }), children: t('Join') })] }));
};
exports.ComposerOmnichannelJoin = ComposerOmnichannelJoin;
