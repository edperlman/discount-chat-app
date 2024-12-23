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
const models_1 = require("@rocket.chat/models");
const webapp_1 = require("meteor/webapp");
const FileUpload_1 = require("./FileUpload");
webapp_1.WebApp.connectHandlers.use(FileUpload_1.FileUpload.getPath(), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const match = /^\/([^\/]+)\/(.*)/.exec(req.url || '');
    if (match === null || match === void 0 ? void 0 : match[1]) {
        const file = yield models_1.Uploads.findOneById(match[1]);
        if (file) {
            if (!(yield FileUpload_1.FileUpload.requestCanAccessFiles(req, file))) {
                res.writeHead(403);
                return res.end();
            }
            res.setHeader('Content-Security-Policy', "default-src 'none'");
            res.setHeader('Cache-Control', 'max-age=31536000');
            return FileUpload_1.FileUpload.get(file, req, res, next);
        }
    }
    res.writeHead(404);
    res.end();
}));
