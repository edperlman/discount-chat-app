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
Object.defineProperty(exports, "__esModule", { value: true });
const account_utils_1 = require("@rocket.chat/account-utils");
const models_1 = require("@rocket.chat/models");
const ostrio_cookies_1 = require("meteor/ostrio:cookies");
const webapp_1 = require("meteor/webapp");
const path_to_regexp_1 = require("path-to-regexp");
const server_1 = require("../../app/file-upload/server");
const server_2 = require("../../app/settings/server");
const cookies = new ostrio_cookies_1.Cookies();
const matchUID = (uid, token, ownerUID) => __awaiter(void 0, void 0, void 0, function* () {
    return (uid &&
        token &&
        uid === ownerUID &&
        Boolean(yield models_1.Users.findOneByIdAndLoginToken(uid, (0, account_utils_1.hashLoginToken)(token), { projection: { _id: 1 } })));
});
const isRequestFromOwner = (req, ownerUID) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c, _d, e_2, _e, _f;
    if (yield matchUID(req.query.rc_uid, req.query.rc_token, ownerUID)) {
        return true;
    }
    if (req.headers.cookie &&
        (yield matchUID(cookies.get('rc_uid', req.headers.cookie), cookies.get('rc_token', req.headers.cookie), ownerUID))) {
        return true;
    }
    try {
        for (var _g = true, _h = __asyncValues([req.headers['x-user-id']].flat()), _j; _j = yield _h.next(), _a = _j.done, !_a; _g = true) {
            _c = _j.value;
            _g = false;
            const uid = _c;
            try {
                for (var _k = true, _l = (e_2 = void 0, __asyncValues([req.headers['x-auth-token']].flat())), _m; _m = yield _l.next(), _d = _m.done, !_d; _k = true) {
                    _f = _m.value;
                    _k = false;
                    const token = _f;
                    if (yield matchUID(uid, token, ownerUID)) {
                        return true;
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (!_k && !_d && (_e = _l.return)) yield _e.call(_l);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_g && !_a && (_b = _h.return)) yield _b.call(_h);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return false;
});
const sendUserDataFile = (file) => (req, res, next) => {
    const userDataStore = server_1.FileUpload.getStore('UserDataFiles');
    if (!(userDataStore === null || userDataStore === void 0 ? void 0 : userDataStore.get)) {
        res.writeHead(403).end(); // @todo: maybe we should return a better error?
        return;
    }
    res.setHeader('Content-Security-Policy', "default-src 'none'");
    res.setHeader('Cache-Control', 'max-age=31536000');
    void userDataStore.get(file, req, res, next);
};
const matchFileRoute = (0, path_to_regexp_1.match)('/:fileID', { decode: decodeURIComponent });
const userDataDownloadHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const downloadEnabled = server_2.settings.get('UserData_EnableDownload');
    if (!downloadEnabled) {
        res.writeHead(403).end();
        return;
    }
    const match = matchFileRoute((_a = req.url) !== null && _a !== void 0 ? _a : '/');
    if (match === false) {
        res.writeHead(404).end();
        return;
    }
    const file = yield models_1.UserDataFiles.findOneById(match.params.fileID);
    if (!file) {
        res.writeHead(404).end();
        return;
    }
    if (!file.userId || !(yield isRequestFromOwner(req, file.userId))) {
        res.writeHead(403).end();
        return;
    }
    sendUserDataFile(file)(req, res, next);
});
webapp_1.WebApp.connectHandlers.use('/data-export/', userDataDownloadHandler);
