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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importDefault(require("react"));
const ContactInfoError_1 = __importDefault(require("./ContactInfoError"));
const EditContactInfo_1 = __importDefault(require("./EditContactInfo"));
const FormSkeleton_1 = require("../directory/components/FormSkeleton");
const EditContactInfoWithData = ({ id, onClose, onCancel }) => {
    const getContactEndpoint = (0, ui_contexts_1.useEndpoint)('GET', '/v1/omnichannel/contacts.get');
    const { data, isLoading, isError } = (0, react_query_1.useQuery)(['getContactById', id], () => __awaiter(void 0, void 0, void 0, function* () { return getContactEndpoint({ contactId: id }); }));
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)(fuselage_1.ContextualbarContent, { children: (0, jsx_runtime_1.jsx)(FormSkeleton_1.FormSkeleton, {}) }));
    }
    if (isError) {
        return (0, jsx_runtime_1.jsx)(ContactInfoError_1.default, { onClose: onClose });
    }
    return (0, jsx_runtime_1.jsx)(EditContactInfo_1.default, { contactData: data.contact, onClose: onClose, onCancel: onCancel });
};
exports.default = EditContactInfoWithData;
