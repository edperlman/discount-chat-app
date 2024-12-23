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
exports.useRemoveCannedResponse = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const GenericModal_1 = __importDefault(require("../../components/GenericModal"));
const useRemoveCannedResponse = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const router = (0, ui_contexts_1.useRouter)();
    const queryClient = (0, react_query_1.useQueryClient)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const removeCannedResponse = (0, ui_contexts_1.useMethod)('removeCannedResponse');
    const handleDelete = (0, fuselage_hooks_1.useMutableCallback)((id) => {
        const onDeleteCannedResponse = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield removeCannedResponse(id);
                queryClient.invalidateQueries(['getCannedResponses']);
                router.navigate('/omnichannel/canned-responses');
                dispatchToastMessage({ type: 'success', message: t('Canned_Response_Removed') });
            }
            catch (error) {
                dispatchToastMessage({ type: 'error', message: error });
            }
            finally {
                setModal(null);
            }
        });
        setModal((0, jsx_runtime_1.jsx)(GenericModal_1.default, { variant: 'danger', onConfirm: onDeleteCannedResponse, onCancel: () => setModal(null), onClose: () => setModal(null), confirmText: t('Delete') }));
    });
    return handleDelete;
};
exports.useRemoveCannedResponse = useRemoveCannedResponse;
