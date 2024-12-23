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
const permissions_helper_1 = require("../../data/permissions.helper");
(0, mocha_1.describe)('federation', () => {
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    // FIXME: why debouncing is causing timeouts here on the hooks?
    // Since we don't care about the watchers on this setting, not debouncing is fine.
    (0, mocha_1.describe)('well-known', () => {
        (0, mocha_1.describe)('when matrix disabled', () => {
            (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, permissions_helper_1.updateSetting)('Federation_Matrix_enabled', false, false);
                yield (0, permissions_helper_1.updateSetting)('Federation_Matrix_serve_well_known', true, false);
            }));
            (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, permissions_helper_1.updateSetting)('Federation_Matrix_serve_well_known', false, false);
            }));
            (0, mocha_1.it)('should return 404 not found', () => __awaiter(void 0, void 0, void 0, function* () {
                yield api_data_1.request.get('/.well-known/matrix/server').expect(404);
                yield api_data_1.request.get('/.well-known/matrix/client').expect(404);
            }));
        });
        (0, mocha_1.describe)('when matrix enabled but well-known disabled', () => {
            (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, permissions_helper_1.updateSetting)('Federation_Matrix_enabled', true, false);
                yield (0, permissions_helper_1.updateSetting)('Federation_Matrix_serve_well_known', false, false);
            }));
            (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, permissions_helper_1.updateSetting)('Federation_Matrix_enabled', false, false);
            }));
            (0, mocha_1.it)('should return 404 not found', () => __awaiter(void 0, void 0, void 0, function* () {
                yield api_data_1.request.get('/.well-known/matrix/server').expect(404);
                yield api_data_1.request.get('/.well-known/matrix/client').expect(404);
            }));
        });
        (0, mocha_1.describe)('when enabled', () => {
            (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, permissions_helper_1.updateSetting)('Federation_Matrix_enabled', true, false);
                yield (0, permissions_helper_1.updateSetting)('Federation_Matrix_serve_well_known', true, false);
            }));
            (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, permissions_helper_1.updateSetting)('Federation_Matrix_enabled', false, false);
                yield (0, permissions_helper_1.updateSetting)('Federation_Matrix_serve_well_known', false, false);
            }));
            (0, mocha_1.it)('should return matrix information', () => __awaiter(void 0, void 0, void 0, function* () {
                yield api_data_1.request
                    .get('/.well-known/matrix/server')
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('m.server', 'localhost:8008');
                });
                yield api_data_1.request
                    .get('/.well-known/matrix/client')
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body['m.homeserver']).to.have.property('base_url', 'http://localhost');
                });
            }));
        });
    });
});
