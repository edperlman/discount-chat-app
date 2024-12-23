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
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_client_1 = require("@rocket.chat/ui-client");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const FilterByText_1 = __importDefault(require("../../../../../components/FilterByText"));
const GenericModal_1 = __importDefault(require("../../../../../components/GenericModal"));
const ChatsContext_1 = require("../../contexts/ChatsContext");
const ChatsTableFilter = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const directoryRoute = (0, ui_contexts_1.useRoute)('omnichannel-directory');
    const removeClosedChats = (0, ui_contexts_1.useMethod)('livechat:removeAllClosedRooms');
    const queryClient = (0, react_query_1.useQueryClient)();
    const { filtersQuery, displayFilters, setFiltersQuery, removeFilter, textInputRef } = (0, ChatsContext_1.useChatsContext)();
    const handleRemoveAllClosed = (0, fuselage_hooks_1.useEffectEvent)(() => __awaiter(void 0, void 0, void 0, function* () {
        const onDeleteAll = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield removeClosedChats();
                queryClient.invalidateQueries(['current-chats']);
                dispatchToastMessage({ type: 'success', message: t('Chat_removed') });
            }
            catch (error) {
                dispatchToastMessage({ type: 'error', message: error });
            }
            finally {
                setModal(null);
            }
        });
        setModal((0, jsx_runtime_1.jsx)(GenericModal_1.default, { variant: 'danger', "data-qa-id": 'current-chats-modal-remove-all-closed', onConfirm: onDeleteAll, onCancel: () => setModal(null), confirmText: t('Delete') }));
    }));
    const menuItems = [
        {
            items: [
                {
                    id: 'delete-all-closed-chats',
                    variant: 'danger',
                    icon: 'trash',
                    content: t('Delete_all_closed_chats'),
                    onClick: handleRemoveAllClosed,
                },
            ],
        },
    ];
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(FilterByText_1.default, { ref: textInputRef, value: filtersQuery.guest, onChange: (event) => setFiltersQuery((prevState) => (Object.assign(Object.assign({}, prevState), { guest: event.target.value }))), children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: () => directoryRoute.push({
                            tab: 'chats',
                            context: 'filters',
                        }), icon: 'customize', children: t('Filters') }), (0, jsx_runtime_1.jsx)(ui_client_1.GenericMenu, { placement: 'bottom-end', detached: true, title: t('More'), sections: menuItems })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', flexWrap: 'wrap', mbe: 4, children: Object.entries(displayFilters).map(([value, label], index) => {
                    if (!label) {
                        return null;
                    }
                    return ((0, jsx_runtime_1.jsx)(fuselage_1.Chip, { mie: 8, mbe: 8, onClick: () => removeFilter(value), children: label }, index));
                }) })] }));
};
exports.default = ChatsTableFilter;
