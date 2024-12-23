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
const crypto_1 = require("crypto");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const api_data_1 = require("../../data/api-data");
function insertOrUpdateSound(fileName, fileId) {
    return __awaiter(this, void 0, void 0, function* () {
        fileId = fileId !== null && fileId !== void 0 ? fileId : '';
        yield api_data_1.request
            .post((0, api_data_1.api)('method.call/insertOrUpdateSound'))
            .set(api_data_1.credentials)
            .send({
            message: JSON.stringify({
                msg: 'method',
                id: '1',
                method: 'insertOrUpdateSound',
                params: [{ name: fileName, extension: 'mp3', newFile: true }],
            }),
        })
            .expect(200)
            .expect((res) => {
            fileId = JSON.parse(res.body.message).result;
        });
        return fileId;
    });
}
function uploadCustomSound(binary, fileName, fileId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield api_data_1.request
            .post((0, api_data_1.api)('method.call/uploadCustomSound'))
            .set(api_data_1.credentials)
            .send({
            message: JSON.stringify({
                msg: 'method',
                id: '2',
                method: 'uploadCustomSound',
                params: [binary, 'audio/wav', { name: fileName, extension: 'wav', newFile: true, _id: fileId }],
            }),
        })
            .expect(200);
    });
}
(0, mocha_1.describe)('[CustomSounds]', () => {
    const fileName = `test-file-${(0, crypto_1.randomUUID)()}`;
    let fileId;
    let fileId2;
    let uploadDate;
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        const data = (0, fs_1.readFileSync)(path_1.default.resolve(__dirname, '../../mocks/files/audio_mock.wav'));
        const binary = data.toString('binary');
        fileId = yield insertOrUpdateSound(fileName);
        fileId2 = yield insertOrUpdateSound(`${fileName}-2`);
        yield uploadCustomSound(binary, fileName, fileId);
        yield uploadCustomSound(binary, `${fileName}-2`, fileId2);
    }));
    (0, mocha_1.after)(() => api_data_1.request
        .post((0, api_data_1.api)('method.call/deleteCustomSound'))
        .set(api_data_1.credentials)
        .send({
        message: JSON.stringify({
            msg: 'method',
            id: '33',
            method: 'deleteCustomSound',
            params: [fileId],
        }),
    }));
    (0, mocha_1.describe)('[/custom-sounds.list]', () => {
        (0, mocha_1.it)('should return custom sounds', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('custom-sounds.list'))
                .set(api_data_1.credentials)
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('sounds').and.to.be.an('array');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('offset');
                (0, chai_1.expect)(res.body).to.have.property('count');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return custom sounds even requested with count and offset params', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('custom-sounds.list'))
                .set(api_data_1.credentials)
                .expect(200)
                .query({
                count: 5,
                offset: 0,
            })
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('sounds').and.to.be.an('array');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('offset');
                (0, chai_1.expect)(res.body).to.have.property('count');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return custom sounds filtering it using the `name` parameter', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('custom-sounds.list'))
                .set(api_data_1.credentials)
                .expect(200)
                .query({
                name: `${fileName}-2`,
                count: 5,
                offset: 0,
            })
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('sounds').and.to.be.an('array');
                (0, chai_1.expect)(res.body).to.have.property('total').to.equal(1);
                (0, chai_1.expect)(res.body).to.have.property('offset').to.equal(0);
                (0, chai_1.expect)(res.body).to.have.property('count').to.equal(1);
                (0, chai_1.expect)(res.body.sounds[0]._id).to.be.equal(fileId2);
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('Accessing custom sounds', () => {
        (0, mocha_1.it)('should return forbidden if the there is no fileId on the url', (done) => {
            void api_data_1.request
                .get('/custom-sounds/')
                .set(api_data_1.credentials)
                .expect(403)
                .expect((res) => {
                (0, chai_1.expect)(res.text).to.be.equal('Forbidden');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return not found if the the requested file does not exists', (done) => {
            void api_data_1.request
                .get('/custom-sounds/invalid.mp3')
                .set(api_data_1.credentials)
                .expect(404)
                .expect((res) => {
                (0, chai_1.expect)(res.text).to.be.equal('Not found');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return success if the the requested exists', (done) => {
            void api_data_1.request
                .get(`/custom-sounds/${fileId}.wav`)
                .set(api_data_1.credentials)
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.headers).to.have.property('last-modified');
                (0, chai_1.expect)(res.headers).to.have.property('content-type', 'audio/wav');
                (0, chai_1.expect)(res.headers).to.have.property('cache-control', 'public, max-age=0');
                (0, chai_1.expect)(res.headers).to.have.property('expires', '-1');
                uploadDate = res.headers['last-modified'];
            })
                .end(done);
        });
        (0, mocha_1.it)('should return not modified if the the requested file contains a valid-since equal to the upload date', (done) => {
            void api_data_1.request
                .get(`/custom-sounds/${fileId}.wav`)
                .set(api_data_1.credentials)
                .set({
                'if-modified-since': uploadDate,
            })
                .expect(304)
                .expect((res) => {
                (0, chai_1.expect)(res.headers).to.have.property('last-modified', uploadDate);
                (0, chai_1.expect)(res.headers).not.to.have.property('content-type');
                (0, chai_1.expect)(res.headers).not.to.have.property('cache-control');
                (0, chai_1.expect)(res.headers).not.to.have.property('expires');
            })
                .end(done);
        });
    });
});
