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
exports.default = addCustomOAuth;
const test_1 = require("@playwright/test");
const userStates_1 = require("./userStates");
const constants_1 = require("../config/constants");
function addCustomOAuth() {
    return __awaiter(this, void 0, void 0, function* () {
        const api = yield test_1.request.newContext();
        const headers = {
            'X-Auth-Token': userStates_1.Users.admin.data.loginToken,
            'X-User-Id': userStates_1.Users.admin.data.username,
        };
        yield api.post(`${constants_1.BASE_API_URL}/settings.addCustomOAuth`, { data: { name: 'Test' }, headers });
        yield api.post(`${constants_1.BASE_API_URL}/settings/Accounts_OAuth_Custom-Test`, { data: { value: false }, headers });
        yield api.post(`${constants_1.BASE_API_URL}/settings/Accounts_OAuth_Custom-Test-url`, { data: { value: 'https://rocket.chat' }, headers });
        yield api.post(`${constants_1.BASE_API_URL}/settings/Accounts_OAuth_Custom-Test-login_style`, { data: { value: 'redirect' }, headers });
    });
}
