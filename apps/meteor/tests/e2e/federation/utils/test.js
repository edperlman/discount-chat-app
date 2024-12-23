"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.tearDownTesting = exports.setupTesting = exports.expect = exports.test = void 0;
const test_1 = require("@playwright/test");
const constants_1 = require("../../config/constants");
const constants = __importStar(require("../config/constants"));
const api = (request, use, user, password, baseUrl) => __awaiter(void 0, void 0, void 0, function* () {
    const resp = yield request.post(`${baseUrl + constants_1.API_PREFIX}/login`, { data: { user, password } });
    const json = yield resp.json();
    const headers = {
        'X-Auth-Token': json.data.authToken,
        'X-User-Id': json.data.userId,
    };
    yield use({
        get(uri, prefix = constants_1.API_PREFIX) {
            return request.get(baseUrl + prefix + uri, { headers });
        },
        post(uri, data, prefix = constants_1.API_PREFIX) {
            return request.post(baseUrl + prefix + uri, { headers, data });
        },
        put(uri, data, prefix = constants_1.API_PREFIX) {
            return request.put(baseUrl + prefix + uri, { headers, data });
        },
        delete(uri, prefix = constants_1.API_PREFIX) {
            return request.delete(baseUrl + prefix + uri, { headers });
        },
    });
});
exports.test = test_1.test.extend({
    apiServer1: (_a, use_1) => __awaiter(void 0, [_a, use_1], void 0, function* ({ request }, use) { return api(request, use, constants.RC_SERVER_1.username, constants.RC_SERVER_1.password, constants.RC_SERVER_1.url); }),
    apiServer2: (_a, use_1) => __awaiter(void 0, [_a, use_1], void 0, function* ({ request }, use) { return api(request, use, constants.RC_SERVER_2.username, constants.RC_SERVER_2.password, constants.RC_SERVER_2.url); }),
});
exports.expect = exports.test.expect;
const setupTesting = (api) => __awaiter(void 0, void 0, void 0, function* () {
    yield api.post('/settings/Message_AudioRecorderEnabled', { value: true });
    yield api.post('/settings/Accounts_ManuallyApproveNewUsers', { value: false });
    yield api.post('/settings/API_Enable_Rate_Limiter', { value: false });
    yield api.post('/settings/DDP_Rate_Limit_IP_Enabled', { value: false });
    yield api.post('/settings/DDP_Rate_Limit_User_Enabled', { value: false });
    yield api.post('/settings/DDP_Rate_Limit_Connection_Enabled', { value: false });
    yield api.post('/settings/DDP_Rate_Limit_Connection_Interval_Time', { value: false });
    yield api.post('/settings/DDP_Rate_Limit_User_By_Method_Enabled', { value: false });
    yield api.post('/settings/DDP_Rate_Limit_Connection_By_Method_Enabled', { value: false });
    yield api.post('/settings/Accounts_RegistrationForm', { value: 'Public' });
    yield api.post('/settings/UI_Use_Real_Name', { value: false });
    yield api.post('/settings/Rate_Limiter_Limit_RegisterUser', { value: 10 });
    yield api.post('/settings/Hide_System_Messages', { value: [] });
    yield api.post('/permissions.update', { permissions: [{ _id: 'force-delete-message', roles: ['admin', 'user'] }] });
});
exports.setupTesting = setupTesting;
const tearDownTesting = (api) => __awaiter(void 0, void 0, void 0, function* () {
    yield api.post('/settings/Accounts_ManuallyApproveNewUsers', { value: true });
    yield api.post('/settings/API_Enable_Rate_Limiter', { value: true });
    yield api.post('/settings/DDP_Rate_Limit_IP_Enabled', { value: true });
    yield api.post('/settings/DDP_Rate_Limit_User_Enabled', { value: true });
    yield api.post('/settings/DDP_Rate_Limit_Connection_Enabled', { value: true });
    yield api.post('/settings/DDP_Rate_Limit_Connection_Interval_Time', { value: true });
    yield api.post('/settings/DDP_Rate_Limit_User_By_Method_Enabled', { value: true });
    yield api.post('/settings/DDP_Rate_Limit_Connection_By_Method_Enabled', { value: true });
    yield api.post('/settings/Rate_Limiter_Limit_RegisterUser', { value: 1 });
    yield api.post('/settings/Accounts_RegistrationForm', { value: 'Disabled' });
});
exports.tearDownTesting = tearDownTesting;
