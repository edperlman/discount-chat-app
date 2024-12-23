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
exports.httpCall = void 0;
const server_fetch_1 = require("@rocket.chat/server-fetch");
const http_1 = require("meteor/http");
const url_1 = require("meteor/url");
const stringUtils_1 = require("../../../lib/utils/stringUtils");
// Code extracted from https://github.com/meteor/meteor/blob/master/packages/deprecated/http
// Modified to:
//   - Respect proxy envvars such as HTTP_PROXY and NO_PROXY
//   - Respect HTTP_DEFAULT_TIMEOUT envvar or use 20s when it is not set
const envTimeout = parseInt(process.env.HTTP_DEFAULT_TIMEOUT || '', 10);
const defaultTimeout = !isNaN(envTimeout) ? envTimeout : 20000;
// Fill in `response.data` if the content-type is JSON.
function populateData(response) {
    // Read Content-Type header, up to a ';' if there is one.
    // A typical header might be "application/json; charset=utf-8"
    // or just "application/json".
    const contentType = (response.headers['content-type'] || ';').split(';')[0];
    // Only try to parse data as JSON if server sets correct content type.
    if (['application/json', 'text/javascript', 'application/javascript', 'application/x-javascript'].indexOf(contentType) >= 0) {
        try {
            response.data = JSON.parse(response.content);
        }
        catch (err) {
            response.data = null;
        }
    }
    else {
        response.data = null;
    }
}
function makeErrorByStatus(statusCode, content) {
    let message = `failed [${statusCode}]`;
    if (content) {
        message += `${(0, stringUtils_1.truncate)(content.replace(/\n/g, ' '), 500)}`;
    }
    return new Error(message);
}
function _call(httpMethod, url, options, callback) {
    const method = (httpMethod || '').toUpperCase();
    if (!/^https?:\/\//.test(url)) {
        throw new Error('url must be absolute and start with http:// or https://');
    }
    const headers = {};
    let { content } = options;
    if (!('timeout' in options)) {
        options.timeout = defaultTimeout;
    }
    if (options.data) {
        content = JSON.stringify(options.data);
        headers['Content-Type'] = 'application/json';
    }
    let paramsForUrl;
    let paramsForBody;
    if (content || method === 'GET' || method === 'HEAD') {
        paramsForUrl = options.params;
    }
    else {
        paramsForBody = options.params;
    }
    const newUrl = url_1.URL._constructUrl(url, options.query, paramsForUrl);
    if (options.auth) {
        if (options.auth.indexOf(':') < 0) {
            throw new Error('auth option should be of the form "username:password"');
        }
        const base64 = Buffer.from(options.auth, 'ascii').toString('base64');
        headers.Authorization = `Basic ${base64}`;
    }
    if (paramsForBody) {
        const data = new url_1.URLSearchParams();
        Object.entries(paramsForBody).forEach(([key, value]) => {
            data.append(key, value);
        });
        content = data;
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }
    const { headers: receivedHeaders } = options;
    if (receivedHeaders) {
        Object.keys(receivedHeaders).forEach((key) => {
            headers[key] = receivedHeaders[key];
        });
    }
    // wrap callback to add a 'response' property on an error, in case
    // we have both (http 4xx/5xx error, which has a response payload)
    const wrappedCallback = ((cb) => {
        let called = false;
        return (error, response) => {
            if (!called) {
                called = true;
                if (error && response) {
                    error.response = response;
                }
                cb(error, response);
            }
        };
    })(callback);
    // is false if false, otherwise always true
    const followRedirects = options.followRedirects === false ? 'manual' : 'follow';
    const requestOptions = {
        method,
        jar: false,
        timeout: options.timeout,
        body: content,
        redirect: followRedirects,
        referrer: options.referrer,
        integrity: options.integrity,
        headers,
    };
    (0, server_fetch_1.serverFetch)(newUrl, requestOptions)
        .then((res) => __awaiter(this, void 0, void 0, function* () {
        const content = yield res.text();
        const response = {};
        response.statusCode = res.status;
        response.content = `${content}`;
        // fetch headers don't allow simple read using bracket notation
        // so we iterate their entries and assign them to a new Object
        response.headers = {};
        for (const entry of res.headers.entries()) {
            const [key, val] = entry;
            response.headers[key] = val;
        }
        response.ok = res.ok;
        response.redirected = res.redirected;
        populateData(response);
        if (response.statusCode >= 400) {
            const error = makeErrorByStatus(response.statusCode, response.content);
            wrappedCallback(error, response);
        }
        else {
            wrappedCallback(undefined, response);
        }
    }))
        .catch((err) => wrappedCallback(err));
}
function httpCallAsync(httpMethod, url, optionsOrCallback = {}, callback) {
    // If the options argument was omitted, adjust the arguments:
    if (!callback && typeof optionsOrCallback === 'function') {
        return _call(httpMethod, url, {}, optionsOrCallback);
    }
    return _call(httpMethod, url, optionsOrCallback, callback);
}
const httpCall = (httpMethod, url, options) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        httpCallAsync.bind(http_1.HTTP)(httpMethod, url, options, (error, result) => {
            if (error) {
                return reject(error);
            }
            resolve(result);
        });
    });
});
exports.httpCall = httpCall;
