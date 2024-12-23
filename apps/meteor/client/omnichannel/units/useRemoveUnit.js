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
exports.useRemoveUnit = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importDefault(require("react"));
const GenericModal_1 = __importDefault(require("../../components/GenericModal"));
const useRemoveUnit = () => {
    const t = (0, ui_contexts_1.useTranslation)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const router = (0, ui_contexts_1.useRouter)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const queryClient = (0, react_query_1.useQueryClient)();
    const removeUnit = (0, ui_contexts_1.useMethod)('livechat:removeUnit');
    const handleDelete = (0, fuselage_hooks_1.useMutableCallback)((id) => {
        const onDeleteAgent = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield removeUnit(id);
                dispatchToastMessage({ type: 'success', message: t('Unit_removed') });
                router.navigate('/omnichannel/units');
                queryClient.invalidateQueries(['livechat-units']);
            }
            catch (error) {
                dispatchToastMessage({ type: 'error', message: error });
            }
            finally {
                setModal();
            }
        });
        setModal((0, jsx_runtime_1.jsx)(GenericModal_1.default, { "data-qa-id": 'units-confirm-delete-modal', variant: 'danger', onConfirm: onDeleteAgent, onCancel: () => setModal(), confirmText: t('Delete') }));
    });
    return handleDelete;
};
exports.useRemoveUnit = useRemoveUnit;
