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
exports.startPatchRelease = startPatchRelease;
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const semver_1 = __importDefault(require("semver"));
const gitUtils_1 = require("./gitUtils");
const setupOctokit_1 = require("./setupOctokit");
const utils_1 = require("./utils");
function startPatchRelease(_a) {
    return __awaiter(this, arguments, void 0, function* ({ githubToken, baseRef, mainPackagePath, cwd = process.cwd(), }) {
        const octokit = (0, setupOctokit_1.setupOctokit)(githubToken);
        yield (0, gitUtils_1.checkoutBranch)(baseRef);
        // get version from main package
        const { version, name: mainPkgName } = yield (0, utils_1.readPackageJson)(mainPackagePath);
        const newVersion = semver_1.default.inc(version, 'patch');
        if (!newVersion) {
            throw new Error(`Could not increment version ${version}`);
        }
        const newBranch = `release-${newVersion}`;
        // TODO check if branch exists
        yield (0, gitUtils_1.createBranch)(newBranch);
        // by creating a changeset we make sure we'll always bump the version
        core.info('create a changeset for main package');
        yield (0, utils_1.createBumpFile)(cwd, mainPkgName);
        yield (0, gitUtils_1.commitChanges)(`Bump ${newVersion}`);
        yield (0, gitUtils_1.pushNewBranch)(newBranch);
        // create a pull request only if the patch is for current version
        if (baseRef === 'master') {
            const finalPrTitle = `Release ${newVersion}`;
            core.info('creating pull request');
            yield octokit.rest.pulls.create(Object.assign({ base: 'master', head: newBranch, title: finalPrTitle, body: '' }, github.context.repo));
        }
        else {
            core.info('no pull request created: patch is not for current version');
        }
    });
}
