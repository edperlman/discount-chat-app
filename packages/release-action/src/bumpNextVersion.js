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
exports.bumpNextVersion = bumpNextVersion;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const core = __importStar(require("@actions/core"));
const exec_1 = require("@actions/exec");
const github = __importStar(require("@actions/github"));
const createNpmFile_1 = require("./createNpmFile");
const fixWorkspaceVersionsBeforePublish_1 = require("./fixWorkspaceVersionsBeforePublish");
const gitUtils_1 = require("./gitUtils");
const setupOctokit_1 = require("./setupOctokit");
const utils_1 = require("./utils");
function bumpNextVersion(_a) {
    return __awaiter(this, arguments, void 0, function* ({ githubToken, mainPackagePath, cwd = process.cwd(), }) {
        const octokit = (0, setupOctokit_1.setupOctokit)(githubToken);
        // TODO do this only if publishing to npm
        yield (0, createNpmFile_1.createNpmFile)();
        // TODO need to check if there is any change to 'main package', if not, there is no need to enter rc
        // and instead a normal release of the other packages should be done
        const { version: currentVersion } = yield (0, utils_1.readPackageJson)(cwd);
        // start release candidate
        yield (0, exec_1.exec)('yarn', ['changeset', 'pre', 'enter', 'rc']);
        // bump version of all packages to rc
        yield (0, exec_1.exec)('yarn', ['changeset', 'version']);
        // get version from main package
        const { version: newVersion } = yield (0, utils_1.readPackageJson)(mainPackagePath);
        const mainPackageChangelog = path_1.default.join(mainPackagePath, 'CHANGELOG.md');
        const changelogContents = fs_1.default.readFileSync(mainPackageChangelog, 'utf8');
        const changelogEntry = (0, utils_1.getChangelogEntry)(changelogContents, newVersion);
        if (!changelogEntry) {
            // we can find a changelog but not the entry for this version
            // if this is true, something has probably gone wrong
            throw new Error('Could not find changelog entry for version newVersion');
        }
        const prBody = (yield (0, utils_1.getEngineVersionsMd)(cwd)) + changelogEntry.content;
        const finalVersion = newVersion.split('-')[0];
        const newBranch = `release-${finalVersion}`;
        // update root package.json
        core.info('update version in all files to new');
        yield (0, utils_1.bumpFileVersions)(cwd, currentVersion, newVersion);
        // TODO check if branch exists
        yield (0, gitUtils_1.createBranch)(newBranch);
        yield (0, gitUtils_1.commitChanges)(`Release ${newVersion}`);
        core.info('fix dependencies in workspace packages');
        yield (0, fixWorkspaceVersionsBeforePublish_1.fixWorkspaceVersionsBeforePublish)();
        yield (0, exec_1.exec)('yarn', ['changeset', 'publish', '--no-git-tag']);
        yield (0, gitUtils_1.createTag)(newVersion);
        yield (0, gitUtils_1.pushNewBranch)(newBranch, true);
        if (newVersion.includes('rc.0')) {
            const finalPrTitle = `Release ${finalVersion}`;
            core.info('creating pull request');
            yield octokit.rest.pulls.create(Object.assign({ base: 'master', head: newBranch, title: finalPrTitle, body: (0, utils_1.createTempReleaseNotes)(finalVersion, prBody) }, github.context.repo));
        }
        else {
            core.info('no pull request created: release is not the first candidate');
        }
        core.info('create release');
        yield octokit.rest.repos.createRelease(Object.assign({ name: newVersion, tag_name: newVersion, body: prBody, prerelease: newVersion.includes('-') }, github.context.repo));
    });
}
