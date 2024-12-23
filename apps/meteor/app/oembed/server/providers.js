"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const change_case_1 = require("change-case");
const callbacks_1 = require("../../../lib/callbacks");
const system_1 = require("../../../server/lib/logger/system");
class Providers {
    constructor() {
        this.providers = [];
    }
    static getConsumerUrl(provider, url) {
        const urlObj = new URL(provider.endPoint);
        urlObj.searchParams.set('url', url);
        return urlObj.toString();
    }
    registerProvider(provider) {
        return this.providers.push(provider);
    }
    getProviders() {
        return this.providers;
    }
    getProviderForUrl(url) {
        var _a;
        return (_a = this.providers) === null || _a === void 0 ? void 0 : _a.find((provider) => {
            var _a, _b;
            return ((_b = (_a = provider.urls) === null || _a === void 0 ? void 0 : _a.some((re) => {
                return re.test(url);
            })) !== null && _b !== void 0 ? _b : false);
        });
    }
}
const providers = new Providers();
providers.registerProvider({
    urls: [new RegExp('https?://soundcloud\\.com/\\S+')],
    endPoint: 'https://soundcloud.com/oembed?format=json&maxheight=150',
});
providers.registerProvider({
    urls: [
        new RegExp('https?://vimeo\\.com/[^/]+'),
        new RegExp('https?://vimeo\\.com/channels/[^/]+/[^/]+'),
        new RegExp('https://vimeo\\.com/groups/[^/]+/videos/[^/]+'),
    ],
    endPoint: 'https://vimeo.com/api/oembed.json?maxheight=200',
});
providers.registerProvider({
    urls: [new RegExp('https?://www\\.youtube\\.com/\\S+'), new RegExp('https?://youtu\\.be/\\S+')],
    endPoint: 'https://www.youtube.com/oembed?maxheight=200',
});
providers.registerProvider({
    urls: [new RegExp('https?://www\\.rdio\\.com/\\S+'), new RegExp('https?://rd\\.io/\\S+')],
    endPoint: 'https://www.rdio.com/api/oembed/?format=json&maxheight=150',
});
providers.registerProvider({
    urls: [new RegExp('https?://www\\.slideshare\\.net/[^/]+/[^/]+')],
    endPoint: 'https://www.slideshare.net/api/oembed/2?format=json&maxheight=200',
});
providers.registerProvider({
    urls: [new RegExp('https?://www\\.dailymotion\\.com/video/\\S+')],
    endPoint: 'https://www.dailymotion.com/services/oembed?maxheight=200',
});
providers.registerProvider({
    urls: [new RegExp('https?://(twitter|x)\\.com/[^/]+/status/\\S+')],
    endPoint: 'https://publish.twitter.com/oembed',
});
providers.registerProvider({
    urls: [new RegExp('https?://(play|open)\\.spotify\\.com/(track|album|playlist|show)/\\S+')],
    endPoint: 'https://open.spotify.com/oembed',
});
providers.registerProvider({
    urls: [new RegExp('https?://www\\.loom\\.com/\\S+')],
    endPoint: 'https://www.loom.com/v1/oembed?format=json',
});
callbacks_1.callbacks.add('oembed:beforeGetUrlContent', (data) => {
    if (!data.urlObj) {
        return data;
    }
    const url = data.urlObj.toString();
    const provider = providers.getProviderForUrl(url);
    if (!provider) {
        return data;
    }
    const consumerUrl = Providers.getConsumerUrl(provider, url);
    return Object.assign(Object.assign({}, data), { urlObj: new URL(consumerUrl) });
}, callbacks_1.callbacks.priority.MEDIUM, 'oembed-providers-before');
const cleanupOembed = (data) => {
    if (!(data === null || data === void 0 ? void 0 : data.meta)) {
        return data;
    }
    // remove oembedHtml key from original meta
    const _a = data.meta, { oembedHtml } = _a, meta = __rest(_a, ["oembedHtml"]);
    return Object.assign(Object.assign({}, data), { meta });
};
callbacks_1.callbacks.add('oembed:afterParseContent', (data) => {
    var _a;
    if (!(data === null || data === void 0 ? void 0 : data.url) || !((_a = data.content) === null || _a === void 0 ? void 0 : _a.body)) {
        return cleanupOembed(data);
    }
    const provider = providers.getProviderForUrl(data.url);
    if (!provider) {
        return cleanupOembed(data);
    }
    data.meta.oembedUrl = data.url;
    try {
        const metas = JSON.parse(data.content.body);
        Object.entries(metas).forEach(([key, value]) => {
            if (value && typeof value === 'string') {
                data.meta[(0, change_case_1.camelCase)(`oembed_${key}`)] = value;
            }
        });
    }
    catch (error) {
        system_1.SystemLogger.error(error);
    }
    return data;
}, callbacks_1.callbacks.priority.MEDIUM, 'oembed-providers-after');
