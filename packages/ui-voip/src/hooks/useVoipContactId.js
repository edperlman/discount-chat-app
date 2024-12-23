"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useVoipContactId = void 0;
const useVoipExtensionDetails_1 = require("./useVoipExtensionDetails");
const useVoipContactId = ({ session, transferEnabled = true }) => {
    var _a, _b;
    const { data: contact, isInitialLoading: isLoading } = (0, useVoipExtensionDetails_1.useVoipExtensionDetails)({ extension: session.contact.id });
    const { data: transferedByContact } = (0, useVoipExtensionDetails_1.useVoipExtensionDetails)({
        extension: (_a = session.transferedBy) === null || _a === void 0 ? void 0 : _a.id,
        enabled: transferEnabled,
    });
    const getContactName = (data, defaultValue) => {
        const { name, username = '', callerName, callerNumber, extension } = data || {};
        return name || callerName || username || callerNumber || extension || defaultValue || '';
    };
    const name = getContactName(contact, session.contact.name || session.contact.id);
    const transferedBy = getContactName(transferedByContact, transferEnabled ? (_b = session.transferedBy) === null || _b === void 0 ? void 0 : _b.id : '');
    return {
        name,
        username: contact === null || contact === void 0 ? void 0 : contact.username,
        transferedBy,
        isLoading,
    };
};
exports.useVoipContactId = useVoipContactId;
