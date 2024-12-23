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
const BeforeSaveSpotify_1 = require("../../../../../../server/services/messages/hooks/BeforeSaveSpotify");
const createMessage = (msg, extra = {}) => (Object.assign({ _id: 'random', rid: 'GENERAL', ts: new Date(), u: {
        _id: 'userId',
        username: 'username',
    }, _updatedAt: new Date(), msg: msg }, extra));
describe('Convert Spotify syntax to URLs', () => {
    it('should return no URLs if no Spotify syntax provided', () => __awaiter(void 0, void 0, void 0, function* () {
        const spotify = new BeforeSaveSpotify_1.BeforeSaveSpotify();
        const message = yield spotify.convertSpotifyLinks({
            message: createMessage('hey'),
        });
        return (0, chai_1.expect)(message).to.not.have.property('urls');
    }));
    it('should return no URLs if an undefined message is provided', () => __awaiter(void 0, void 0, void 0, function* () {
        const spotify = new BeforeSaveSpotify_1.BeforeSaveSpotify();
        const message = yield spotify.convertSpotifyLinks({
            message: createMessage(),
        });
        return (0, chai_1.expect)(message).to.not.have.property('urls');
    }));
    it('should not return a Spotify URL if some Spotify syntax is provided within a code block', () => __awaiter(void 0, void 0, void 0, function* () {
        const spotify = new BeforeSaveSpotify_1.BeforeSaveSpotify();
        const message = yield spotify.convertSpotifyLinks({
            message: createMessage('test\n```\nspotify:track:1q6IK1l4qpYykOaWaLJkWG\n```'),
        });
        return (0, chai_1.expect)(message).to.not.have.property('urls');
    }));
    it('should not return a Spotify URL if some Spotify syntax is provided within a inline code', () => __awaiter(void 0, void 0, void 0, function* () {
        const spotify = new BeforeSaveSpotify_1.BeforeSaveSpotify();
        const message = yield spotify.convertSpotifyLinks({
            message: createMessage('test `spotify:track:1q6IK1l4qpYykOaWaLJkWG` ok'),
        });
        return (0, chai_1.expect)(message).to.not.have.property('urls');
    }));
    it('should return a Spotify URL if some Spotify syntax is provided', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const spotify = new BeforeSaveSpotify_1.BeforeSaveSpotify();
        const message = yield spotify.convertSpotifyLinks({
            message: createMessage('spotify:track:1q6IK1l4qpYykOaWaLJkWG'),
        });
        (0, chai_1.expect)(message).to.have.property('urls').and.to.have.lengthOf(1);
        const [url] = (_a = message.urls) !== null && _a !== void 0 ? _a : [];
        (0, chai_1.expect)(url).to.have.property('url', 'https://open.spotify.com/track/1q6IK1l4qpYykOaWaLJkWG');
        (0, chai_1.expect)(url).to.have.property('source', 'spotify:track:1q6IK1l4qpYykOaWaLJkWG');
    }));
    it('should append a Spotify URL when Spotify syntax is provided with already existing URLs', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const spotify = new BeforeSaveSpotify_1.BeforeSaveSpotify();
        const message = yield spotify.convertSpotifyLinks({
            message: createMessage('spotify:track:1q6IK1l4qpYykOaWaLJkWG', {
                urls: [{ url: 'https://rocket.chat' }],
            }),
        });
        (0, chai_1.expect)(message).to.have.property('urls').and.to.have.lengthOf(2);
        const [url1, url2] = (_a = message.urls) !== null && _a !== void 0 ? _a : [];
        (0, chai_1.expect)(url1).to.have.property('url', 'https://rocket.chat');
        (0, chai_1.expect)(url2).to.have.property('url', 'https://open.spotify.com/track/1q6IK1l4qpYykOaWaLJkWG');
        (0, chai_1.expect)(url2).to.have.property('source', 'spotify:track:1q6IK1l4qpYykOaWaLJkWG');
    }));
});
