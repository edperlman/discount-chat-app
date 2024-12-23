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
exports.useChangeRole = void 0;
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const useChangeRole = ({ onGrant, onRemove, permissionId, }) => {
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    return (0, fuselage_hooks_1.useMutableCallback)((roleId, granted) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (granted) {
                yield onRemove(permissionId, roleId);
            }
            else {
                yield onGrant(permissionId, roleId);
            }
            return !granted;
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
        return granted;
    }));
};
exports.useChangeRole = useChangeRole;
