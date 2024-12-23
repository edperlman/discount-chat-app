"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const ufs_1 = require("../../../server/ufs");
// set ufs temp dir to $TMPDIR/ufs instead of /tmp/ufs if the variable is set
if ('TMPDIR' in process.env) {
    ufs_1.UploadFS.config.tmpDir = path_1.default.join(process.env.TMPDIR || '', 'ufs');
}
