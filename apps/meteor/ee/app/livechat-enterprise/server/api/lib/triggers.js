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
exports.callTriggerExternalService = callTriggerExternalService;
const server_fetch_1 = require("@rocket.chat/server-fetch");
function callTriggerExternalService(_a) {
    return __awaiter(this, arguments, void 0, function* ({ url, timeout, fallbackMessage, body, headers, }) {
        try {
            const response = yield (0, server_fetch_1.serverFetch)(url, { timeout: timeout || 1000, body, headers, method: 'POST' });
            if (!response.ok || response.status !== 200) {
                const text = yield response.text();
                throw new Error(text);
            }
            const data = yield response.json();
            const { contents } = data;
            if (!Array.isArray(contents) ||
                !contents.length ||
                !contents.every(({ msg, order }) => typeof msg === 'string' && typeof order === 'number')) {
                throw new Error('External service response does not match expected format');
            }
            return {
                response: {
                    statusCode: response.status,
                    contents: (data === null || data === void 0 ? void 0 : data.contents) || [],
                },
            };
        }
        catch (error) {
            const isTimeout = error.message === 'The user aborted a request.';
            return {
                error: isTimeout ? 'error-timeout' : 'error-invalid-external-service-response',
                response: error.message,
                fallbackMessage,
            };
        }
    });
}
