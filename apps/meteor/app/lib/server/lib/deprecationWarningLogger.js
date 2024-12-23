"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamDeprecationLogger = exports.methodDeprecationLogger = exports.apiDeprecationLogger = void 0;
const logger_1 = require("@rocket.chat/logger");
const semver_1 = __importDefault(require("semver"));
const server_1 = require("../../../metrics/server");
const deprecationLogger = new logger_1.Logger('DeprecationWarning');
const throwErrorsForVersionsUnder = process.env.ROCKET_CHAT_DEPRECATION_THROW_ERRORS_FOR_VERSIONS_UNDER;
const writeDeprecationHeader = (res, type, message, version) => {
    if (res) {
        res.setHeader('x-deprecation-type', type);
        res.setHeader('x-deprecation-message', message);
        res.setHeader('x-deprecation-version', version);
    }
};
const compareVersions = (version, message) => {
    if (throwErrorsForVersionsUnder && semver_1.default.lte(version, throwErrorsForVersionsUnder)) {
        throw new Error(message);
    }
};
exports.apiDeprecationLogger = ((logger) => {
    return {
        endpoint: (endpoint, version, res, info = '') => {
            const message = `The endpoint "${endpoint}" is deprecated and will be removed on version ${version}${info ? ` (${info})` : ''}`;
            compareVersions(version, message);
            writeDeprecationHeader(res, 'endpoint-deprecation', message, version);
            server_1.metrics.deprecations.inc({ type: 'deprecation', kind: 'endpoint', name: endpoint });
            logger.warn(message);
        },
        parameter: (endpoint, parameter, version, res, messageGenerator) => {
            var _a;
            const message = (_a = messageGenerator === null || messageGenerator === void 0 ? void 0 : messageGenerator({
                parameter,
                endpoint,
                version,
            })) !== null && _a !== void 0 ? _a : `The parameter "${parameter}" in the endpoint "${endpoint}" is deprecated and will be removed on version ${version}`;
            compareVersions(version, message);
            server_1.metrics.deprecations.inc({ type: 'parameter-deprecation', kind: 'endpoint', name: endpoint, params: parameter });
            writeDeprecationHeader(res, 'parameter-deprecation', message, version);
            logger.warn(message);
        },
        deprecatedParameterUsage: (endpoint, parameter, version, res, messageGenerator) => {
            var _a;
            const message = (_a = messageGenerator === null || messageGenerator === void 0 ? void 0 : messageGenerator({
                parameter,
                endpoint,
                version,
            })) !== null && _a !== void 0 ? _a : `The usage of the endpoint "${endpoint}" is deprecated and will be removed on version ${version}`;
            compareVersions(version, message);
            server_1.metrics.deprecations.inc({ type: 'invalid-usage', kind: 'endpoint', name: endpoint, params: parameter });
            writeDeprecationHeader(res, 'invalid-usage', message, version);
            logger.warn(message);
        },
    };
})(deprecationLogger.section('API'));
exports.methodDeprecationLogger = ((logger) => {
    return {
        method: (method, version, info = '') => {
            const message = `The method "${method}" is deprecated and will be removed on version ${version}${info ? ` (${info})` : ''}`;
            compareVersions(version, message);
            server_1.metrics.deprecations.inc({ type: 'deprecation', name: method, kind: 'method' });
            logger.warn(message);
        },
        parameter: (method, parameter, version) => {
            const message = `The parameter "${parameter}" in the method "${method}" is deprecated and will be removed on version ${version}`;
            server_1.metrics.deprecations.inc({ type: 'parameter-deprecation', name: method, params: parameter });
            compareVersions(version, message);
            logger.warn(message);
        },
        deprecatedParameterUsage: (method, parameter, version, messageGenerator) => {
            var _a;
            const message = (_a = messageGenerator === null || messageGenerator === void 0 ? void 0 : messageGenerator({
                parameter,
                method,
                version,
            })) !== null && _a !== void 0 ? _a : `The usage of the method "${method}" is deprecated and will be removed on version ${version}`;
            compareVersions(version, message);
            server_1.metrics.deprecations.inc({ type: 'invalid-usage', name: method, params: parameter, kind: 'method' });
            logger.warn(message);
        },
        /** @deprecated */
        warn: (message) => {
            compareVersions('0.0.0', message);
            logger.warn(message);
        },
    };
})(deprecationLogger.section('METHOD'));
exports.streamDeprecationLogger = deprecationLogger.section('STREAM');
