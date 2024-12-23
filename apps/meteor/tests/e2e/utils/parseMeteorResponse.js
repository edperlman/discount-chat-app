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
exports.parseMeteorResponse = void 0;
const parseMeteorResponse = (response) => __awaiter(void 0, void 0, void 0, function* () {
    const { message, success } = yield response.json();
    if (!success) {
        throw new Error(message);
    }
    const { result, error } = JSON.parse(message);
    if (error) {
        throw new Error(JSON.stringify(error));
    }
    return result;
});
exports.parseMeteorResponse = parseMeteorResponse;
