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
const jsrsasign_1 = require("jsrsasign");
const service_configuration_1 = require("meteor/service-configuration");
const AppleCustomOAuth_1 = require("./AppleCustomOAuth");
const server_1 = require("../../settings/server");
const config_1 = require("../lib/config");
new AppleCustomOAuth_1.AppleCustomOAuth('apple', config_1.config);
server_1.settings.watchMultiple([
    'Accounts_OAuth_Apple',
    'Accounts_OAuth_Apple_id',
    'Accounts_OAuth_Apple_secretKey',
    'Accounts_OAuth_Apple_iss',
    'Accounts_OAuth_Apple_kid',
], (_a) => __awaiter(void 0, [_a], void 0, function* ([enabled, clientId, serverSecret, iss, kid]) {
    if (!enabled) {
        return service_configuration_1.ServiceConfiguration.configurations.removeAsync({
            service: 'apple',
        });
    }
    // if everything is empty but Apple login is enabled, don't show the login button
    if (!clientId && !serverSecret && !iss && !kid) {
        yield service_configuration_1.ServiceConfiguration.configurations.upsertAsync({
            service: 'apple',
        }, {
            $set: {
                showButton: false,
                enabled: server_1.settings.get('Accounts_OAuth_Apple'),
            },
        });
        return;
    }
    const HEADER = {
        kid,
        alg: 'ES256',
    };
    const now = new Date();
    const exp = new Date();
    exp.setMonth(exp.getMonth() + 5); // from Apple docs expiration time must no be greater than 6 months
    const secret = jsrsasign_1.KJUR.jws.JWS.sign(null, HEADER, {
        iss,
        iat: Math.floor(now.getTime() / 1000),
        exp: Math.floor(exp.getTime() / 1000),
        aud: 'https://appleid.apple.com',
        sub: clientId,
    }, serverSecret);
    yield service_configuration_1.ServiceConfiguration.configurations.upsertAsync({
        service: 'apple',
    }, {
        $set: {
            showButton: true,
            secret,
            enabled: server_1.settings.get('Accounts_OAuth_Apple'),
            loginStyle: 'popup',
            clientId: clientId,
            buttonColor: '#000',
            buttonLabelColor: '#FFF',
        },
    });
}));
