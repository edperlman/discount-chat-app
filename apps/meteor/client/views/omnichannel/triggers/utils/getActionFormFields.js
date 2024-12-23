"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActionFormFields = void 0;
const ExternalServiceActionForm_1 = require("../actions/ExternalServiceActionForm");
const SendMessageActionForm_1 = require("../actions/SendMessageActionForm");
const actionForms = {
    'send-message': SendMessageActionForm_1.SendMessageActionForm,
    'use-external-service': ExternalServiceActionForm_1.ExternalServiceActionForm,
};
const getActionFormFields = (actionName) => {
    return actionForms[actionName] || actionForms['send-message'];
};
exports.getActionFormFields = getActionFormFields;
