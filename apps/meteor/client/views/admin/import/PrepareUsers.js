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
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
// TODO: review inner logic
const PrepareUsers = ({ usersCount, users, setUsers }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const [current, setCurrent] = (0, react_1.useState)(0);
    const [itemsPerPage, setItemsPerPage] = (0, react_1.useState)(25);
    const showingResultsLabel = (0, react_1.useCallback)(({ count, current, itemsPerPage }) => t('Showing_results_of', { postProcess: 'sprintf', sprintf: [current + 1, Math.min(current + itemsPerPage, count), count] }), [t]);
    const itemsPerPageLabel = (0, react_1.useCallback)(() => t('Items_per_page:'), [t]);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Table, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.TableHead, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.TableRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { width: 'x36', children: (0, jsx_runtime_1.jsx)(fuselage_1.CheckBox, { checked: usersCount > 0, indeterminate: usersCount > 0 && usersCount !== users.length, onChange: () => {
                                            setUsers((users) => {
                                                const hasCheckedDeletedUsers = users.some(({ is_deleted, do_import }) => is_deleted && do_import);
                                                const isChecking = usersCount === 0;
                                                if (isChecking) {
                                                    return users.map((user) => (Object.assign(Object.assign({}, user), { do_import: true })));
                                                }
                                                if (hasCheckedDeletedUsers) {
                                                    return users.map((user) => (user.is_deleted ? Object.assign(Object.assign({}, user), { do_import: false }) : user));
                                                }
                                                return users.map((user) => (Object.assign(Object.assign({}, user), { do_import: false })));
                                            });
                                        } }) }), (0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { is: 'th', children: t('Username') }), (0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { is: 'th', children: t('Email') }), (0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { is: 'th' })] }) }), (0, jsx_runtime_1.jsx)(fuselage_1.TableBody, { children: users.slice(current, current + itemsPerPage).map((user) => ((0, jsx_runtime_1.jsxs)(fuselage_1.TableRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { width: 'x36', children: (0, jsx_runtime_1.jsx)(fuselage_1.CheckBox, { checked: user.do_import, onChange: (event) => {
                                            const { checked } = event.currentTarget;
                                            setUsers((users) => users.map((_user) => (_user === user ? Object.assign(Object.assign({}, _user), { do_import: checked }) : _user)));
                                        } }) }), (0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { children: user.username }), (0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { children: user.email }), (0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { align: 'end', children: user.is_deleted && (0, jsx_runtime_1.jsx)(fuselage_1.Tag, { variant: 'danger', children: t('Deleted') }) })] }, user.user_id))) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Pagination, { current: current, itemsPerPage: itemsPerPage, count: users.length || 0, onSetItemsPerPage: setItemsPerPage, onSetCurrent: setCurrent, itemsPerPageLabel: itemsPerPageLabel, showingResultsLabel: showingResultsLabel })] }));
};
exports.default = PrepareUsers;
