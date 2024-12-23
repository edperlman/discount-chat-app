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
const mocha_1 = require("mocha");
const api_data_1 = require("../data/api-data");
const methods = ['get', 'post', 'put', 'del'];
let lastUrl;
let lastMethod;
let lastResponse;
methods.forEach((method) => {
    const original = api_data_1.request[method];
    api_data_1.request[method] = function (url) {
        lastUrl = url;
        lastMethod = method;
        return original(url).expect((res) => {
            lastResponse = res;
        });
    };
});
(0, mocha_1.afterEach)(function () {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (((_a = this.currentTest) === null || _a === void 0 ? void 0 : _a.state) === 'failed') {
            console.log({
                lastUrl,
                lastMethod,
                lastResponse: lastResponse.text,
            });
        }
    });
});
