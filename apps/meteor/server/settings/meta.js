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
exports.createMetaSettings = void 0;
const server_1 = require("../../app/settings/server");
const createMetaSettings = () => server_1.settingsRegistry.addGroup('Meta', function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield this.add('Meta_language', '', {
            type: 'string',
        });
        yield this.add('Meta_fb_app_id', '', {
            type: 'string',
            secret: true,
        });
        yield this.add('Meta_robots', 'INDEX,FOLLOW', {
            type: 'string',
        });
        yield this.add('Meta_google-site-verification', '', {
            type: 'string',
            secret: true,
        });
        yield this.add('Meta_msvalidate01', '', {
            type: 'string',
            secret: true,
        });
        return this.add('Meta_custom', '', {
            type: 'code',
            code: 'text/html',
            multiline: true,
        });
    });
});
exports.createMetaSettings = createMetaSettings;
