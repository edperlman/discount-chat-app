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
exports.useRemoveWebDAVAccountIntegrationMutation = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const useRemoveWebDAVAccountIntegrationMutation = (options) => {
    const removeWebdavAccount = (0, ui_contexts_1.useEndpoint)('POST', '/v1/webdav.removeWebdavAccount');
    return (0, react_query_1.useMutation)(Object.assign({ mutationFn: (_a) => __awaiter(void 0, [_a], void 0, function* ({ accountSelected }) {
            yield removeWebdavAccount({ accountId: accountSelected });
        }) }, options));
};
exports.useRemoveWebDAVAccountIntegrationMutation = useRemoveWebDAVAccountIntegrationMutation;
