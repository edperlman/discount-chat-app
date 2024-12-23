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
exports.useConfirmOwnerChanges = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const ConfirmOwnerChangeModal_1 = __importDefault(require("../../../../components/ConfirmOwnerChangeModal"));
const useConfirmOwnerChanges = () => {
    const setModal = (0, ui_contexts_1.useSetModal)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    return (action, modalProps, onChange) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield action();
        }
        catch (error) {
            if (error.errorType === 'user-last-owner') {
                const { shouldChangeOwner, shouldBeRemoved } = error.details;
                const handleConfirm = () => __awaiter(void 0, void 0, void 0, function* () {
                    yield action(true);
                    setModal();
                    onChange();
                });
                return setModal((0, jsx_runtime_1.jsx)(ConfirmOwnerChangeModal_1.default, Object.assign({}, modalProps, { shouldChangeOwner: shouldChangeOwner, shouldBeRemoved: shouldBeRemoved, onConfirm: handleConfirm, onCancel: () => setModal() })));
            }
            dispatchToastMessage({ type: 'error', message: error });
        }
    });
};
exports.useConfirmOwnerChanges = useConfirmOwnerChanges;
