"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactiveVar = exports.Tracker = exports.Accounts = exports.Mongo = exports.Meteor = void 0;
const globals_1 = require("@jest/globals");
exports.Meteor = {
    loginWithSamlToken: globals_1.jest.fn((_token, callback) => callback()),
    connection: {
        _stream: { on: globals_1.jest.fn() },
    },
    _localStorage: {
        getItem: globals_1.jest.fn(),
        setItem: globals_1.jest.fn(),
    },
    users: {},
    userId: () => 'uid',
};
exports.Mongo = {
    Collection: class Collection {
        constructor() {
            this.findOne = globals_1.jest.fn();
            this.update = globals_1.jest.fn();
        }
    },
};
exports.Accounts = {
    onLogin: globals_1.jest.fn(),
    onLogout: globals_1.jest.fn(),
};
exports.Tracker = { autorun: globals_1.jest.fn() };
const ReactiveVar = class ReactiveVar {
};
exports.ReactiveVar = ReactiveVar;
