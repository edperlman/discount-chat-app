"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addServerUrlToIndex = void 0;
const addServerUrlToIndex = (file) => {
    const rootUrl = global.__meteor_runtime_config__.ROOT_URL.replace(/\/$/, '');
    return file.replace('<body>', `<body><script> SERVER_URL = '${rootUrl}'; </script>`);
};
exports.addServerUrlToIndex = addServerUrlToIndex;
