"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
class Config {
    constructor(options = {}) {
        // Default options
        options = Object.assign({ https: false, simulateUploadSpeed: 0, storesPath: 'ufs', tmpDir: '/tmp/ufs', tmpDirPermissions: '0700' }, options);
        // Check options
        if (typeof options.https !== 'boolean') {
            throw new TypeError('Config: https is not a function');
        }
        if (typeof options.simulateUploadSpeed !== 'number') {
            throw new TypeError('Config: simulateUploadSpeed is not a number');
        }
        if (typeof options.storesPath !== 'string') {
            throw new TypeError('Config: storesPath is not a string');
        }
        if (typeof options.tmpDir !== 'string') {
            throw new TypeError('Config: tmpDir is not a string');
        }
        if (typeof options.tmpDirPermissions !== 'string') {
            throw new TypeError('Config: tmpDirPermissions is not a string');
        }
        this.https = options.https;
        this.simulateUploadSpeed = options.simulateUploadSpeed;
        this.storesPath = options.storesPath;
        this.tmpDir = options.tmpDir;
        this.tmpDirPermissions = options.tmpDirPermissions;
    }
}
exports.Config = Config;
