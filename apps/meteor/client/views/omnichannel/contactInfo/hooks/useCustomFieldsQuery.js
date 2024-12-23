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
exports.useCustomFieldsQuery = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
// TODO: Unify this hook with all the other with the same proposal
const useCustomFieldsQuery = () => {
    const getCustomFields = (0, ui_contexts_1.useEndpoint)('GET', '/v1/livechat/custom-fields');
    return (0, react_query_1.useQuery)(['/v1/livechat/custom-fields'], () => __awaiter(void 0, void 0, void 0, function* () { return getCustomFields(); }));
};
exports.useCustomFieldsQuery = useCustomFieldsQuery;
