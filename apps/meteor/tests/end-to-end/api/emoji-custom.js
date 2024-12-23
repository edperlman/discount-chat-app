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
const interactions_1 = require("../../data/interactions");
(0, mocha_1.describe)('[EmojiCustom]', () => {
    const customEmojiName = `my-custom-emoji-${Date.now()}`;
    let withoutAliases;
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.after)(() => api_data_1.request.post((0, api_data_1.api)('emoji-custom.delete')).set(api_data_1.credentials).send({
        emojiId: withoutAliases._id,
    }));
    (0, mocha_1.describe)('[/emoji-custom.create]', () => {
        (0, mocha_1.it)('should create new custom emoji', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('emoji-custom.create'))
                .set(api_data_1.credentials)
                .attach('emoji', interactions_1.imgURL)
                .field({
                name: customEmojiName,
                aliases: `${customEmojiName}-alias`,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
        (0, mocha_1.it)('should create new custom emoji without optional parameter "aliases"', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('emoji-custom.create'))
                .set(api_data_1.credentials)
                .attach('emoji', interactions_1.imgURL)
                .field({
                name: `${customEmojiName}-without-aliases`,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
        (0, mocha_1.it)('should throw an error when the filename is wrong', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('emoji-custom.create'))
                .set(api_data_1.credentials)
                .attach('emojiwrong', interactions_1.imgURL)
                .field({
                _id: 'invalid-id',
                name: 'my-custom-emoji-without-aliases',
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.errorType).to.be.equal('invalid-field');
            })
                .end(done);
        });
    });
    let createdCustomEmoji;
    (0, mocha_1.describe)('[/emoji-custom.update]', () => {
        (0, mocha_1.before)((done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('emoji-custom.list'))
                .set(api_data_1.credentials)
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('emojis').and.to.be.a('object');
                (0, chai_1.expect)(res.body.emojis).to.have.property('update').and.to.be.a('array').and.to.not.have.lengthOf(0);
                (0, chai_1.expect)(res.body.emojis).to.have.property('remove').and.to.be.a('array').and.to.have.lengthOf(0);
                const _createdCustomEmoji = res.body.emojis.update.find((emoji) => emoji.name === customEmojiName);
                const _withoutAliases = res.body.emojis.update.find((emoji) => emoji.name === `${customEmojiName}-without-aliases`);
                chai_1.assert.isDefined(_createdCustomEmoji);
                chai_1.assert.isDefined(_withoutAliases);
                createdCustomEmoji = _createdCustomEmoji;
                withoutAliases = _withoutAliases;
            })
                .end(done);
        });
        (0, mocha_1.describe)('successfully:', () => {
            (0, mocha_1.it)('should update the custom emoji without a file', (done) => {
                void api_data_1.request
                    .post((0, api_data_1.api)('emoji-custom.update'))
                    .set(api_data_1.credentials)
                    .field({
                    _id: createdCustomEmoji._id,
                    name: customEmojiName,
                    aliases: 'alias-my-custom-emoji',
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                })
                    .end(done);
            });
            (0, mocha_1.it)('should update the custom emoji without optional parameter "aliases"', (done) => {
                void api_data_1.request
                    .post((0, api_data_1.api)('emoji-custom.update'))
                    .set(api_data_1.credentials)
                    .field({
                    _id: createdCustomEmoji._id,
                    name: customEmojiName,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                })
                    .end(done);
            });
            (0, mocha_1.it)('should update the custom emoji with all parameters and with a file', (done) => {
                void api_data_1.request
                    .post((0, api_data_1.api)('emoji-custom.update'))
                    .set(api_data_1.credentials)
                    .attach('emoji', interactions_1.imgURL)
                    .field({
                    _id: createdCustomEmoji._id,
                    name: customEmojiName,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                })
                    .end(done);
            });
            (0, mocha_1.it)('should change the etag when the custom emoji image is updated', () => __awaiter(void 0, void 0, void 0, function* () {
                const prevEtag = createdCustomEmoji.etag;
                yield api_data_1.request
                    .post((0, api_data_1.api)('emoji-custom.update'))
                    .set(api_data_1.credentials)
                    .attach('emoji', interactions_1.imgURL)
                    .field({
                    _id: createdCustomEmoji._id,
                    name: customEmojiName,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                });
                const emojis = yield api_data_1.request.get((0, api_data_1.api)(`emoji-custom.all`)).set(api_data_1.credentials).expect(200);
                const updatedCustomEmoji = emojis.body.emojis.find((emoji) => emoji._id === createdCustomEmoji._id);
                (0, chai_1.expect)(updatedCustomEmoji.etag).not.to.be.equal(prevEtag);
            }));
        });
        (0, mocha_1.describe)('should throw error when:', () => {
            (0, mocha_1.it)('the fields does not include "_id"', (done) => {
                void api_data_1.request
                    .post((0, api_data_1.api)('emoji-custom.update'))
                    .set(api_data_1.credentials)
                    .attach('emoji', interactions_1.imgURL)
                    .field({
                    name: 'my-custom-emoji-without-aliases',
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body.errorType).to.be.equal('The required "_id" query param is missing.');
                })
                    .end(done);
            });
            (0, mocha_1.it)('the custom emoji does not exists', (done) => {
                void api_data_1.request
                    .post((0, api_data_1.api)('emoji-custom.update'))
                    .set(api_data_1.credentials)
                    .attach('emoji', interactions_1.imgURL)
                    .field({
                    _id: 'invalid-id',
                    name: 'my-custom-emoji-without-aliases',
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body.errorType).to.be.equal('Emoji not found.');
                })
                    .end(done);
            });
            (0, mocha_1.it)('the emoji file field is wrong', (done) => {
                void api_data_1.request
                    .post((0, api_data_1.api)('emoji-custom.update'))
                    .set(api_data_1.credentials)
                    .attach('emojiwrong', interactions_1.imgURL)
                    .field({
                    _id: createdCustomEmoji._id,
                    name: 'my-custom-emoji-without-aliases',
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body.errorType).to.be.equal('invalid-field');
                })
                    .end(done);
            });
        });
    });
    (0, mocha_1.describe)('[/emoji-custom.list]', () => {
        (0, mocha_1.it)('should return emojis', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('emoji-custom.list'))
                .set(api_data_1.credentials)
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('emojis').and.to.be.a('object');
                (0, chai_1.expect)(res.body.emojis).to.have.property('update').and.to.be.a('array').and.to.not.have.lengthOf(0);
                (0, chai_1.expect)(res.body.emojis).to.have.property('remove').and.to.be.a('array').and.to.have.lengthOf(0);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return emojis when use "query" query parameter', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('emoji-custom.list'))
                .query({ _updatedAt: new Date().toISOString() })
                .set(api_data_1.credentials)
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('emojis').and.to.be.a('object');
                (0, chai_1.expect)(res.body.emojis).to.have.property('update').and.to.be.a('array').and.to.have.lengthOf(0);
                (0, chai_1.expect)(res.body.emojis).to.have.property('remove').and.to.be.a('array').and.to.have.lengthOf(0);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return emojis when use "updateSince" query parameter', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('emoji-custom.list'))
                .query({ updatedSince: new Date().toISOString() })
                .set(api_data_1.credentials)
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('emojis').and.to.be.a('object');
                (0, chai_1.expect)(res.body.emojis).to.have.property('update').and.to.be.a('array').and.to.have.lengthOf(0);
                (0, chai_1.expect)(res.body.emojis).to.have.property('remove').and.to.be.a('array').and.to.have.lengthOf(0);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return emojis when use both, "updateSince" and "query" query parameter', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('emoji-custom.list'))
                .query({ _updatedAt: new Date().toISOString(), updatedSince: new Date().toISOString() })
                .set(api_data_1.credentials)
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('emojis').and.to.be.a('object');
                (0, chai_1.expect)(res.body.emojis).to.have.property('update').and.to.be.a('array').and.to.have.lengthOf(0);
                (0, chai_1.expect)(res.body.emojis).to.have.property('remove').and.to.be.a('array').and.to.have.lengthOf(0);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return an error when the "updateSince" query parameter is a invalid date', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('emoji-custom.list'))
                .query({ updatedSince: 'invalid-date' })
                .set(api_data_1.credentials)
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.errorType).to.be.equal('error-roomId-param-invalid');
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('[/emoji-custom.all]', () => {
        (0, mocha_1.it)('should return emojis', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('emoji-custom.all'))
                .set(api_data_1.credentials)
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('emojis').and.to.be.an('array');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('offset');
                (0, chai_1.expect)(res.body).to.have.property('count');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return emojis even requested with count and offset params', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('emoji-custom.all'))
                .set(api_data_1.credentials)
                .query({
                count: 5,
                offset: 0,
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('emojis').and.to.be.an('array');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('offset');
                (0, chai_1.expect)(res.body).to.have.property('count');
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('Accessing custom emojis', () => {
        let uploadDate;
        (0, mocha_1.it)('should return forbidden if the there is no fileId on the url', (done) => {
            void api_data_1.request
                .get('/emoji-custom/')
                .set(api_data_1.credentials)
                .expect(403)
                .expect((res) => {
                (0, chai_1.expect)(res.text).to.be.equal('Forbidden');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return success if the file does not exists with some specific headers', (done) => {
            void api_data_1.request
                .get('/emoji-custom/invalid')
                .set(api_data_1.credentials)
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.headers).to.have.property('last-modified', 'Thu, 01 Jan 2015 00:00:00 GMT');
                (0, chai_1.expect)(res.headers).to.have.property('content-type', 'image/svg+xml');
                (0, chai_1.expect)(res.headers).to.have.property('cache-control', 'public, max-age=0');
                (0, chai_1.expect)(res.headers).to.have.property('expires', '-1');
                (0, chai_1.expect)(res.headers).to.have.property('content-disposition', 'inline');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return not modified if the file does not exists and if-modified-since is equal to the Thu, 01 Jan 2015 00:00:00 GMT', (done) => {
            void api_data_1.request
                .get('/emoji-custom/invalid')
                .set(api_data_1.credentials)
                .set({
                'if-modified-since': 'Thu, 01 Jan 2015 00:00:00 GMT',
            })
                .expect(304)
                .expect((res) => {
                (0, chai_1.expect)(res.headers).to.have.property('last-modified', 'Thu, 01 Jan 2015 00:00:00 GMT');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return success if the the requested exists', (done) => {
            void api_data_1.request
                .get(`/emoji-custom/${customEmojiName}.png`)
                .set(api_data_1.credentials)
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.headers).to.have.property('last-modified');
                (0, chai_1.expect)(res.headers).to.have.property('content-type', 'image/png');
                (0, chai_1.expect)(res.headers).to.have.property('cache-control', 'public, max-age=31536000');
                (0, chai_1.expect)(res.headers).to.have.property('content-disposition', 'inline');
                uploadDate = res.headers['last-modified'];
            })
                .end(done);
        });
        (0, mocha_1.it)('should return not modified if the the requested file contains a valid-since equal to the upload date', (done) => {
            void api_data_1.request
                .get(`/emoji-custom/${customEmojiName}.png`)
                .set(api_data_1.credentials)
                .set({
                'if-modified-since': uploadDate,
            })
                .expect(304)
                .expect((res) => {
                (0, chai_1.expect)(res.headers).to.have.property('last-modified', uploadDate);
                (0, chai_1.expect)(res.headers).not.to.have.property('content-type');
                (0, chai_1.expect)(res.headers).not.to.have.property('content-length');
                (0, chai_1.expect)(res.headers).not.to.have.property('cache-control');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return the emoji even when no etag is passed (for old emojis)', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request.get(`/emoji-custom/${createdCustomEmoji.name}.png`).set(api_data_1.credentials).expect(200);
            (0, chai_1.expect)(res.headers).to.have.property('content-type', 'image/png');
            (0, chai_1.expect)(res.headers).to.have.property('cache-control', 'public, max-age=31536000');
            (0, chai_1.expect)(res.headers).to.have.property('content-disposition', 'inline');
        }));
        (0, mocha_1.it)('should return success if the etag is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request
                .get(`/emoji-custom/${createdCustomEmoji.name}.png?etag=1234`)
                .set(api_data_1.credentials)
                .set({
                'if-none-match': 'invalid-etag',
            })
                .expect(200);
            (0, chai_1.expect)(res.headers).to.have.property('content-type', 'image/png');
            (0, chai_1.expect)(res.headers).to.have.property('cache-control', 'public, max-age=31536000');
            (0, chai_1.expect)(res.headers).to.have.property('content-disposition', 'inline');
        }));
    });
    (0, mocha_1.describe)('[/emoji-custom.delete]', () => {
        (0, mocha_1.it)('should throw an error when trying delete custom emoji without the required param "emojid"', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('emoji-custom.delete'))
                .set(api_data_1.credentials)
                .send({})
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.error).to.be.equal('The "emojiId" params is required!');
            })
                .end(done);
        });
        (0, mocha_1.it)('should throw an error when trying delete custom emoji that does not exists', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('emoji-custom.delete'))
                .set(api_data_1.credentials)
                .send({
                emojiId: 'invalid-id',
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.errorType).to.be.equal('Custom_Emoji_Error_Invalid_Emoji');
            })
                .end(done);
        });
        (0, mocha_1.it)('should delete the custom emoji created before successfully', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('emoji-custom.delete'))
                .set(api_data_1.credentials)
                .send({
                emojiId: createdCustomEmoji._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
    });
});
