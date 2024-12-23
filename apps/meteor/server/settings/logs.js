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
exports.createLogSettings = void 0;
const server_1 = require("../../app/settings/server");
const createLogSettings = () => server_1.settingsRegistry.addGroup('Logs', function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield this.add('Log_Level', '0', {
            type: 'select',
            values: [
                {
                    key: '0',
                    i18nLabel: '0_Errors_Only',
                },
                {
                    key: '1',
                    i18nLabel: '1_Errors_and_Information',
                },
                {
                    key: '2',
                    i18nLabel: '2_Erros_Information_and_Debug',
                },
            ],
            public: true,
        });
        yield this.add('Log_View_Limit', 1000, {
            type: 'int',
        });
        yield this.add('Log_Trace_Methods', false, {
            type: 'boolean',
        });
        yield this.add('Log_Trace_Methods_Filter', '', {
            type: 'string',
            enableQuery: {
                _id: 'Log_Trace_Methods',
                value: true,
            },
        });
        yield this.add('Log_Trace_Subscriptions', false, {
            type: 'boolean',
        });
        yield this.add('Log_Trace_Subscriptions_Filter', '', {
            type: 'string',
            enableQuery: {
                _id: 'Log_Trace_Subscriptions',
                value: true,
            },
        });
        yield this.add('Uncaught_Exceptions_Count', 0, {
            hidden: true,
            type: 'int',
        });
        yield this.section('Prometheus', function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.add('Prometheus_Enabled', false, {
                    type: 'boolean',
                    i18nLabel: 'Enabled',
                });
                // See the default port allocation at https://github.com/prometheus/prometheus/wiki/Default-port-allocations
                yield this.add('Prometheus_Port', 9458, {
                    type: 'int',
                    i18nLabel: 'Port',
                });
                yield this.add('Prometheus_Reset_Interval', 0, {
                    type: 'int',
                });
                yield this.add('Prometheus_Garbage_Collector', false, {
                    type: 'boolean',
                    alert: 'Prometheus_Garbage_Collector_Alert',
                });
                yield this.add('Prometheus_API_User_Agent', false, {
                    type: 'boolean',
                });
            });
        });
        yield this.add('Log_Exceptions_to_Channel', '', { type: 'string' });
    });
});
exports.createLogSettings = createLogSettings;
