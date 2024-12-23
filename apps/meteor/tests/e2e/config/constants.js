"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_USER_CREDENTIALS = exports.ADMIN_CREDENTIALS = exports.URL_MONGODB = exports.IS_EE = exports.IS_LOCALHOST = exports.BASE_API_URL = exports.API_PREFIX = exports.BASE_URL = void 0;
exports.BASE_URL = (_a = process.env.BASE_URL) !== null && _a !== void 0 ? _a : 'http://localhost:3000';
exports.API_PREFIX = '/api/v1';
exports.BASE_API_URL = exports.BASE_URL + exports.API_PREFIX;
exports.IS_LOCALHOST = exports.BASE_URL.startsWith('http://localhost');
exports.IS_EE = process.env.IS_EE ? !!JSON.parse(process.env.IS_EE) : false;
exports.URL_MONGODB = process.env.MONGO_URL || 'mongodb://localhost:3001/meteor?retryWrites=false';
exports.ADMIN_CREDENTIALS = {
    email: 'rocketchat.internal.admin.test@rocket.chat',
    password: 'rocketchat.internal.admin.test',
    username: 'rocketchat.internal.admin.test',
};
exports.DEFAULT_USER_CREDENTIALS = {
    password: 'password',
    bcrypt: '$2b$10$LNYaqDreDE7tt9EVEeaS9uw.C3hic9hcqFfIocMBPTMxJaDCC6QWW',
};
