"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = require("node:path");
const server_1 = __importDefault(require("@rocket.chat/jest-presets/server"));
exports.default = {
    preset: server_1.default.preset,
    transform: {
        '\\.pegjs$': (0, node_path_1.resolve)(__dirname, './loaders/pegtransform.js'),
    },
    moduleFileExtensions: ['js', 'ts', 'pegjs'],
};