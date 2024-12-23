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
(0, mocha_1.describe)('banners', () => {
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.describe)('[/banners.getNew]', () => {
        (0, mocha_1.it)('should fail if not logged in', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('banners.getNew'))
                .query({
                platform: 'web',
            })
                .expect(401)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('status', 'error');
                (0, chai_1.expect)(res.body).to.have.property('message');
            })
                .end(done);
        });
        (0, mocha_1.it)('should fail if missing platform key', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('banners.getNew'))
                .set(api_data_1.credentials)
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
            })
                .end(done);
        });
        (0, mocha_1.it)('should fail if platform param is unknown', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('banners.getNew'))
                .set(api_data_1.credentials)
                .query({
                platform: 'unknownPlatform',
            })
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
            })
                .end(done);
        });
        (0, mocha_1.it)('should fail if platform param is empty', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('banners.getNew'))
                .set(api_data_1.credentials)
                .query({
                platform: '',
            })
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return banners if platform param is valid', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('banners.getNew'))
                .set(api_data_1.credentials)
                .query({
                platform: 'web',
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('banners').and.to.be.an('array');
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('[/banners.dismiss]', () => {
        (0, mocha_1.it)('should fail if not logged in', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('banners.dismiss'))
                .send({
                bannerId: '123',
            })
                .expect(401)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('status', 'error');
                (0, chai_1.expect)(res.body).to.have.property('message');
            })
                .end(done);
        });
        (0, mocha_1.it)('should fail if missing bannerId key', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('banners.dismiss'))
                .set(api_data_1.credentials)
                .send({})
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'invalid-params');
            })
                .end(done);
        });
        (0, mocha_1.it)('should fail if bannerId is empty', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('banners.dismiss'))
                .set(api_data_1.credentials)
                .send({
                bannerId: '',
            })
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
            })
                .end(done);
        });
        (0, mocha_1.it)('should fail if bannerId is invalid', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('banners.dismiss'))
                .set(api_data_1.credentials)
                .send({
                bannerId: '123',
            })
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('[/banners]', () => {
        (0, mocha_1.it)('should fail if not logged in', () => __awaiter(void 0, void 0, void 0, function* () {
            return api_data_1.request
                .get((0, api_data_1.api)('banners'))
                .query({
                platform: 'web',
            })
                .expect(401)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('status', 'error');
                (0, chai_1.expect)(res.body).to.have.property('message');
            });
        }));
        (0, mocha_1.it)('should fail if missing platform', () => __awaiter(void 0, void 0, void 0, function* () {
            return api_data_1.request
                .get((0, api_data_1.api)('banners'))
                .set(api_data_1.credentials)
                .query({})
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'invalid-params');
            });
        }));
        (0, mocha_1.it)('should fail if platform is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            return api_data_1.request
                .get((0, api_data_1.api)('banners'))
                .set(api_data_1.credentials)
                .query({
                platform: 'invalid-platform',
            })
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'invalid-params');
            });
        }));
        (0, mocha_1.it)('should succesfully return web banners', () => __awaiter(void 0, void 0, void 0, function* () {
            return api_data_1.request
                .get((0, api_data_1.api)('banners'))
                .set(api_data_1.credentials)
                .query({
                platform: 'web',
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('banners').that.is.an('array');
            });
        }));
        (0, mocha_1.it)('should succesfully return mobile banners', () => __awaiter(void 0, void 0, void 0, function* () {
            return api_data_1.request
                .get((0, api_data_1.api)('banners'))
                .set(api_data_1.credentials)
                .query({
                platform: 'mobile',
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('banners').that.is.an('array');
            });
        }));
    });
    (0, mocha_1.describe)('[/banners/:id]', () => {
        (0, mocha_1.it)('should fail if not logged in', () => __awaiter(void 0, void 0, void 0, function* () {
            return api_data_1.request
                .get((0, api_data_1.api)('banners/some-id'))
                .query({
                platform: 'web',
            })
                .expect(401)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('status', 'error');
                (0, chai_1.expect)(res.body).to.have.property('message');
            });
        }));
        (0, mocha_1.it)('should fail if missing platform', () => __awaiter(void 0, void 0, void 0, function* () {
            return api_data_1.request
                .get((0, api_data_1.api)('banners/some-id'))
                .set(api_data_1.credentials)
                .query({})
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'invalid-params');
            });
        }));
        (0, mocha_1.it)('should fail if platform is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            return api_data_1.request
                .get((0, api_data_1.api)('banners/some-id'))
                .set(api_data_1.credentials)
                .query({
                platform: 'invalid-platform',
            })
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'invalid-params');
            });
        }));
        (0, mocha_1.it)('should succesfully return a web banner by id', () => __awaiter(void 0, void 0, void 0, function* () {
            return api_data_1.request
                .get((0, api_data_1.api)('banners/some-id'))
                .set(api_data_1.credentials)
                .query({
                platform: 'web',
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('banners').that.is.an('array');
            });
        }));
        (0, mocha_1.it)('should succesfully return a mobile banner by id', () => __awaiter(void 0, void 0, void 0, function* () {
            return api_data_1.request
                .get((0, api_data_1.api)('banners/some-id'))
                .set(api_data_1.credentials)
                .query({
                platform: 'mobile',
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('banners').that.is.an('array');
            });
        }));
    });
});
