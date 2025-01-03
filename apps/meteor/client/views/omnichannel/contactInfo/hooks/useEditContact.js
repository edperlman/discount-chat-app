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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEditContact = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_i18next_1 = require("react-i18next");
const useContactRoute_1 = require("../../hooks/useContactRoute");
const useEditContact = (invalidateQueries) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const updateContact = (0, ui_contexts_1.useEndpoint)('POST', '/v1/omnichannel/contacts.update');
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const queryClient = (0, react_query_1.useQueryClient)();
    const handleNavigate = (0, useContactRoute_1.useContactRoute)();
    return (0, react_query_1.useMutation)({
        mutationFn: updateContact,
        onSuccess: (_a) => __awaiter(void 0, [_a], void 0, function* ({ contact }) {
            handleNavigate({ context: 'details', id: contact === null || contact === void 0 ? void 0 : contact._id });
            dispatchToastMessage({ type: 'success', message: t('Contact_has_been_updated') });
            yield queryClient.invalidateQueries({ queryKey: invalidateQueries });
        }),
        onError: (error) => {
            dispatchToastMessage({ type: 'error', message: error });
        },
    });
};
exports.useEditContact = useEditContact;