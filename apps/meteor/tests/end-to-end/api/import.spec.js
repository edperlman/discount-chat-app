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
const user_1 = require("../../data/user");
const users_helper_1 = require("../../data/users.helper");
(0, mocha_1.describe)('Imports', () => {
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.describe)('[/getCurrentImportOperation]', () => {
        (0, mocha_1.it)('should return the current import operation', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('getCurrentImportOperation'))
                .set(api_data_1.credentials)
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body.success).to.be.true;
                (0, chai_1.expect)(res.body.operation).not.be.null;
            });
        }));
    });
    (0, mocha_1.describe)('[/downloadPendingFiles]', () => {
        (0, mocha_1.it)('should return the number of pending files', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('downloadPendingFiles'))
                .set(api_data_1.credentials)
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body.success).to.be.true;
                (0, chai_1.expect)(res.body.count).to.be.greaterThanOrEqual(0);
            });
        }));
    });
    (0, mocha_1.describe)('[/downloadPendingAvatars]', () => {
        (0, mocha_1.it)('should return the number of pending avatars', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('downloadPendingAvatars'))
                .set(api_data_1.credentials)
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body.success).to.be.true;
                (0, chai_1.expect)(res.body.count).to.be.greaterThanOrEqual(0);
            });
        }));
    });
    (0, mocha_1.describe)('[/getLatestImportOperations]', () => {
        let testUser = {};
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            testUser = yield (0, users_helper_1.createUser)();
        }));
        let testCredentials = {};
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            testCredentials = yield (0, users_helper_1.login)(testUser.username, user_1.password);
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, users_helper_1.deleteUser)(testUser);
            testUser = undefined;
        }));
        (0, mocha_1.it)('should fail if the user is not authorized', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('getLatestImportOperations'))
                .set(testCredentials)
                .expect(403)
                .expect((res) => {
                (0, chai_1.expect)(res.body.success).to.be.false;
                (0, chai_1.expect)(res.body.error).to.equal('User does not have the permissions required for this action [error-unauthorized]');
            });
        }));
        (0, mocha_1.it)('should return the latest import operation', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('getLatestImportOperations'))
                .set(api_data_1.credentials)
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.be.an('array');
            });
        }));
    });
    (0, mocha_1.describe)('[/getImportProgress]', () => {
        (0, mocha_1.it)('should return the import progress', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('getImportProgress'))
                .set(api_data_1.credentials)
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body.success).to.be.true;
                (0, chai_1.expect)(res.body.key).to.be.an('string');
                (0, chai_1.expect)(res.body.name).to.be.an('string');
                (0, chai_1.expect)(res.body.step).to.be.an('string');
                (0, chai_1.expect)(res.body.count).to.be.an('object');
            });
        }));
    });
    (0, mocha_1.describe)('[/getImportFileData]', () => {
        (0, mocha_1.it)('should return the import file data', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('getImportFileData'))
                .set(api_data_1.credentials)
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body.success).to.be.true;
                (0, chai_1.expect)(res.body.users).to.be.an('array');
                (0, chai_1.expect)(res.body.channels).to.be.an('array');
                (0, chai_1.expect)(res.body.message_count).to.greaterThanOrEqual(0);
            });
        }));
    });
    (0, mocha_1.describe)('[/uploadImportFile]', () => {
        let testUser = {};
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            testUser = yield (0, users_helper_1.createUser)();
        }));
        let testCredentials = {};
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            testCredentials = yield (0, users_helper_1.login)(testUser.username, user_1.password);
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, users_helper_1.deleteUser)(testUser);
            testUser = undefined;
        }));
        (0, mocha_1.it)('should fail if the user is not authorized', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('uploadImportFile'))
                .set(testCredentials)
                .send({
                binaryContent: 'ZXJzLmNzdlBLBQYAAAAAAQABADcAAAAmAQAAAAA=',
                contentType: 'application/zip',
                fileName: 'users11.zip',
                importerKey: 'csv',
            })
                .expect(403)
                .expect((res) => {
                (0, chai_1.expect)(res.body.success).to.be.false;
                (0, chai_1.expect)(res.body.error).to.equal('User does not have the permissions required for this action [error-unauthorized]');
            });
        }));
    });
});
