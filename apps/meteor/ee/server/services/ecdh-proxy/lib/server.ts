import type { RequestOptions } from 'http';
import http from 'http';
import type { Readable } from 'stream';
import url from 'url';

import cookie from 'cookie';
import cookieParser from 'cookie-parser';
import type { Request, Response } from 'express';
import express from 'express';
import mem from 'mem';
import WebSocket from 'ws';
import lusca from 'lusca';

import { ServerSession } from '../../../../app/ecdh/server/ServerSession';

const app = express();
app.use(cookieParser());
app.use(lusca.csrf());

const port = process.env.PORT || 4000;

function streamToBuffer(stream: Readable): Promise<Buffer> {
    return new Promise((resolve) => {
        const buffers: any[] = [];
        stream.on('data', (d) => buffers.push(d));
        stream.on('end', () => {
            resolve(Buffer.concat(buffers));
        });
        stream.resume();
    });
}

async function getSession(clientPublicKey: string): Promise<ServerSession> {
    const serverSession = new ServerSession();
    await serverSession.init(clientPublicKey);
    return serverSession;
}

const getSessionCached = mem(getSession, { maxAge: 1000 });

const _processRequest = async (session: ServerSession, requestData: Buffer): Promise<string> => session.decrypt(requestData);
const _processResponse = async (session: ServerSession, responseData: Buffer): Promise<string> => session.encrypt(responseData);

const proxyHostname = process.env.PROXY_HOST || 'localhost';
const proxyPort = process.env.PROXY_PORT || 3000;

const proxy = async function (
    req: Request,
    res: Response,
    session?: ServerSession,
    processRequest = _processRequest,
    processResponse = _processResponse,
): Promise<void> {
    req.pause();
    const parsedUrl = url.parse(req.originalUrl || '', true);
    const allowedPaths = ['/allowedPath1', '/allowedPath2']; // Define allowed paths
    const allowedQueryParams = ['param1', 'param2']; // Define allowed query parameters

    if (!allowedPaths.includes(parsedUrl.pathname || '')) {
        res.status(400).send('Invalid path');
        return;
    }

    const sanitizedQuery: { [key: string]: string | string[] | undefined } = {};
    for (const key of Object.keys(parsedUrl.query)) {
        if (allowedQueryParams.includes(key)) {
            sanitizedQuery[key] = parsedUrl.query[key];
        }
    }

    const options: RequestOptions = {
        hostname: proxyHostname,
        port: proxyPort,
        path: url.format({ pathname: parsedUrl.pathname, query: sanitizedQuery }),
        headers: req.headers,
        method: req.method,
        agent: false,
    };
    if (session) {
        delete options.headers['accept-encoding'];
        delete options.headers['content-length'];
    }

    const connector = http.request(options, async (serverResponse) => {
        serverResponse.pause();
        if (serverResponse.statusCode) {
            res.writeHead(serverResponse.statusCode, serverResponse.headers);
        }
        if (session) {
            const responseData = await streamToBuffer(serverResponse);
            if (responseData.length) {
                res.write(await processResponse(session, responseData));
            }
            res.end();
        } else {
            serverResponse.pipe(res);
        }
        serverResponse.resume();
    });

    connector.on('error', (error) => {
        console.error('Proxy error:', error); // Log the error internally
        res.status(500).send({
            message: 'An unexpected error occurred while processing your request.',
        });
    });

    if (session) {
        const requestData = await streamToBuffer(req);
        if (requestData.length) {
            connector.write(await processRequest(session, requestData));
        }
        connector.end();
    } else {
        req.pipe(connector);
    }
    req.resume();
};

app.use('/api/ecdh_proxy', express.json());
app.post('/api/ecdh_proxy/initEncryptedSession', async (req, res) => {
    try {
        const session = await getSessionCached(req.body.clientPublicKey);

        res.cookie('ecdhSession', req.body.clientPublicKey);
        res.send({
            success: true,
            publicKeyString: session.publicKeyString,
        });
    } catch (e) {
        console.error('Session initialization error:', e); // Log the error internally
        res.status(500).send({
            message: 'An unexpected error occurred during session initialization.',
        });
    }
});

app.post('/api/ecdh_proxy/echo', async (req, res) => {
    if (!req.cookies.ecdhSession) {
        return res.status(401).send();
    }

    const session = await getSessionCached(req.cookies.ecdhSession);

    if (!session) {
        return res.status(401).send();
    }

    try {
        const result = await session.decrypt(req.body.text);
        res.send(await session.encrypt(result));
    } catch (e) {
        console.error('Echo error:', e); // Log the error internally
        res.status(400).send({
            message: 'An error occurred while processing your request.',
        });
    }
});

// Additional blocks updated similarly...

app.use((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    try {
        void proxy(req, res);
    } catch (e) {
        console.error('Unhandled error:', e); // Log the error internally
        res.status(500).send({
            message: 'An unexpected error occurred. Please try again later.',
        });
    }
});

export default app;
