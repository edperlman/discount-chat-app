"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const usePagination_1 = require("../../../components/GenericTable/hooks/usePagination");
const PrepareContacts = ({ contactsCount, contacts, setContacts }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const _a = (0, usePagination_1.usePagination)(), { current, itemsPerPage, setItemsPerPage, setCurrent } = _a, paginationProps = __rest(_a, ["current", "itemsPerPage", "setItemsPerPage", "setCurrent"]);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Table, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.TableHead, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.TableRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { width: 'x36', children: (0, jsx_runtime_1.jsx)(fuselage_1.CheckBox, { checked: contactsCount > 0, indeterminate: contactsCount > 0 && contactsCount !== contacts.length, onChange: () => {
                                            setContacts((contacts) => {
                                                const isChecking = contactsCount === 0;
                                                return contacts.map((contact) => (Object.assign(Object.assign({}, contact), { do_import: isChecking })));
                                            });
                                        } }) }), (0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { is: 'th', children: t('Name') }), (0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { is: 'th', children: t('Emails') }), (0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { is: 'th', children: t('Phones') })] }) }), (0, jsx_runtime_1.jsx)(fuselage_1.TableBody, { children: contacts.slice(current, current + itemsPerPage).map((contact) => ((0, jsx_runtime_1.jsxs)(fuselage_1.TableRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { width: 'x36', children: (0, jsx_runtime_1.jsx)(fuselage_1.CheckBox, { checked: contact.do_import, onChange: (event) => {
                                            const { checked } = event.currentTarget;
                                            setContacts((contacts) => contacts.map((_contact) => (_contact === contact ? Object.assign(Object.assign({}, _contact), { do_import: checked }) : _contact)));
                                        } }) }), (0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { children: contact.name }), (0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { children: contact.emails.join('\n') }), (0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { children: contact.phones.join('\n') })] }, contact.id))) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Pagination, Object.assign({ current: current, itemsPerPage: itemsPerPage, count: contacts.length || 0, onSetItemsPerPage: setItemsPerPage, onSetCurrent: setCurrent }, paginationProps))] }));
};
exports.default = PrepareContacts;
