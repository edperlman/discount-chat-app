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
exports.useArchiveRoom = void 0;
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_i18next_1 = require("react-i18next");
const useArchiveRoom = (room) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const archiveAction = (0, ui_contexts_1.useEndpoint)('POST', '/v1/rooms.changeArchivationState');
    const handleArchive = (0, fuselage_hooks_1.useMutableCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield archiveAction({ rid: room._id, action: room.archived ? 'unarchive' : 'archive' });
            dispatchToastMessage({ type: 'success', message: room.archived ? t('Room_has_been_unarchived') : t('Room_has_been_archived') });
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
    }));
    return handleArchive;
};
exports.useArchiveRoom = useArchiveRoom;
