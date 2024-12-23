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
const api_data_1 = require("../../data/api-data");
(0, mocha_1.describe)('assets', () => {
    (0, mocha_1.it)('should always have CORS headers for assets', () => __awaiter(void 0, void 0, void 0, function* () {
        yield api_data_1.request.get('/assets/favicon.svg').expect('Content-Type', 'image/svg+xml').expect('Access-Control-Allow-Origin', '*').expect(200);
        yield api_data_1.request
            .get('/fonts/rocketchat.woff2')
            .expect('Content-Type', 'font/woff2')
            .expect('Access-Control-Allow-Origin', '*')
            .expect(200);
    }));
});
