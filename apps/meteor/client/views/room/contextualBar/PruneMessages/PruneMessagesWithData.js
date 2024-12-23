"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.initialValues = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const core_typings_1 = require("@rocket.chat/core-typings");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const moment_1 = __importDefault(require("moment"));
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const PruneMessages_1 = __importDefault(require("./PruneMessages"));
const GenericModal_1 = __importDefault(require("../../../../components/GenericModal"));
const RoomContext_1 = require("../../contexts/RoomContext");
const RoomToolboxContext_1 = require("../../contexts/RoomToolboxContext");
const getTimeZoneOffset = () => {
    const offset = new Date().getTimezoneOffset();
    const absOffset = Math.abs(offset);
    return `${offset < 0 ? '+' : '-'}${`00${Math.floor(absOffset / 60)}`.slice(-2)}:${`00${absOffset % 60}`.slice(-2)}`;
};
exports.initialValues = {
    newer: {
        date: '',
        time: '',
    },
    older: {
        date: '',
        time: '',
    },
    users: [],
    inclusive: false,
    pinned: false,
    discussion: false,
    threads: false,
    attached: false,
};
const DEFAULT_PRUNE_LIMIT = 2000;
const PruneMessagesWithData = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const room = (0, RoomContext_1.useRoom)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const { closeTab: close } = (0, RoomToolboxContext_1.useRoomToolbox)();
    const closeModal = (0, react_1.useCallback)(() => setModal(null), [setModal]);
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const pruneMessagesAction = (0, ui_contexts_1.useEndpoint)('POST', '/v1/rooms.cleanHistory');
    const [counter, setCounter] = (0, react_1.useState)(0);
    const methods = (0, react_hook_form_1.useForm)({ defaultValues: exports.initialValues });
    const { newer: { date: newerDate, time: newerTime }, older: { date: olderDate, time: olderTime }, users, inclusive, pinned, discussion, threads, attached, } = methods.watch();
    const fromDate = (0, react_1.useMemo)(() => {
        return new Date(`${newerDate || '0001-01-01'}T${newerTime || '00:00'}:00${getTimeZoneOffset()}`);
    }, [newerDate, newerTime]);
    const toDate = (0, react_1.useMemo)(() => {
        return new Date(`${olderDate || '9999-12-31'}T${olderTime || '23:59'}:59${getTimeZoneOffset()}`);
    }, [olderDate, olderTime]);
    const handlePrune = (0, fuselage_hooks_1.useMutableCallback)(() => {
        const handlePruneAction = () => __awaiter(void 0, void 0, void 0, function* () {
            const limit = DEFAULT_PRUNE_LIMIT;
            try {
                if (counter === limit) {
                    return;
                }
                const { count } = yield pruneMessagesAction({
                    roomId: room._id,
                    latest: toDate.toISOString(),
                    oldest: fromDate.toISOString(),
                    inclusive,
                    limit,
                    excludePinned: pinned,
                    filesOnly: attached,
                    ignoreDiscussion: discussion,
                    ignoreThreads: threads,
                    users,
                });
                setCounter(count);
                if (count < 1) {
                    throw new Error(t('No_messages_found_to_prune'));
                }
                dispatchToastMessage({ type: 'success', message: t('__count__message_pruned', { count }) });
                methods.reset();
            }
            catch (error) {
                dispatchToastMessage({ type: 'error', message: error });
            }
            finally {
                closeModal();
            }
        });
        return setModal((0, jsx_runtime_1.jsx)(GenericModal_1.default, { variant: 'danger', onClose: closeModal, onCancel: closeModal, onConfirm: handlePruneAction, confirmText: t('Yes_prune_them'), children: t('Prune_Modal') }));
    });
    const callOutText = (0, react_1.useMemo)(() => {
        var _a;
        const name = room && (((0, core_typings_1.isDirectMessageRoom)(room) && ((_a = room.usernames) === null || _a === void 0 ? void 0 : _a.join(' x '))) || room.fname || room.name);
        const exceptPinned = pinned ? ` ${t('except_pinned')}` : '';
        const ifFrom = users.length
            ? ` ${t('if_they_are_from', {
                postProcess: 'sprintf',
                sprintf: [users.map((element) => element).join(', ')],
            })}`
            : '';
        const filesOrMessages = attached ? t('files') : t('messages');
        if (newerDate && olderDate) {
            return (t('Prune_Warning_between', {
                postProcess: 'sprintf',
                sprintf: [filesOrMessages, name, (0, moment_1.default)(fromDate).format('L LT'), (0, moment_1.default)(toDate).format('L LT')],
            }) +
                exceptPinned +
                ifFrom);
        }
        if (newerDate) {
            return (t('Prune_Warning_after', {
                postProcess: 'sprintf',
                sprintf: [filesOrMessages, name, (0, moment_1.default)(fromDate).format('L LT')],
            }) +
                exceptPinned +
                ifFrom);
        }
        if (olderDate) {
            return (t('Prune_Warning_before', {
                postProcess: 'sprintf',
                sprintf: [filesOrMessages, name, (0, moment_1.default)(toDate).format('L LT')],
            }) +
                exceptPinned +
                ifFrom);
        }
        return (t('Prune_Warning_all', {
            postProcess: 'sprintf',
            sprintf: [filesOrMessages, name],
        }) +
            exceptPinned +
            ifFrom);
    }, [attached, fromDate, newerDate, olderDate, pinned, room, t, toDate, users]);
    const validateText = (0, react_1.useMemo)(() => {
        if (fromDate > toDate) {
            return t('Newer_than_may_not_exceed_Older_than');
        }
        if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
            return t('error-invalid-date');
        }
        return undefined;
    }, [fromDate, t, toDate]);
    return ((0, jsx_runtime_1.jsx)(react_hook_form_1.FormProvider, Object.assign({}, methods, { children: (0, jsx_runtime_1.jsx)(PruneMessages_1.default, { callOutText: callOutText, validateText: validateText, users: users, onClickClose: close, onClickPrune: handlePrune }) })));
};
exports.default = PruneMessagesWithData;
