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
exports.createRateLimitSettings = void 0;
const server_1 = require("../../app/settings/server");
const createRateLimitSettings = () => server_1.settingsRegistry.addGroup('Rate Limiter', function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield this.section('DDP_Rate_Limiter', function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.add('DDP_Rate_Limit_IP_Enabled', true, { type: 'boolean' });
                yield this.add('DDP_Rate_Limit_IP_Requests_Allowed', 120000, {
                    type: 'int',
                    enableQuery: { _id: 'DDP_Rate_Limit_IP_Enabled', value: true },
                });
                yield this.add('DDP_Rate_Limit_IP_Interval_Time', 60000, {
                    type: 'int',
                    enableQuery: { _id: 'DDP_Rate_Limit_IP_Enabled', value: true },
                });
                yield this.add('DDP_Rate_Limit_User_Enabled', true, { type: 'boolean' });
                yield this.add('DDP_Rate_Limit_User_Requests_Allowed', 1200, {
                    type: 'int',
                    enableQuery: { _id: 'DDP_Rate_Limit_User_Enabled', value: true },
                });
                yield this.add('DDP_Rate_Limit_User_Interval_Time', 60000, {
                    type: 'int',
                    enableQuery: { _id: 'DDP_Rate_Limit_User_Enabled', value: true },
                });
                yield this.add('DDP_Rate_Limit_Connection_Enabled', true, { type: 'boolean' });
                yield this.add('DDP_Rate_Limit_Connection_Requests_Allowed', 600, {
                    type: 'int',
                    enableQuery: { _id: 'DDP_Rate_Limit_Connection_Enabled', value: true },
                });
                yield this.add('DDP_Rate_Limit_Connection_Interval_Time', 60000, {
                    type: 'int',
                    enableQuery: { _id: 'DDP_Rate_Limit_Connection_Enabled', value: true },
                });
                yield this.add('DDP_Rate_Limit_User_By_Method_Enabled', true, { type: 'boolean' });
                yield this.add('DDP_Rate_Limit_User_By_Method_Requests_Allowed', 20, {
                    type: 'int',
                    enableQuery: { _id: 'DDP_Rate_Limit_User_By_Method_Enabled', value: true },
                });
                yield this.add('DDP_Rate_Limit_User_By_Method_Interval_Time', 10000, {
                    type: 'int',
                    enableQuery: { _id: 'DDP_Rate_Limit_User_By_Method_Enabled', value: true },
                });
                yield this.add('DDP_Rate_Limit_Connection_By_Method_Enabled', true, { type: 'boolean' });
                yield this.add('DDP_Rate_Limit_Connection_By_Method_Requests_Allowed', 10, {
                    type: 'int',
                    enableQuery: { _id: 'DDP_Rate_Limit_Connection_By_Method_Enabled', value: true },
                });
                yield this.add('DDP_Rate_Limit_Connection_By_Method_Interval_Time', 10000, {
                    type: 'int',
                    enableQuery: { _id: 'DDP_Rate_Limit_Connection_By_Method_Enabled', value: true },
                });
            });
        });
        yield this.section('API_Rate_Limiter', function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.add('API_Enable_Rate_Limiter', true, { type: 'boolean' });
                yield this.add('API_Enable_Rate_Limiter_Dev', true, {
                    type: 'boolean',
                    enableQuery: { _id: 'API_Enable_Rate_Limiter', value: true },
                });
                yield this.add('API_Enable_Rate_Limiter_Limit_Calls_Default', 10, {
                    type: 'int',
                    enableQuery: { _id: 'API_Enable_Rate_Limiter', value: true },
                });
                yield this.add('API_Enable_Rate_Limiter_Limit_Time_Default', 60000, {
                    type: 'int',
                    enableQuery: { _id: 'API_Enable_Rate_Limiter', value: true },
                });
            });
        });
        yield this.section('Feature_Limiting', function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.add('Rate_Limiter_Limit_RegisterUser', 1, {
                    type: 'int',
                    enableQuery: { _id: 'API_Enable_Rate_Limiter', value: true },
                });
            });
        });
    });
});
exports.createRateLimitSettings = createRateLimitSettings;
