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
const node_url_1 = require("node:url");
const webapp_1 = require("meteor/webapp");
const server_1 = require("../../../../../app/settings/server");
function returnMatrixServerJSON(_, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!server_1.settings.get('Federation_Matrix_enabled') || !server_1.settings.get('Federation_Matrix_serve_well_known')) {
            return res.writeHead(404).end();
        }
        const homeserverUrl = server_1.settings.get('Federation_Matrix_homeserver_url');
        const { hostname, port = '443' } = new node_url_1.URL(homeserverUrl); // a case where port isn't specified would be if it's 80 or 443, if 80, federation isn't going to work, so we simply assume 443.
        res.setHeader('content-type', 'application/json');
        res.write(JSON.stringify({ 'm.server': `${hostname}:${port || '443'}` }));
        res.end();
    });
}
function returnMatrixClientJSON(_, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!server_1.settings.get('Federation_Matrix_enabled') || !server_1.settings.get('Federation_Matrix_serve_well_known')) {
            return res.writeHead(404).end();
        }
        const homeserverUrl = server_1.settings.get('Federation_Matrix_homeserver_url');
        const { protocol = 'https:', hostname } = new node_url_1.URL(homeserverUrl);
        res.setHeader('content-type', 'application/json');
        res.write(JSON.stringify({ 'm.homeserver': { base_url: `${protocol}//${hostname}` } }));
        res.end();
    });
}
webapp_1.WebApp.connectHandlers.use('/.well-known/matrix/server', returnMatrixServerJSON);
webapp_1.WebApp.connectHandlers.use('/.well-known/matrix/client', returnMatrixClientJSON);
