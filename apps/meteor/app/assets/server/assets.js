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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshClients = exports.RocketChatAssets = void 0;
exports.addAssetToSetting = addAssetToSetting;
const crypto_1 = __importDefault(require("crypto"));
const models_1 = require("@rocket.chat/models");
const image_size_1 = __importDefault(require("image-size"));
const meteor_1 = require("meteor/meteor");
const webapp_1 = require("meteor/webapp");
const sharp_1 = __importDefault(require("sharp"));
const hasPermission_1 = require("../../authorization/server/functions/hasPermission");
const server_1 = require("../../file/server");
const notifyListener_1 = require("../../lib/server/lib/notifyListener");
const server_2 = require("../../settings/server");
const mimeTypes_1 = require("../../utils/lib/mimeTypes");
const getURL_1 = require("../../utils/server/getURL");
const RocketChatAssetsInstance = new server_1.RocketChatFile.GridFS({
    name: 'assets',
});
const assets = {
    logo: {
        label: 'logo (svg, png, jpg)',
        defaultUrl: 'images/logo/logo.svg',
        constraints: {
            type: 'image',
            extensions: ['svg', 'png', 'jpg', 'jpeg'],
        },
        wizard: {
            step: 3,
            order: 2,
        },
    },
    logo_dark: {
        label: 'logo - dark theme (svg, png, jpg)',
        defaultUrl: 'images/logo/logo_dark.svg',
        constraints: {
            type: 'image',
            extensions: ['svg', 'png', 'jpg', 'jpeg'],
        },
    },
    background: {
        label: 'login background (svg, png, jpg)',
        constraints: {
            type: 'image',
            extensions: ['svg', 'png', 'jpg', 'jpeg'],
        },
    },
    background_dark: {
        label: 'login background - dark theme (svg, png, jpg)',
        constraints: {
            type: 'image',
            extensions: ['svg', 'png', 'jpg', 'jpeg'],
        },
    },
    favicon_ico: {
        label: 'favicon (ico)',
        defaultUrl: 'favicon.ico',
        constraints: {
            type: 'image',
            extensions: ['ico'],
        },
    },
    favicon: {
        label: 'favicon (svg)',
        defaultUrl: 'images/logo/icon.svg',
        constraints: {
            type: 'image',
            extensions: ['svg'],
        },
    },
    favicon_16: {
        label: 'favicon 16x16 (png)',
        defaultUrl: 'images/logo/favicon-16x16.png',
        constraints: {
            type: 'image',
            extensions: ['png'],
            width: 16,
            height: 16,
        },
    },
    favicon_32: {
        label: 'favicon 32x32 (png)',
        defaultUrl: 'images/logo/favicon-32x32.png',
        constraints: {
            type: 'image',
            extensions: ['png'],
            width: 32,
            height: 32,
        },
    },
    favicon_192: {
        label: 'android-chrome 192x192 (png)',
        defaultUrl: 'images/logo/android-chrome-192x192.png',
        constraints: {
            type: 'image',
            extensions: ['png'],
            width: 192,
            height: 192,
        },
    },
    favicon_512: {
        label: 'android-chrome 512x512 (png)',
        defaultUrl: 'images/logo/android-chrome-512x512.png',
        constraints: {
            type: 'image',
            extensions: ['png'],
            width: 512,
            height: 512,
        },
    },
    touchicon_180: {
        label: 'apple-touch-icon 180x180 (png)',
        defaultUrl: 'images/logo/apple-touch-icon.png',
        constraints: {
            type: 'image',
            extensions: ['png'],
            width: 180,
            height: 180,
        },
    },
    touchicon_180_pre: {
        label: 'apple-touch-icon-precomposed 180x180 (png)',
        defaultUrl: 'images/logo/apple-touch-icon-precomposed.png',
        constraints: {
            type: 'image',
            extensions: ['png'],
            width: 180,
            height: 180,
        },
    },
    tile_70: {
        label: 'mstile 70x70 (png)',
        defaultUrl: 'images/logo/mstile-70x70.png',
        constraints: {
            type: 'image',
            extensions: ['png'],
            width: 70,
            height: 70,
        },
    },
    tile_144: {
        label: 'mstile 144x144 (png)',
        defaultUrl: 'images/logo/mstile-144x144.png',
        constraints: {
            type: 'image',
            extensions: ['png'],
            width: 144,
            height: 144,
        },
    },
    tile_150: {
        label: 'mstile 150x150 (png)',
        defaultUrl: 'images/logo/mstile-150x150.png',
        constraints: {
            type: 'image',
            extensions: ['png'],
            width: 150,
            height: 150,
        },
    },
    tile_310_square: {
        label: 'mstile 310x310 (png)',
        defaultUrl: 'images/logo/mstile-310x310.png',
        constraints: {
            type: 'image',
            extensions: ['png'],
            width: 310,
            height: 310,
        },
    },
    tile_310_wide: {
        label: 'mstile 310x150 (png)',
        defaultUrl: 'images/logo/mstile-310x150.png',
        constraints: {
            type: 'image',
            extensions: ['png'],
            width: 310,
            height: 150,
        },
    },
    safari_pinned: {
        label: 'safari pinned tab (svg)',
        defaultUrl: 'images/logo/safari-pinned-tab.svg',
        constraints: {
            type: 'image',
            extensions: ['svg'],
        },
    },
    livechat_widget_logo: {
        label: 'widget logo (svg, png, jpg)',
        constraints: {
            type: 'image',
            extensions: ['svg', 'png', 'jpg', 'jpeg'],
        },
        settingOptions: {
            section: 'Livechat',
            group: 'Omnichannel',
            invalidValue: {
                defaultUrl: undefined,
            },
            enableQuery: { _id: 'Livechat_enabled', value: true },
            enterprise: true,
            modules: ['livechat-enterprise'],
            sorter: 999 + 1,
        },
    },
};
function getAssetByKey(key) {
    return assets[key];
}
class RocketChatAssetsClass {
    get assets() {
        return assets;
    }
    setAssetWithBuffer(file, contentType, asset) {
        return __awaiter(this, void 0, void 0, function* () {
            const assetInstance = getAssetByKey(asset);
            if (!assetInstance) {
                throw new meteor_1.Meteor.Error('error-invalid-asset', 'Invalid asset', {
                    function: 'RocketChat.Assets.setAsset',
                });
            }
            const extension = (0, mimeTypes_1.getExtension)(contentType);
            if (assetInstance.constraints.extensions.includes(extension) === false) {
                throw new meteor_1.Meteor.Error('error-invalid-file-type', `Invalid file type: ${contentType}`, {
                    function: 'RocketChat.Assets.setAsset',
                });
            }
            if (assetInstance.constraints.width || assetInstance.constraints.height) {
                const dimensions = (0, image_size_1.default)(file);
                if (assetInstance.constraints.width && assetInstance.constraints.width !== dimensions.width) {
                    throw new meteor_1.Meteor.Error('error-invalid-file-width', 'Invalid file width', {
                        function: 'Invalid file width',
                    });
                }
                if (assetInstance.constraints.height && assetInstance.constraints.height !== dimensions.height) {
                    throw new meteor_1.Meteor.Error('error-invalid-file-height');
                }
            }
            const rs = server_1.RocketChatFile.bufferToStream(file);
            yield RocketChatAssetsInstance.deleteFile(asset);
            const ws = RocketChatAssetsInstance.createWriteStream(asset, contentType);
            return new Promise((resolve) => {
                ws.on('end', () => {
                    return setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                        const key = `Assets_${asset}`;
                        const value = {
                            url: `assets/${asset}.${extension}`,
                            defaultUrl: assetInstance.defaultUrl,
                        };
                        yield exports.RocketChatAssets.processAsset(key, value);
                        resolve({
                            key,
                            value,
                        });
                    }), 200);
                });
                rs.pipe(ws);
            });
        });
    }
    unsetAsset(asset) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!getAssetByKey(asset)) {
                throw new meteor_1.Meteor.Error('error-invalid-asset', 'Invalid asset', {
                    function: 'RocketChat.Assets.unsetAsset',
                });
            }
            yield RocketChatAssetsInstance.deleteFile(asset);
            const key = `Assets_${asset}`;
            const value = {
                defaultUrl: getAssetByKey(asset).defaultUrl,
            };
            yield exports.RocketChatAssets.processAsset(key, value);
            return {
                key,
                value,
            };
        });
    }
    refreshClients() {
        return process.emit('message', {
            refresh: 'client',
        });
    }
    processAsset(settingKey, settingValue) {
        return __awaiter(this, void 0, void 0, function* () {
            if (settingKey.indexOf('Assets_') !== 0) {
                return;
            }
            const assetKey = settingKey.replace(/^Assets_/, '');
            const assetValue = getAssetByKey(assetKey);
            if (!assetValue) {
                return;
            }
            if (!(settingValue === null || settingValue === void 0 ? void 0 : settingValue.url)) {
                assetValue.cache = undefined;
                return;
            }
            const file = yield RocketChatAssetsInstance.getFile(assetKey);
            if (!file) {
                assetValue.cache = undefined;
                return;
            }
            const hash = crypto_1.default.createHash('sha1').update(file.buffer).digest('hex');
            const extension = settingValue.url.split('.').pop();
            assetValue.cache = {
                path: `assets/${assetKey}.${extension}`,
                cacheable: false,
                sourceMapUrl: undefined,
                where: 'client',
                type: 'asset',
                content: file.buffer,
                extension,
                url: `/assets/${assetKey}.${extension}?${hash}`,
                size: file.length,
                uploadDate: file.uploadDate,
                contentType: file.contentType,
                hash,
            };
            return assetValue.cache;
        });
    }
    getURL(assetName, options = { cdn: false, full: true }) {
        const asset = server_2.settings.get(assetName);
        const url = asset.url || asset.defaultUrl;
        return (0, getURL_1.getURL)(url, options);
    }
}
exports.RocketChatAssets = new RocketChatAssetsClass();
function addAssetToSetting(asset, value, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const key = `Assets_${asset}`;
        yield server_2.settingsRegistry.add(key, {
            defaultUrl: value.defaultUrl,
        }, Object.assign({ type: 'asset', group: 'Assets', fileConstraints: value.constraints, i18nLabel: value.label, asset, public: true }, options));
        const currentValue = server_2.settings.get(key);
        if (currentValue && typeof currentValue === 'object' && currentValue.defaultUrl !== getAssetByKey(asset).defaultUrl) {
            currentValue.defaultUrl = getAssetByKey(asset).defaultUrl;
            (yield models_1.Settings.updateValueById(key, currentValue)).modifiedCount && void (0, notifyListener_1.notifyOnSettingChangedById)(key);
        }
    });
}
void (() => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    try {
        for (var _d = true, _e = __asyncValues(Object.keys(assets)), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
            _c = _f.value;
            _d = false;
            const key = _c;
            const _g = getAssetByKey(key), { wizard, settingOptions } = _g, value = __rest(_g, ["wizard", "settingOptions"]);
            yield addAssetToSetting(key, value, Object.assign(Object.assign({}, settingOptions), { wizard }));
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
        }
        finally { if (e_1) throw e_1.error; }
    }
}))();
server_2.settings.watchByRegex(/^Assets_/, (key, value) => exports.RocketChatAssets.processAsset(key, value));
meteor_1.Meteor.startup(() => {
    setTimeout(() => {
        process.emit('message', {
            refresh: 'client',
        });
    }, 200);
});
const refreshClients = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId) {
        throw new Error('Invalid user');
    }
    const _hasPermission = yield (0, hasPermission_1.hasPermissionAsync)(userId, 'manage-assets');
    if (!_hasPermission) {
        throw new Error('Managing assets not allowed');
    }
    return exports.RocketChatAssets.refreshClients();
});
exports.refreshClients = refreshClients;
const listener = (req, res, next) => {
    var _a, _b;
    if (!req.url) {
        return;
    }
    const params = {
        asset: decodeURIComponent(req.url.replace(/^\//, '').replace(/\?.*$/, '')).replace(/\.[^.]*$/, ''),
    };
    const asset = getAssetByKey(params.asset);
    const file = asset === null || asset === void 0 ? void 0 : asset.cache;
    const format = req.url.replace(/.*\.([a-z]+)(?:$|\?.*)/i, '$1');
    if (asset && Array.isArray(asset.constraints.extensions) && !asset.constraints.extensions.includes(format)) {
        res.writeHead(403);
        return res.end();
    }
    if (!file) {
        const defaultUrl = asset === null || asset === void 0 ? void 0 : asset.defaultUrl;
        if (defaultUrl) {
            const assetUrl = format && ['png', 'svg'].includes(format) ? defaultUrl.replace(/(svg|png)$/, format) : defaultUrl;
            req.url = `/${assetUrl}`;
            webapp_1.WebAppInternals.staticFilesMiddleware(webapp_1.WebAppInternals.staticFilesByArch, req, res, next);
        }
        else {
            res.writeHead(404);
            res.end();
        }
        return;
    }
    const reqModifiedHeader = req.headers['if-modified-since'];
    if (reqModifiedHeader) {
        if (reqModifiedHeader === ((_a = file.uploadDate) === null || _a === void 0 ? void 0 : _a.toUTCString())) {
            res.setHeader('Last-Modified', reqModifiedHeader);
            res.writeHead(304);
            res.end();
            return;
        }
    }
    res.setHeader('Cache-Control', 'public, max-age=0');
    res.setHeader('Expires', '-1');
    if (format && format !== file.extension && ['png', 'jpg', 'jpeg'].includes(format)) {
        res.setHeader('Content-Type', `image/${format}`);
        (0, sharp_1.default)(file.content)
            .toFormat(format)
            .pipe(res);
        return;
    }
    res.setHeader('Last-Modified', ((_b = file.uploadDate) === null || _b === void 0 ? void 0 : _b.toUTCString()) || new Date().toUTCString());
    if (file.contentType)
        res.setHeader('Content-Type', file.contentType);
    if (file.size)
        res.setHeader('Content-Length', file.size);
    res.writeHead(200);
    res.end(file.content);
};
webapp_1.WebApp.connectHandlers.use('/assets/', listener);
