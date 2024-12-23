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
exports.useParentMessage = void 0;
const react_query_1 = require("@tanstack/react-query");
const findParentMessage_1 = require("../../../../../app/ui-message/client/findParentMessage");
const useParentMessage = (mid) => (0, react_query_1.useQuery)(['parent-message', { mid }], () => __awaiter(void 0, void 0, void 0, function* () { return (0, findParentMessage_1.findParentMessage)(mid); }));
exports.useParentMessage = useParentMessage;
