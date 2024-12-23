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
const crypto_1 = __importDefault(require("crypto"));
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const webapp_1 = require("meteor/webapp");
const server_1 = require("../../settings/server");
const inject_1 = require("../../ui-master/server/inject");
server_1.settings.watch('theme-custom-css', (value) => {
    if (!value || typeof value !== 'string') {
        (0, inject_1.addStyle)('css-theme', '');
        return;
    }
    (0, inject_1.addStyle)('css-theme', value);
});
// TODO: Add a migration to remove this setting from the database
meteor_1.Meteor.startup(() => __awaiter(void 0, void 0, void 0, function* () {
    yield models_1.Settings.deleteMany({ _id: /theme-color/ });
    yield models_1.Settings.deleteOne({ _id: /theme-font/ });
    yield models_1.Settings.deleteOne({ _id: 'css' });
}));
webapp_1.WebApp.rawConnectHandlers.use((req, res, next) => {
    var _a;
    const path = (_a = req.url) === null || _a === void 0 ? void 0 : _a.split('?')[0];
    const prefix = __meteor_runtime_config__.ROOT_URL_PATH_PREFIX || '';
    if (path !== `${prefix}/theme.css`) {
        next();
        return;
    }
    const style = server_1.settings.get('theme-custom-css');
    if (typeof style !== 'string') {
        throw new Error('Invalid theme-custom-css setting');
    }
    res.setHeader('Content-Type', 'text/css; charset=UTF-8');
    res.setHeader('Content-Length', style.length);
    res.setHeader('ETag', `"${crypto_1.default.createHash('sha1').update(style).digest('hex')}"`);
    res.end(style, 'utf-8');
});
