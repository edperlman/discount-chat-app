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
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const GenericModal_1 = __importDefault(require("../../../components/GenericModal"));
const GenericTable_1 = require("../../../components/GenericTable");
const useEndpointAction_1 = require("../../../hooks/useEndpointAction");
const RemoveManagerButton = ({ _id, reload }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const deleteAction = (0, useEndpointAction_1.useEndpointAction)('DELETE', '/v1/livechat/users/manager/:_id', { keys: { _id } });
    const setModal = (0, ui_contexts_1.useSetModal)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const handleRemoveClick = (0, fuselage_hooks_1.useMutableCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield deleteAction();
        reload();
    }));
    const handleDelete = (0, fuselage_hooks_1.useMutableCallback)((e) => {
        e.stopPropagation();
        const onDeleteManager = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield handleRemoveClick();
                dispatchToastMessage({ type: 'success', message: t('Manager_removed') });
            }
            catch (error) {
                (typeof error === 'string' || error instanceof Error) && dispatchToastMessage({ type: 'error', message: error });
            }
            setModal();
        });
        setModal((0, jsx_runtime_1.jsx)(GenericModal_1.default, { variant: 'danger', onConfirm: onDeleteManager, onCancel: () => setModal(), onClose: () => setModal(), confirmText: t('Delete') }));
    });
    return ((0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { fontScale: 'p2', color: 'hint', withTruncatedText: true, children: (0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { small: true, icon: 'trash', title: t('Remove'), onClick: handleDelete }) }));
};
exports.default = RemoveManagerButton;
