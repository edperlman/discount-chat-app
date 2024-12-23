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
exports.useIgnoreUserAction = void 0;
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const getRoomDirectives_1 = require("../../../lib/getRoomDirectives");
const useIgnoreUserAction = (user, rid) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const room = (0, ui_contexts_1.useUserRoom)(rid);
    const { _id: uid } = user;
    const ownUserId = (0, ui_contexts_1.useUserId)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const currentSubscription = (0, ui_contexts_1.useUserSubscription)(rid);
    const ignoreUser = (0, ui_contexts_1.useEndpoint)('GET', '/v1/chat.ignoreUser');
    const isIgnored = (currentSubscription === null || currentSubscription === void 0 ? void 0 : currentSubscription.ignored) && currentSubscription.ignored.indexOf(uid) > -1;
    if (!room) {
        throw Error('Room not provided');
    }
    const { roomCanIgnore } = (0, getRoomDirectives_1.getRoomDirectives)({ room, showingUserId: uid, userSubscription: currentSubscription });
    const ignoreUserAction = (0, fuselage_hooks_1.useMutableCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield ignoreUser({ rid, userId: uid, ignore: String(!isIgnored) });
            if (isIgnored) {
                dispatchToastMessage({ type: 'success', message: t('User_has_been_unignored') });
            }
            else {
                dispatchToastMessage({ type: 'success', message: t('User_has_been_ignored') });
            }
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
    }));
    const ignoreUserOption = (0, react_1.useMemo)(() => roomCanIgnore && uid !== ownUserId
        ? {
            content: t(isIgnored ? 'Unignore' : 'Ignore'),
            icon: 'ban',
            onClick: ignoreUserAction,
            type: 'management',
        }
        : undefined, [ignoreUserAction, isIgnored, ownUserId, roomCanIgnore, t, uid]);
    return ignoreUserOption;
};
exports.useIgnoreUserAction = useIgnoreUserAction;
