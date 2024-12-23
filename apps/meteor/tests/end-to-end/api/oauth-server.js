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
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const api_data_1 = require("../../data/api-data");
(0, mocha_1.describe)('[OAuth Server]', () => {
    let oAuthAppId;
    let clientId;
    let clientSecret;
    let code;
    let refreshToken;
    let accessToken;
    let refreshedAccessToken;
    const redirectUri = 'http://asd.com';
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield api_data_1.request
            .post((0, api_data_1.api)('oauth-apps.delete'))
            .set(api_data_1.credentials)
            .send({ appId: oAuthAppId })
            .expect('Content-Type', 'application/json')
            .expect(200);
    }));
    (0, mocha_1.describe)('[/oauth-apps.create]', () => {
        (0, mocha_1.it)('should create the oauth app', () => __awaiter(void 0, void 0, void 0, function* () {
            const data = {
                name: 'api-test',
                redirectUri: 'http://test.com,http://asd.com',
                active: true,
            };
            yield api_data_1.request
                .post((0, api_data_1.api)('oauth-apps.create'))
                .set(api_data_1.credentials)
                .send(data)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('application');
                (0, chai_1.expect)(res.body.application).to.have.property('_id');
                (0, chai_1.expect)(res.body.application).to.have.property('name', data.name);
                (0, chai_1.expect)(res.body.application).to.have.property('redirectUri', data.redirectUri);
                (0, chai_1.expect)(res.body.application).to.have.property('active', data.active);
                (0, chai_1.expect)(res.body.application).to.have.property('clientId');
                (0, chai_1.expect)(res.body.application).to.have.property('clientSecret');
                oAuthAppId = res.body.application._id;
                clientId = res.body.application.clientId;
                clientSecret = res.body.application.clientSecret;
            });
        }));
        (0, mocha_1.it)('should authorize oauth to retrieve code', () => __awaiter(void 0, void 0, void 0, function* () {
            const params = new URLSearchParams({
                scope: 'user',
                response_type: 'token,code',
                response_mode: 'form_post',
                state: 'xus2t6ix57g',
            });
            yield api_data_1.request
                .post(`/oauth/authorize?${params.toString()}`)
                .type('form')
                .send({
                token: api_data_1.credentials['X-Auth-Token'],
                client_id: clientId,
                response_type: 'code',
                redirect_uri: redirectUri,
                allow: 'yes',
            })
                .expect(302)
                .expect((res) => {
                (0, chai_1.expect)(res.headers).to.have.property('location');
                const location = new URL(res.headers.location);
                (0, chai_1.expect)(location.origin).to.be.equal(redirectUri);
                (0, chai_1.expect)(location.searchParams.get('code')).to.be.string;
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                code = location.searchParams.get('code');
            });
        }));
        (0, mocha_1.it)('should use code to retrieve access_token', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post(`/oauth/token`)
                .type('form')
                .send({
                grant_type: 'authorization_code',
                code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
            })
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('token_type', 'Bearer');
                (0, chai_1.expect)(res.body).to.have.property('access_token');
                (0, chai_1.expect)(res.body).to.have.property('expires_in');
                (0, chai_1.expect)(res.body).to.have.property('refresh_token');
                accessToken = res.body.access_token;
                refreshToken = res.body.refresh_token;
            });
        }));
        (0, mocha_1.it)('should be able to refresh the access_token', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post(`/oauth/token`)
                .type('form')
                .send({
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
                client_id: clientId,
                client_secret: clientSecret,
            })
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('token_type', 'Bearer');
                (0, chai_1.expect)(res.body).to.have.property('access_token').and.not.be.equal(accessToken);
                (0, chai_1.expect)(res.body).to.have.property('expires_in');
                (0, chai_1.expect)(res.body).to.have.property('refresh_token');
                refreshedAccessToken = res.body.access_token;
            });
        }));
        (0, mocha_1.it)('should not be able to get user info with old access_token', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.get(`/oauth/userinfo`).auth(accessToken, { type: 'bearer' }).expect(401);
        }));
        (0, mocha_1.it)('should be able to get user info with refreshed access_token', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get(`/oauth/userinfo`)
                .auth(refreshedAccessToken, { type: 'bearer' })
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('sub', 'rocketchat.internal.admin.test');
            });
        }));
    });
});
