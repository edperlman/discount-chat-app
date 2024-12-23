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
const webapp_1 = require("meteor/webapp");
const path_to_regexp_1 = require("path-to-regexp");
const matchRoute = (0, path_to_regexp_1.match)('/:lng.json', { decode: decodeURIComponent });
const i18nHandler = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const url = new URL((_a = req.url) !== null && _a !== void 0 ? _a : '/', `https://${req.headers.host}`);
        const match = matchRoute(url.pathname);
        if (match === false) {
            res.writeHead(400);
            res.end();
            return;
        }
        const { lng } = match.params;
        try {
            const data = yield Assets.getTextAsync(`i18n/${lng}.i18n.json`);
            if (!data) {
                throw new Error();
            }
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Length', data.length);
            res.writeHead(200);
            res.end(data);
        }
        catch (e) {
            res.writeHead(400);
            res.end();
        }
    });
};
webapp_1.WebApp.connectHandlers.use('/i18n/', i18nHandler);
