"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const meteor_1 = require("meteor/meteor");
const path_to_regexp_1 = require("path-to-regexp");
const react_1 = __importDefault(require("react"));
const SDKClient_1 = require("../../app/utils/client/lib/SDKClient");
const rocketchat_info_1 = require("../../app/utils/rocketchat.info");
const absoluteUrl = (path) => meteor_1.Meteor.absoluteUrl(path);
const callMethod = (methodName, ...args) => meteor_1.Meteor.callAsync(methodName, ...args);
const callEndpoint = ({ method, pathPattern, keys, params, }) => {
    const compiledPath = (0, path_to_regexp_1.compile)(pathPattern, { encode: encodeURIComponent })(keys);
    switch (method) {
        case 'GET':
            return SDKClient_1.sdk.rest.get(compiledPath, params);
        case 'POST':
            return SDKClient_1.sdk.rest.post(compiledPath, params);
        case 'PUT':
            return SDKClient_1.sdk.rest.put(compiledPath, params);
        case 'DELETE':
            return SDKClient_1.sdk.rest.delete(compiledPath, params);
        default:
            throw new Error('Invalid HTTP method');
    }
};
const uploadToEndpoint = (endpoint, formData) => SDKClient_1.sdk.rest.post(endpoint, formData);
const getStream = (streamName, _options) => (eventName, callback) => SDKClient_1.sdk.stream(streamName, [eventName], callback).stop;
const contextValue = {
    info: rocketchat_info_1.Info,
    absoluteUrl,
    callMethod,
    callEndpoint,
    uploadToEndpoint,
    getStream,
};
const ServerProvider = ({ children }) => (0, jsx_runtime_1.jsx)(ui_contexts_1.ServerContext.Provider, { children: children, value: contextValue });
exports.default = ServerProvider;
