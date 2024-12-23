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
exports.findParentMessage = void 0;
const callWithErrorHandling_1 = require("../../../client/lib/utils/callWithErrorHandling");
const highOrderFunctions_1 = require("../../../lib/utils/highOrderFunctions");
const client_1 = require("../../models/client");
exports.findParentMessage = (() => {
    const waiting = [];
    let resolve;
    let pending = new Promise((r) => {
        resolve = r;
    });
    const getMessages = (0, highOrderFunctions_1.withDebouncing)({ wait: 500 })(() => __awaiter(void 0, void 0, void 0, function* () {
        const _tmp = [...waiting];
        waiting.length = 0;
        resolve((0, callWithErrorHandling_1.callWithErrorHandling)('getMessages', _tmp));
        pending = new Promise((r) => {
            resolve = r;
        });
    }));
    const get = (tmid) => __awaiter(void 0, void 0, void 0, function* () {
        void getMessages();
        const messages = yield pending;
        return messages.find(({ _id }) => _id === tmid);
    });
    return (tmid) => __awaiter(void 0, void 0, void 0, function* () {
        const message = client_1.Messages.findOne({ _id: tmid });
        if (message) {
            return message;
        }
        if (waiting.indexOf(tmid) === -1) {
            waiting.push(tmid);
        }
        return get(tmid);
    });
})();
