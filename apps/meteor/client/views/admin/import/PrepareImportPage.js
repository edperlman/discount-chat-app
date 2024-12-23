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
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const PrepareChannels_1 = __importDefault(require("./PrepareChannels"));
const PrepareContacts_1 = __importDefault(require("./PrepareContacts"));
const PrepareUsers_1 = __importDefault(require("./PrepareUsers"));
const useErrorHandler_1 = require("./useErrorHandler");
const ImporterProgressStep_1 = require("../../../../app/importer/lib/ImporterProgressStep");
const stringUtils_1 = require("../../../../lib/utils/stringUtils");
const Page_1 = require("../../../components/Page");
const waitFor = (fn, predicate) => new Promise((resolve, reject) => {
    const callPromise = () => {
        fn().then((result) => {
            if (predicate(result)) {
                resolve(result);
                return;
            }
            setTimeout(callPromise, 1000);
        }, reject);
    };
    callPromise();
});
// TODO: review inner logic
function PrepareImportPage() {
    const t = (0, ui_contexts_1.useTranslation)();
    const handleError = (0, useErrorHandler_1.useErrorHandler)();
    const [isPreparing, setPreparing] = (0, fuselage_hooks_1.useSafely)((0, react_1.useState)(true));
    const [progressRate, setProgressRate] = (0, fuselage_hooks_1.useSafely)((0, react_1.useState)(null));
    const [status, setStatus] = (0, fuselage_hooks_1.useSafely)((0, react_1.useState)(null));
    const [messageCount, setMessageCount] = (0, fuselage_hooks_1.useSafely)((0, react_1.useState)(0));
    const [users, setUsers] = (0, react_1.useState)([]);
    const [contacts, setContacts] = (0, react_1.useState)([]);
    const [channels, setChannels] = (0, react_1.useState)([]);
    const [isImporting, setImporting] = (0, fuselage_hooks_1.useSafely)((0, react_1.useState)(false));
    const usersCount = (0, react_1.useMemo)(() => users.filter(({ do_import }) => do_import).length, [users]);
    const channelsCount = (0, react_1.useMemo)(() => channels.filter(({ do_import }) => do_import).length, [channels]);
    const contactsCount = (0, react_1.useMemo)(() => contacts.filter(({ do_import }) => do_import).length, [contacts]);
    const router = (0, ui_contexts_1.useRouter)();
    const getImportFileData = (0, ui_contexts_1.useEndpoint)('GET', '/v1/getImportFileData');
    const getCurrentImportOperation = (0, ui_contexts_1.useEndpoint)('GET', '/v1/getCurrentImportOperation');
    const startImport = (0, ui_contexts_1.useEndpoint)('POST', '/v1/startImport');
    const streamer = (0, ui_contexts_1.useStream)('importers');
    (0, react_1.useEffect)(() => streamer('progress', (progress) => {
        // Ignore any update without the rate since we're not showing any other info anyway
        if ('rate' in progress) {
            setProgressRate(progress.rate);
        }
    }), [streamer, setProgressRate]);
    (0, react_1.useEffect)(() => {
        const loadImportFileData = () => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const data = yield waitFor(getImportFileData, (data) => data && (!('waiting' in data) || !data.waiting));
                if (!data) {
                    handleError(t('Importer_not_setup'));
                    router.navigate('/admin/import');
                    return;
                }
                setMessageCount(data.message_count);
                setUsers(data.users.map((user) => { var _a; return (Object.assign(Object.assign({}, user), { username: (_a = user.username) !== null && _a !== void 0 ? _a : '', do_import: true })); }));
                setChannels(data.channels.map((channel) => { var _a; return (Object.assign(Object.assign({}, channel), { name: (_a = channel.name) !== null && _a !== void 0 ? _a : '', do_import: true })); }));
                setContacts(((_a = data.contacts) === null || _a === void 0 ? void 0 : _a.map((contact) => { var _a; return (Object.assign(Object.assign({}, contact), { name: (_a = contact.name) !== null && _a !== void 0 ? _a : '', do_import: true })); })) || []);
                setPreparing(false);
                setProgressRate(null);
            }
            catch (error) {
                handleError(error, t('Failed_To_Load_Import_Data'));
                router.navigate('/admin/import');
            }
        });
        const loadCurrentOperation = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const { operation } = yield waitFor(getCurrentImportOperation, (data) => data.operation.valid && !ImporterProgressStep_1.ImportWaitingStates.includes(data.operation.status));
                if (!operation.valid) {
                    router.navigate('/admin/import/new');
                    return;
                }
                if (ImporterProgressStep_1.ImportingStartedStates.includes(operation.status)) {
                    router.navigate('/admin/import/progress');
                    return;
                }
                if (operation.status === ImporterProgressStep_1.ProgressStep.USER_SELECTION ||
                    ImporterProgressStep_1.ImportPreparingStartedStates.includes(operation.status) ||
                    ImporterProgressStep_1.ImportFileReadyStates.includes(operation.status)) {
                    setStatus(operation.status);
                    loadImportFileData();
                    return;
                }
                if (ImporterProgressStep_1.ImportingErrorStates.includes(operation.status)) {
                    handleError(t('Import_Operation_Failed'));
                    router.navigate('/admin/import');
                    return;
                }
                if (operation.status === ImporterProgressStep_1.ProgressStep.DONE) {
                    router.navigate('/admin/import');
                    return;
                }
                handleError(t('Unknown_Import_State'));
                router.navigate('/admin/import');
            }
            catch (error) {
                handleError(t('Failed_To_Load_Import_Data'));
                router.navigate('/admin/import');
            }
        });
        loadCurrentOperation();
    }, [getCurrentImportOperation, getImportFileData, handleError, router, setMessageCount, setPreparing, setProgressRate, setStatus, t]);
    const handleStartButtonClick = () => __awaiter(this, void 0, void 0, function* () {
        setImporting(true);
        try {
            const usersToImport = users.filter(({ do_import }) => do_import).map(({ user_id }) => user_id);
            const channelsToImport = channels.filter(({ do_import }) => do_import).map(({ channel_id }) => channel_id);
            const contactsToImport = contacts.filter(({ do_import }) => do_import).map(({ id }) => id);
            yield startImport({
                input: {
                    users: {
                        all: users.length > 0 && usersToImport.length === users.length,
                        list: (usersToImport.length !== users.length && usersToImport) || undefined,
                    },
                    channels: {
                        all: channels.length > 0 && channelsToImport.length === channels.length,
                        list: (channelsToImport.length !== channels.length && channelsToImport) || undefined,
                    },
                    contacts: {
                        all: contacts.length > 0 && contactsToImport.length === contacts.length,
                        list: (contactsToImport.length !== contacts.length && contactsToImport) || undefined,
                    },
                },
            });
            router.navigate('/admin/import/progress');
        }
        catch (error) {
            handleError(error, t('Failed_To_Start_Import'));
            router.navigate('/admin/import');
        }
    });
    const [tab, setTab] = (0, react_1.useState)('users');
    const handleTabClick = (0, react_1.useMemo)(() => (tab) => () => setTab(tab), []);
    const statusDebounced = (0, fuselage_hooks_1.useDebouncedValue)(status, 100);
    const handleMinimumImportData = !!((!usersCount && !channelsCount && !contactsCount && !messageCount) ||
        (!usersCount && !channelsCount && !contactsCount && messageCount !== 0));
    return ((0, jsx_runtime_1.jsxs)(Page_1.Page, { children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: t('Importing_Data'), onClickBack: () => router.navigate('/admin/import'), children: (0, jsx_runtime_1.jsx)(fuselage_1.ButtonGroup, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, disabled: isImporting || handleMinimumImportData, onClick: handleStartButtonClick, children: t('Importer_Prepare_Start_Import') }) }) }), (0, jsx_runtime_1.jsx)(Page_1.PageScrollableContentWithShadow, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { marginInline: 'auto', marginBlock: 'x24', width: 'full', maxWidth: '590px', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'h2', fontScale: 'p2m', children: statusDebounced && t(statusDebounced.replace('importer_', 'importer_status_')) }), !isPreparing && ((0, jsx_runtime_1.jsxs)(fuselage_1.Tabs, { flexShrink: 0, children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Tabs.Item, { selected: tab === 'users', onClick: handleTabClick('users'), children: [t('Users'), " ", (0, jsx_runtime_1.jsx)(fuselage_1.Badge, { children: usersCount })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Tabs.Item, { selected: tab === 'contacts', onClick: handleTabClick('contacts'), children: [t('Contacts'), " ", (0, jsx_runtime_1.jsx)(fuselage_1.Badge, { children: contactsCount })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Tabs.Item, { selected: tab === 'channels', onClick: handleTabClick('channels'), children: [t('Channels'), " ", (0, jsx_runtime_1.jsx)(fuselage_1.Badge, { children: channelsCount })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Tabs.Item, { disabled: true, children: [t('Messages'), (0, jsx_runtime_1.jsx)(fuselage_1.Badge, { children: messageCount })] })] })), (0, jsx_runtime_1.jsxs)(fuselage_1.Margins, { block: 'x24', children: [isPreparing && ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: progressRate ? ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', justifyContent: 'center', fontScale: 'p2', children: [(0, jsx_runtime_1.jsx)(fuselage_1.ProgressBar, { percentage: Math.floor(progressRate) }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { is: 'span', mis: 'x24', children: [(0, stringUtils_1.numberFormat)(progressRate, 0), "%"] })] })) : ((0, jsx_runtime_1.jsx)(fuselage_1.Throbber, { justifyContent: 'center' })) })), !isPreparing && tab === 'users' && (0, jsx_runtime_1.jsx)(PrepareUsers_1.default, { usersCount: usersCount, users: users, setUsers: setUsers }), !isPreparing && tab === 'contacts' && ((0, jsx_runtime_1.jsx)(PrepareContacts_1.default, { contactsCount: contactsCount, contacts: contacts, setContacts: setContacts })), !isPreparing && tab === 'channels' && ((0, jsx_runtime_1.jsx)(PrepareChannels_1.default, { channels: channels, channelsCount: channelsCount, setChannels: setChannels }))] })] }) })] }));
}
exports.default = PrepareImportPage;
