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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseJsonQuery = parseJsonQuery;
const ejson_1 = __importDefault(require("ejson"));
const meteor_1 = require("meteor/meteor");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const deprecationWarningLogger_1 = require("../../../lib/server/lib/deprecationWarningLogger");
const api_1 = require("../api");
const cleanQuery_1 = require("../lib/cleanQuery");
const isValidQuery_1 = require("../lib/isValidQuery");
const pathAllowConf = {
    '/api/v1/users.list': ['$or', '$regex', '$and'],
    'def': ['$or', '$and', '$regex'],
};
function parseJsonQuery(api) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const { request: { route }, userId, queryParams: params, logger, queryFields, queryOperations, response, } = api;
        let sort;
        if (params.sort) {
            try {
                sort = JSON.parse(params.sort);
                Object.entries(sort).forEach(([key, value]) => {
                    if (value !== 1 && value !== -1) {
                        throw new meteor_1.Meteor.Error('error-invalid-sort-parameter', `Invalid sort parameter: ${key}`, {
                            helperMethod: 'parseJsonQuery',
                        });
                    }
                });
            }
            catch (e) {
                logger.warn(`Invalid sort parameter provided "${params.sort}":`, e);
                throw new meteor_1.Meteor.Error('error-invalid-sort', `Invalid sort parameter provided: "${params.sort}"`, {
                    helperMethod: 'parseJsonQuery',
                });
            }
        }
        const isUnsafeQueryParamsAllowed = ((_a = process.env.ALLOW_UNSAFE_QUERY_AND_FIELDS_API_PARAMS) === null || _a === void 0 ? void 0 : _a.toUpperCase()) === 'TRUE';
        const messageGenerator = ({ endpoint, version, parameter }) => `The usage of the "${parameter}" parameter in endpoint "${endpoint}" breaks the security of the API and can lead to data exposure. It has been deprecated and will be removed in the version ${version}.`;
        let fields;
        if (params.fields && isUnsafeQueryParamsAllowed) {
            try {
                deprecationWarningLogger_1.apiDeprecationLogger.parameter(route, 'fields', '8.0.0', response, messageGenerator);
                fields = JSON.parse(params.fields);
                Object.entries(fields).forEach(([key, value]) => {
                    if (value !== 1 && value !== 0) {
                        throw new meteor_1.Meteor.Error('error-invalid-sort-parameter', `Invalid fields parameter: ${key}`, {
                            helperMethod: 'parseJsonQuery',
                        });
                    }
                });
            }
            catch (e) {
                logger.warn(`Invalid fields parameter provided "${params.fields}":`, e);
                throw new meteor_1.Meteor.Error('error-invalid-fields', `Invalid fields parameter provided: "${params.fields}"`, {
                    helperMethod: 'parseJsonQuery',
                });
            }
        }
        // Verify the user's selected fields only contains ones which their role allows
        if (typeof fields === 'object') {
            let nonSelectableFields = Object.keys(api_1.API.v1.defaultFieldsToExclude);
            if (route.includes('/v1/users.')) {
                nonSelectableFields = nonSelectableFields.concat(Object.keys((yield (0, hasPermission_1.hasPermissionAsync)(userId, 'view-full-other-user-info'))
                    ? api_1.API.v1.limitedUserFieldsToExcludeIfIsPrivilegedUser
                    : api_1.API.v1.limitedUserFieldsToExclude));
            }
            Object.keys(fields).forEach((k) => {
                if (nonSelectableFields.includes(k) || nonSelectableFields.includes(k.split(api_1.API.v1.fieldSeparator)[0])) {
                    fields && delete fields[k];
                }
            });
        }
        // Limit the fields by default
        fields = Object.assign({}, fields, api_1.API.v1.defaultFieldsToExclude);
        if (route.includes('/v1/users.')) {
            if (yield (0, hasPermission_1.hasPermissionAsync)(userId, 'view-full-other-user-info')) {
                fields = Object.assign(fields, api_1.API.v1.limitedUserFieldsToExcludeIfIsPrivilegedUser);
            }
            else {
                fields = Object.assign(fields, api_1.API.v1.limitedUserFieldsToExclude);
            }
        }
        let query = {};
        if (params.query && isUnsafeQueryParamsAllowed) {
            deprecationWarningLogger_1.apiDeprecationLogger.parameter(route, 'query', '8.0.0', response, messageGenerator);
            try {
                query = ejson_1.default.parse(params.query);
                query = (0, cleanQuery_1.clean)(query, pathAllowConf.def);
            }
            catch (e) {
                logger.warn(`Invalid query parameter provided "${params.query}":`, e);
                throw new meteor_1.Meteor.Error('error-invalid-query', `Invalid query parameter provided: "${params.query}"`, {
                    helperMethod: 'parseJsonQuery',
                });
            }
        }
        // Verify the user has permission to query the fields they are
        if (typeof query === 'object') {
            let nonQueryableFields = Object.keys(api_1.API.v1.defaultFieldsToExclude);
            if (route.includes('/v1/users.')) {
                if (yield (0, hasPermission_1.hasPermissionAsync)(userId, 'view-full-other-user-info')) {
                    nonQueryableFields = nonQueryableFields.concat(Object.keys(api_1.API.v1.limitedUserFieldsToExcludeIfIsPrivilegedUser));
                }
                else {
                    nonQueryableFields = nonQueryableFields.concat(Object.keys(api_1.API.v1.limitedUserFieldsToExclude));
                }
            }
            if (queryFields && !(0, isValidQuery_1.isValidQuery)(query, queryFields || ['*'], queryOperations !== null && queryOperations !== void 0 ? queryOperations : pathAllowConf.def)) {
                throw new meteor_1.Meteor.Error('error-invalid-query', isValidQuery_1.isValidQuery.errors.join('\n'));
            }
            Object.keys(query).forEach((k) => {
                if (nonQueryableFields.includes(k) || nonQueryableFields.includes(k.split(api_1.API.v1.fieldSeparator)[0])) {
                    query && delete query[k];
                }
            });
        }
        return {
            sort,
            fields,
            query,
        };
    });
}
