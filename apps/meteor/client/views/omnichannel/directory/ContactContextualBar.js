"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const ContactInfo_1 = __importDefault(require("../contactInfo/ContactInfo"));
const ContactInfoError_1 = __importDefault(require("../contactInfo/ContactInfoError"));
const EditContactInfo_1 = __importDefault(require("../contactInfo/EditContactInfo"));
const EditContactInfoWithData_1 = __importDefault(require("../contactInfo/EditContactInfoWithData"));
const ContactContextualBar = () => {
    const directoryRoute = (0, ui_contexts_1.useRoute)('omnichannel-directory');
    const contactId = (0, ui_contexts_1.useRouteParameter)('id');
    const context = (0, ui_contexts_1.useRouteParameter)('context');
    const handleClose = () => {
        directoryRoute.push({ tab: 'contacts' });
    };
    const handleCancel = () => contactId && directoryRoute.push({ tab: 'contacts', context: 'details', id: contactId });
    if (context === 'edit' && contactId) {
        return (0, jsx_runtime_1.jsx)(EditContactInfoWithData_1.default, { id: contactId, onClose: handleClose, onCancel: handleCancel });
    }
    if (context === 'new' && !contactId) {
        return (0, jsx_runtime_1.jsx)(EditContactInfo_1.default, { onClose: handleClose, onCancel: handleClose });
    }
    if (!contactId) {
        return (0, jsx_runtime_1.jsx)(ContactInfoError_1.default, { onClose: handleClose });
    }
    return (0, jsx_runtime_1.jsx)(ContactInfo_1.default, { id: contactId, onClose: handleClose });
};
exports.default = ContactContextualBar;
