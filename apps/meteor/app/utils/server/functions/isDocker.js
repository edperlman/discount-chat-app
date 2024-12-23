"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDocker = void 0;
const fs_1 = __importDefault(require("fs"));
function hasDockerEnv() {
    try {
        fs_1.default.statSync('/.dockerenv');
        return true;
    }
    catch (err) {
        return false;
    }
}
function hasDockerCGroup() {
    try {
        return fs_1.default.readFileSync('/proc/self/cgroup', 'utf8').indexOf('docker') !== -1;
    }
    catch (err) {
        return false;
    }
}
function check() {
    return hasDockerEnv() || hasDockerCGroup();
}
let _isDocker;
const isDocker = function () {
    if (_isDocker === undefined) {
        _isDocker = check();
    }
    return _isDocker;
};
exports.isDocker = isDocker;
