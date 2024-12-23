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
exports.middlewareCAS = void 0;
const url_1 = __importDefault(require("url"));
const cas_validate_1 = require("@rocket.chat/cas-validate");
const models_1 = require("@rocket.chat/models");
const underscore_1 = __importDefault(require("underscore"));
const logger_1 = require("./logger");
const server_1 = require("../../../app/settings/server");
const closePopup = function (res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    const content = '<html><head><script>window.close()</script></head></html>';
    res.end(content, 'utf-8');
};
const casTicket = function (req, token, callback) {
    var _a;
    // get configuration
    if (!server_1.settings.get('CAS_enabled')) {
        logger_1.logger.error('Got ticket validation request, but CAS is not enabled');
        callback();
    }
    // get ticket and validate.
    const parsedUrl = url_1.default.parse(req.url, true);
    const ticketId = parsedUrl.query.ticket;
    const baseUrl = server_1.settings.get('CAS_base_url');
    const version = parseFloat((_a = server_1.settings.get('CAS_version')) !== null && _a !== void 0 ? _a : '1.0');
    const appUrl = Meteor.absoluteUrl().replace(/\/$/, '') + __meteor_runtime_config__.ROOT_URL_PATH_PREFIX;
    logger_1.logger.debug(`Using CAS_base_url: ${baseUrl}`);
    (0, cas_validate_1.validate)({
        base_url: baseUrl,
        version,
        service: `${appUrl}/_cas/${token}`,
    }, ticketId, (err, status, username, details) => __awaiter(this, void 0, void 0, function* () {
        if (err) {
            logger_1.logger.error(`error when trying to validate: ${err.message}`);
        }
        else if (status) {
            logger_1.logger.info(`Validated user: ${username}`);
            const userInfo = { username: username };
            // CAS 2.0 attributes handling
            if (details === null || details === void 0 ? void 0 : details.attributes) {
                underscore_1.default.extend(userInfo, { attributes: details.attributes });
            }
            yield models_1.CredentialTokens.create(token, userInfo);
        }
        else {
            logger_1.logger.error(`Unable to validate ticket: ${ticketId}`);
        }
        // logger.debug("Received response: " + JSON.stringify(details, null , 4));
        callback();
    }));
};
const middlewareCAS = function (req, res, next) {
    // Make sure to catch any exceptions because otherwise we'd crash
    // the runner
    try {
        if (!req.url) {
            throw new Error('Invalid request url');
        }
        const barePath = req.url.substring(0, req.url.indexOf('?'));
        const splitPath = barePath.split('/');
        // Any non-cas request will continue down the default
        // middlewares.
        if (splitPath[1] !== '_cas') {
            next();
            return;
        }
        // get auth token
        const credentialToken = splitPath[2];
        if (!credentialToken) {
            closePopup(res);
            return;
        }
        // validate ticket
        casTicket(req, credentialToken, () => {
            closePopup(res);
        });
    }
    catch (err) {
        logger_1.logger.error({ msg: 'Unexpected error', err });
        closePopup(res);
    }
};
exports.middlewareCAS = middlewareCAS;
