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
exports.prependReplies = void 0;
const getPermaLink_1 = require("../getPermaLink");
const prependReplies = (msg_1, ...args_1) => __awaiter(void 0, [msg_1, ...args_1], void 0, function* (msg, replies = []) {
    const chunks = yield Promise.all(replies.map((_a) => __awaiter(void 0, [_a], void 0, function* ({ _id }) {
        const permalink = yield (0, getPermaLink_1.getPermaLink)(_id);
        return `[ ](${permalink})`;
    })));
    chunks.push(msg);
    return chunks.join('\n');
});
exports.prependReplies = prependReplies;
