"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webapp_1 = require("meteor/webapp");
webapp_1.WebApp.connectHandlers.use('/file-decrypt/', (_, res) => {
    // returns 404
    res.writeHead(404);
    res.end('Not found');
});
