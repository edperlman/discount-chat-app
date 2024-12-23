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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMongoVersion = getMongoVersion;
exports.getNodeNpmVersions = getNodeNpmVersions;
exports.getAppsEngineVersion = getAppsEngineVersion;
const promises_1 = require("fs/promises");
const path_1 = __importDefault(require("path"));
const utils_1 = require("./utils");
function getMongoVersion(cwd) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const workflows = yield (0, promises_1.readFile)(path_1.default.join(cwd, '.github/workflows/ci.yml'), 'utf8');
            const mongoMatch = workflows.match(/compatibleMongoVersions\\": \[([^\]]+)\]/);
            if (!mongoMatch) {
                return [];
            }
            return mongoMatch[1].replace(/["'\\ ]/g, '').split(',');
        }
        catch (e) {
            console.error(e);
        }
        return [];
    });
}
function getNodeNpmVersions(cwd) {
    return __awaiter(this, void 0, void 0, function* () {
        const packageJson = yield (0, utils_1.readPackageJson)(cwd);
        return packageJson.engines;
    });
}
function getAppsEngineVersion(cwd) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const result = yield (0, utils_1.readPackageJson)(path_1.default.join(cwd, 'packages/apps-engine'));
            return (_a = result.version) !== null && _a !== void 0 ? _a : 'Not Available';
        }
        catch (e) {
            console.error(e);
        }
    });
}
