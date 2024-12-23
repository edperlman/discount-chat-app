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
const EditRoom_1 = __importDefault(require("./EditRoom"));
const Contextualbar_1 = require("../../../components/Contextualbar");
const EditRoomWithData = ({ rid, onReload }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const router = (0, ui_contexts_1.useRouter)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const getAdminRooms = (0, ui_contexts_1.useEndpoint)('GET', '/v1/rooms.adminRooms.getRoom');
    const { data, isLoading, refetch } = (0, react_query_1.useQuery)(['rooms', rid, 'admin'], () => __awaiter(void 0, void 0, void 0, function* () {
        const rooms = yield getAdminRooms({ rid });
        return rooms;
    }), {
        onError: (error) => {
            dispatchToastMessage({ type: 'error', message: error });
        },
    });
    if (isLoading) {
        return (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarSkeleton, {});
    }
    const handleChange = () => {
        refetch();
        onReload();
    };
    const handleDelete = () => {
        onReload();
    };
    return data ? ((0, jsx_runtime_1.jsxs)(Contextualbar_1.Contextualbar, { children: [(0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarHeader, { children: [(0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarTitle, { children: t('Room_Info') }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarClose, { onClick: () => router.navigate('/admin/rooms') })] }), (0, jsx_runtime_1.jsx)(EditRoom_1.default, { room: data, onChange: handleChange, onDelete: handleDelete })] })) : null;
};
exports.default = EditRoomWithData;
