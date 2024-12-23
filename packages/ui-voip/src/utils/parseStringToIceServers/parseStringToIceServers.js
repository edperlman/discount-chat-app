"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseStringToIceServers = exports.parseStringToIceServer = void 0;
const parseStringToIceServer = (server) => {
    const credentials = server.trim().split('@');
    const urls = credentials.pop();
    const [username, credential] = credentials.length === 1 ? credentials[0].split(':') : [];
    return Object.assign({ urls }, (username &&
        credential && {
        username: decodeURIComponent(username),
        credential: decodeURIComponent(credential),
    }));
};
exports.parseStringToIceServer = parseStringToIceServer;
const parseStringToIceServers = (string) => {
    const lines = string.trim() ? string.split(',') : [];
    return lines.map((line) => (0, exports.parseStringToIceServer)(line));
};
exports.parseStringToIceServers = parseStringToIceServers;
