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
exports.BeforeSaveSpotify = void 0;
// look for spotify syntax (e.g.: spotify:track:1q6IK1l4qpYykOaWaLJkWG) on the message and add them to the urls array
class BeforeSaveSpotify {
    convertSpotifyLinks(_a) {
        return __awaiter(this, arguments, void 0, function* ({ message }) {
            var _b;
            if (!((_b = message.msg) === null || _b === void 0 ? void 0 : _b.trim())) {
                return message;
            }
            const urls = Array.isArray(message.urls) ? message.urls : [];
            let changed = false;
            const msgParts = message.msg.split(/(```\w*[\n ]?[\s\S]*?```+?)|(`(?:[^`]+)`)/);
            for (let index = 0; index < msgParts.length; index++) {
                const part = msgParts[index];
                if (!/(?:```(\w*)[\n ]?([\s\S]*?)```+?)|(?:`(?:[^`]+)`)/.test(part)) {
                    const re = /(?:^|\s)spotify:([^:\s]+):([^:\s]+)(?::([^:\s]+))?(?::(\S+))?(?:\s|$)/g;
                    let match;
                    while ((match = re.exec(part)) != null) {
                        const data = match.slice(1).filter(Boolean);
                        const path = data.map((value) => encodeURI(value)).join('/');
                        const url = `https://open.spotify.com/${path}`;
                        urls.push({ url, source: `spotify:${data.join(':')}`, meta: {} });
                        changed = true;
                    }
                }
            }
            if (changed) {
                message.urls = urls;
            }
            return message;
        });
    }
}
exports.BeforeSaveSpotify = BeforeSaveSpotify;
