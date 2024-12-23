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
exports.useCustomFieldsMetadata = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const formatCustomFieldsMetadata_1 = require("../utils/formatCustomFieldsMetadata");
const useCustomFieldsMetadata = ({ enabled = true, scope }) => {
    const getCustomFields = (0, ui_contexts_1.useEndpoint)('GET', '/v1/livechat/custom-fields');
    return (0, react_query_1.useQuery)(['/v1/livechat/custom-fields', scope], () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const { customFields } = (_a = (yield getCustomFields())) !== null && _a !== void 0 ? _a : {};
        return (0, formatCustomFieldsMetadata_1.formatCustomFieldsMetadata)(customFields, scope);
    }), { enabled });
};
exports.useCustomFieldsMetadata = useCustomFieldsMetadata;
