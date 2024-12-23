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
exports.protectAvatars = exports.protectAvatarsWithFallback = void 0;
const utils_1 = require("../utils");
const renderFallback = (req, res) => {
    if (!req.url) {
        res.writeHead(404);
        res.end();
        return;
    }
    let roomOrUsername;
    if (req.url.startsWith('/room')) {
        roomOrUsername = req.url.split('/')[2] || 'Room';
    }
    else {
        roomOrUsername = req.url.split('/')[1] || 'Anonymous';
    }
    res.writeHead(200, { 'Content-Type': 'image/svg+xml' });
    res.write((0, utils_1.renderSVGLetters)(roomOrUsername, 200));
    res.end();
};
const getProtectAvatars = (callback) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(yield (0, utils_1.userCanAccessAvatar)(req))) {
        if (callback) {
            callback(req, res);
            return;
        }
        res.writeHead(404);
        res.end();
        return;
    }
    return next();
});
// If unauthorized returns the SVG fallback (letter avatar)
exports.protectAvatarsWithFallback = getProtectAvatars(renderFallback);
// Just returns 404
exports.protectAvatars = getProtectAvatars();
