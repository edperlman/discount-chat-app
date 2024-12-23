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
exports.getPriorityByi18nLabel = void 0;
const test_1 = require("../test");
const getPriorityByi18nLabel = (api, i18n) => __awaiter(void 0, void 0, void 0, function* () {
    const allPriorityResp = yield api.get('/livechat/priorities');
    (0, test_1.expect)(allPriorityResp.status()).toBe(200);
    const { priorities } = (yield allPriorityResp.json());
    const priority = priorities.find((p) => p.i18n === i18n);
    if (!priority) {
        throw new Error('Could not find priority with i18n "High"');
    }
    return priority;
});
exports.getPriorityByi18nLabel = getPriorityByi18nLabel;
