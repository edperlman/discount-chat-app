"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const core = __importStar(require("@actions/core"));
const bumpNextVersion_1 = require("./bumpNextVersion");
const gitUtils_1 = require("./gitUtils");
const publishRelease_1 = require("./publishRelease");
const startPatchRelease_1 = require("./startPatchRelease");
const updatePRDescription_1 = require("./updatePRDescription");
// const getOptionalInput = (name: string) => core.getInput(name) || undefined;
(() => __awaiter(void 0, void 0, void 0, function* () {
    const githubToken = process.env.GITHUB_TOKEN;
    if (!githubToken) {
        core.setFailed('Please add the GITHUB_TOKEN to the changesets action');
        return;
    }
    // const inputCwd = core.getInput('cwd');
    // if (inputCwd) {
    // 	core.info('changing directory to the one given as the input');
    // 	process.chdir(inputCwd);
    // }
    core.info('setting git user');
    yield (0, gitUtils_1.setupGitUser)();
    core.info('setting GitHub credentials');
    fs_1.default.writeFileSync(`${process.env.HOME}/.netrc`, `machine github.com\nlogin github-actions[bot]\npassword ${githubToken}`);
    const action = core.getInput('action');
    const baseRef = core.getInput('base-ref');
    const cwd = process.cwd();
    // TODO this could be configurable
    const mainPackagePath = path_1.default.join(cwd, 'apps', 'meteor');
    if (action === 'publish-final') {
        yield (0, publishRelease_1.publishRelease)({ githubToken, mergeFinal: true, mainPackagePath });
    }
    else if (action === 'cut') {
        yield (0, publishRelease_1.publishRelease)({ githubToken, baseRef, mainPackagePath });
    }
    else if (action === 'next') {
        yield (0, bumpNextVersion_1.bumpNextVersion)({ githubToken, mainPackagePath });
    }
    else if (action === 'patch') {
        yield (0, startPatchRelease_1.startPatchRelease)({ baseRef, githubToken, mainPackagePath });
    }
    else if (action === 'update-pr-description') {
        yield (0, updatePRDescription_1.updatePRDescription)({ githubToken, mainPackagePath });
    }
}))().catch((err) => {
    core.error(err);
    core.setFailed(err.message);
});
