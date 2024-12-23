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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const url_1 = __importDefault(require("url"));
const cookie_1 = __importDefault(require("cookie"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const mem_1 = __importDefault(require("mem"));
const ws_1 = __importDefault(require("ws"));
const lusca_1 = __importDefault(require("lusca"));
const ServerSession_1 = require("../../../../app/ecdh/server/ServerSession");
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use(lusca_1.default.csrf());
const port = process.env.PORT || 4000;
function streamToBuffer(stream) {
    return new Promise((resolve) => {
        const buffers = [];
        stream.on('data', (d) => buffers.push(d));
        stream.on('end', () => {
            resolve(Buffer.concat(buffers));
        });
        stream.resume();
    });
}
function getSession(clientPublicKey) {
    return __awaiter(this, void 0, void 0, function* () {
        const serverSession = new ServerSession_1.ServerSession();
        yield serverSession.init(clientPublicKey);
        return serverSession;
    });
}
const getSessionCached = (0, mem_1.default)(getSession, { maxAge: 1000 });
const _processRequest = (session, requestData) => __awaiter(void 0, void 0, void 0, function* () { return session.decrypt(requestData); });
const _processResponse = (session, responseData) => __awaiter(void 0, void 0, void 0, function* () { return session.encrypt(responseData); });
const proxyHostname = process.env.PROXY_HOST || 'localhost';
const proxyPort = process.env.PROXY_PORT || 3000;
const proxy = function (req_1, res_1, session_1) {
    return __awaiter(this, arguments, void 0, function* (req, res, session, processRequest = _processRequest, processResponse = _processResponse) {
        req.pause();
        const parsedUrl = url_1.default.parse(req.originalUrl || '', true);
        const allowedPaths = ['/allowedPath1', '/allowedPath2']; // Define allowed paths
        const allowedQueryParams = ['param1', 'param2']; // Define allowed query parameters
        if (!allowedPaths.includes(parsedUrl.pathname || '')) {
            res.status(400).send('Invalid path');
            return;
        }
        const sanitizedQuery = {};
        for (const key of Object.keys(parsedUrl.query)) {
            if (allowedQueryParams.includes(key)) {
                sanitizedQuery[key] = parsedUrl.query[key];
            }
        }
        const options = {
            hostname: proxyHostname,
            port: proxyPort,
            path: url_1.default.format({ pathname: parsedUrl.pathname, query: sanitizedQuery }),
            headers: req.headers,
            method: req.method,
            agent: false,
        };
        if (session) {
            // Required to not receive gzipped data
            delete options.headers['accept-encoding'];
            // Required since we don't know the new length
            delete options.headers['content-length'];
        }
        const connector = http_1.default.request(options, (serverResponse) => __awaiter(this, void 0, void 0, function* () {
            serverResponse.pause();
            if (serverResponse.statusCode) {
                res.writeHead(serverResponse.statusCode, serverResponse.headers);
            }
            if (session) {
                const responseData = yield streamToBuffer(serverResponse);
                if (responseData.length) {
                    res.write(yield processResponse(session, responseData));
                }
                res.end();
                // session.encryptStream(serverResponse, processInput, processOutput).pipe(res);
            }
            else {
                serverResponse.pipe(res);
            }
            serverResponse.resume();
        }));
        connector.on('error', (error) => console.error(error));
        if (session) {
            const requestData = yield streamToBuffer(req);
            if (requestData.length) {
                connector.write(yield processRequest(session, requestData));
            }
            connector.end();
        }
        else {
            req.pipe(connector);
        }
        req.resume();
    });
};
app.use('/api/ecdh_proxy', express_1.default.json());
app.post('/api/ecdh_proxy/initEncryptedSession', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const session = yield getSessionCached(req.body.clientPublicKey);
        res.cookie('ecdhSession', req.body.clientPublicKey);
        res.send({
            success: true,
            publicKeyString: session.publicKeyString,
        });
    }
    catch (e) {
        res.status(400).send(e instanceof Error ? e.message : String(e));
    }
}));
app.post('/api/ecdh_proxy/echo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.cookies.ecdhSession) {
        return res.status(401).send();
    }
    const session = yield getSessionCached(req.cookies.ecdhSession);
    if (!session) {
        return res.status(401).send();
    }
    try {
        const result = yield session.decrypt(req.body.text);
        res.send(yield session.encrypt(result));
    }
    catch (e) {
        console.error(e);
        res.status(400).send(e instanceof Error ? e.message : String(e));
    }
}));
const httpServer = app.listen(port, () => {
    console.log(`Proxy listening at http://localhost:${port}`);
});
const wss = new ws_1.default.Server({ server: httpServer });
wss.on('error', (error) => {
    console.error(error);
});
wss.on('connection', (ws, req) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.url) {
        return;
    }
    const cookies = cookie_1.default.parse(req.headers.cookie || '');
    if (!cookies.ecdhSession) {
        ws.close();
        return;
    }
    const session = yield getSessionCached(cookies.ecdhSession);
    const proxy = new ws_1.default(`ws://${proxyHostname}:${proxyPort}${req.url}` /* , { agent: req.agent } */);
    ws.on('message', (data) => __awaiter(void 0, void 0, void 0, function* () {
        const decrypted = JSON.stringify([yield session.decrypt(data.replace('["', '').replace('"]', ''))]);
        proxy.send(decrypted);
    }));
    proxy.on('message', (data) => __awaiter(void 0, void 0, void 0, function* () {
        ws.send(yield session.encrypt(data.toString()));
    }));
    proxy.on('error', (error) => {
        console.error(error);
    });
    ws.on('error', (error) => {
        console.error(error);
    });
    ws.on('close', (code, reason) => {
        try {
            proxy.close(code, reason);
        }
        catch (e) {
            //
        }
    });
    // proxy.on('close', (code, reason) => ws.close(code, reason));
}));
app.use('/api/*', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const session = yield getSessionCached(req.cookies.ecdhSession);
    if (!session) {
        return res.status(401).send();
    }
    try {
        void proxy(req, res, session);
    }
    catch (e) {
        res.status(400).send(e instanceof Error ? e.message : String(e));
    }
}));
const xhrDataRequestProcess = (session, requestData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    const data = JSON.parse(requestData.toString());
    try {
        for (var _d = true, _e = __asyncValues(data.entries()), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
            _c = _f.value;
            _d = false;
            const [index, item] = _c;
            data[index] = yield session.decrypt(item);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return JSON.stringify(data);
});
const xhrDataResponseProcess = (session, responseData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_2, _b, _c;
    const data = responseData.toString().replace(/\n$/, '').split('\n');
    try {
        for (var _d = true, _e = __asyncValues(data.entries()), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
            _c = _f.value;
            _d = false;
            const [index, item] = _c;
            data[index] = yield session.encrypt(item);
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return `${data.join('\n')}\n`;
});
app.use('/sockjs/:id1/:id2/xhr_send', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const session = yield getSessionCached(req.cookies.ecdhSession);
    if (!session) {
        return res.status(401).send();
    }
    try {
        void proxy(req, res, session, xhrDataRequestProcess, xhrDataResponseProcess);
    }
    catch (e) {
        res.status(400).send(e instanceof Error ? e.message : String(e));
    }
}));
app.use('/sockjs/:id1/:id2/xhr', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const session = yield getSessionCached(req.cookies.ecdhSession);
    if (!session) {
        return res.status(401).send();
    }
    try {
        void proxy(req, res, session, undefined, xhrDataResponseProcess);
    }
    catch (e) {
        res.status(400).send(e instanceof Error ? e.message : String(e));
    }
}));
app.use((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    void proxy(req, res);
});
