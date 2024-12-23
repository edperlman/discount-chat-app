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
exports.callWithErrorHandling = void 0;
const SDKClient_1 = require("../../../app/utils/client/lib/SDKClient");
const toast_1 = require("../toast");
const callWithErrorHandling = (method, ...params) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield SDKClient_1.sdk.call(method, ...params);
    }
    catch (error) {
        (0, toast_1.dispatchToastMessage)({ type: 'error', message: error });
        throw error;
    }
});
exports.callWithErrorHandling = callWithErrorHandling;
