"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRestPayload = exports.getMethodArgs = void 0;
const omit_1 = require("../../../lib/utils/omit");
const { LOG_METHOD_PAYLOAD = 'false', LOG_REST_PAYLOAD = 'false', LOG_REST_METHOD_PAYLOADS = 'false' } = process.env;
exports.getMethodArgs = LOG_METHOD_PAYLOAD === 'false' && LOG_REST_METHOD_PAYLOADS === 'false'
    ? () => null
    : (method, args) => {
        const params = method === 'ufsWrite' ? args.slice(1) : args;
        if (method === 'saveSettings') {
            return { arguments: [args[0].map((arg) => (0, omit_1.omit)(arg, 'value'))] };
        }
        if (method === 'saveSetting') {
            return { arguments: [args[0], args[2]] };
        }
        return {
            arguments: params.map((arg) => (typeof arg !== 'object' ? arg : (0, omit_1.omit)(arg, 'password', 'msg', 'pass', 'username', 'message'))),
        };
    };
exports.getRestPayload = LOG_REST_PAYLOAD === 'false' && LOG_REST_METHOD_PAYLOADS === 'false'
    ? () => null
    : (payload) => ({
        payload,
    });
