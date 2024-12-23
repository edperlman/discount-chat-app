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
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const MessageListTab_1 = __importDefault(require("./MessageListTab"));
const onClientMessageReceived_1 = require("../../../lib/onClientMessageReceived");
const queryKeys_1 = require("../../../lib/queryKeys");
const mapMessageFromApi_1 = require("../../../lib/utils/mapMessageFromApi");
const RoomContext_1 = require("../contexts/RoomContext");
const StarredMessagesTab = () => {
    const getStarredMessages = (0, ui_contexts_1.useEndpoint)('GET', '/v1/chat.getStarredMessages');
    const room = (0, RoomContext_1.useRoom)();
    const starredMessagesQueryResult = (0, react_query_1.useQuery)({
        queryKey: queryKeys_1.roomsQueryKeys.starredMessages(room._id),
        queryFn: () => __awaiter(void 0, void 0, void 0, function* () {
            const messages = [];
            for (let offset = 0, result = yield getStarredMessages({ roomId: room._id, offset: 0 }); result.count > 0; 
            // eslint-disable-next-line no-await-in-loop
            offset += result.count, result = yield getStarredMessages({ roomId: room._id, offset })) {
                messages.push(...result.messages.map(mapMessageFromApi_1.mapMessageFromApi));
            }
            return Promise.all(messages.map(onClientMessageReceived_1.onClientMessageReceived));
        }),
    });
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsx)(MessageListTab_1.default, { iconName: 'star', title: t('Starred_Messages'), emptyResultMessage: t('No_starred_messages'), context: 'starred', queryResult: starredMessagesQueryResult }));
};
exports.default = StarredMessagesTab;
