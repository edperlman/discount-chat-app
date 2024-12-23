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
exports.useAddMatrixUsers = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importDefault(require("react"));
const AddMatrixUsersModal_1 = __importDefault(require("./AddMatrixUsersModal"));
const useAddMatrixUsers = () => {
    const setModal = (0, ui_contexts_1.useSetModal)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const handleClose = (0, fuselage_hooks_1.useMutableCallback)(() => setModal(null));
    const dispatchVerifyEndpoint = (0, ui_contexts_1.useEndpoint)('GET', '/v1/federation/matrixIds.verify');
    return (0, react_query_1.useMutation)((_a) => __awaiter(void 0, [_a], void 0, function* ({ users, handleSave }) {
        try {
            let matrixIdVerificationMap = new Map();
            const matrixIds = users.filter((user) => user.startsWith('@'));
            if (matrixIds.length > 0) {
                const matrixIdsVerificationResponse = yield dispatchVerifyEndpoint({ matrixIds });
                const { results: matrixIdsVerificationResults } = matrixIdsVerificationResponse;
                matrixIdVerificationMap = new Map(Object.entries(matrixIdsVerificationResults));
            }
            setModal((0, jsx_runtime_1.jsx)(AddMatrixUsersModal_1.default, { completeUserList: users, onClose: handleClose, onSave: handleSave, matrixIdVerifiedStatus: matrixIdVerificationMap }));
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
    }));
};
exports.useAddMatrixUsers = useAddMatrixUsers;
