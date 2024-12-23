"use strict";
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RC_EXTRA_SERVER = exports.RC_SERVER_2 = exports.RC_SERVER_1 = void 0;
exports.RC_SERVER_1 = {
    url: (_a = process.env.RC_SERVER_1) !== null && _a !== void 0 ? _a : 'http://localhost:3000',
    username: (_b = process.env.RC_SERVER_1_ADMIN_USER) !== null && _b !== void 0 ? _b : '',
    password: (_c = process.env.RC_SERVER_1_ADMIN_PASSWORD) !== null && _c !== void 0 ? _c : '',
    matrixServerName: (_d = process.env.RC_SERVER_1_MATRIX_SERVER_NAME) !== null && _d !== void 0 ? _d : '',
};
exports.RC_SERVER_2 = {
    url: (_e = process.env.RC_SERVER_2) !== null && _e !== void 0 ? _e : 'http://localhost:3000',
    username: (_f = process.env.RC_SERVER_2_ADMIN_USER) !== null && _f !== void 0 ? _f : '',
    password: (_g = process.env.RC_SERVER_2_ADMIN_PASSWORD) !== null && _g !== void 0 ? _g : '',
    matrixServerName: (_h = process.env.RC_SERVER_2_MATRIX_SERVER_NAME) !== null && _h !== void 0 ? _h : '',
};
exports.RC_EXTRA_SERVER = {
    url: (_j = process.env.RC_EXTRA_SERVER) !== null && _j !== void 0 ? _j : 'http://localhost:3000',
    username: (_k = process.env.RC_EXTRA_SERVER_ADMIN_USER) !== null && _k !== void 0 ? _k : '',
    password: (_l = process.env.RC_EXTRA_SERVER_ADMIN_PASSWORD) !== null && _l !== void 0 ? _l : '',
    matrixServerName: (_m = process.env.RC_EXTRA_SERVER_MATRIX_SERVER_NAME) !== null && _m !== void 0 ? _m : '',
};
