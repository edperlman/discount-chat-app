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
exports.useMessageSearchProviderQuery = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const useMessageSearchProviderQuery = () => {
    const getSearchProvider = (0, ui_contexts_1.useMethod)('rocketchatSearch.getProvider');
    return (0, react_query_1.useQuery)(['search', 'provider'], () => __awaiter(void 0, void 0, void 0, function* () {
        const provider = yield getSearchProvider();
        if (provider === undefined) {
            throw new Error('Search provider not found');
        }
        return provider;
    }));
};
exports.useMessageSearchProviderQuery = useMessageSearchProviderQuery;
