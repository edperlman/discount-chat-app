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
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupGitUser = setupGitUser;
exports.createBranch = createBranch;
exports.checkoutBranch = checkoutBranch;
exports.mergeBranch = mergeBranch;
exports.commitChanges = commitChanges;
exports.createTag = createTag;
exports.getCurrentBranch = getCurrentBranch;
exports.pushChanges = pushChanges;
exports.pushNewBranch = pushNewBranch;
const exec_1 = require("@actions/exec");
function setupGitUser() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, exec_1.exec)('git', ['config', 'user.name', '"rocketchat-github-ci"']);
        yield (0, exec_1.exec)('git', ['config', 'user.email', '"buildmaster@rocket.chat"']);
    });
}
function createBranch(newBranch) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, exec_1.exec)('git', ['checkout', '-b', newBranch]);
    });
}
function checkoutBranch(branchName) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, exec_1.exec)('git', ['checkout', branchName]);
    });
}
function mergeBranch(branchName) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, exec_1.exec)('git', ['merge', '--no-edit', branchName]);
    });
}
function commitChanges(commitMessage) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, exec_1.exec)('git', ['add', '.']);
        yield (0, exec_1.exec)('git', ['commit', '-m', commitMessage]);
    });
}
function createTag(version) {
    return __awaiter(this, void 0, void 0, function* () {
        // create an annotated tag so git push --follow-tags will push the tag
        yield (0, exec_1.exec)('git', ['tag', version, '-m', version]);
    });
}
function getCurrentBranch() {
    return __awaiter(this, void 0, void 0, function* () {
        const { stdout: branchName } = yield (0, exec_1.getExecOutput)('git', ['rev-parse', '--abbrev-ref', 'HEAD']);
        return branchName.trim();
    });
}
function pushChanges() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, exec_1.exec)('git', ['push', '--follow-tags']);
    });
}
function pushNewBranch(newBranch_1) {
    return __awaiter(this, arguments, void 0, function* (newBranch, force = false) {
        const params = ['push'];
        if (force) {
            params.push('--force');
        }
        params.push('--follow-tags');
        params.push('origin');
        params.push(`HEAD:refs/heads/${newBranch}`);
        yield (0, exec_1.exec)('git', params);
    });
}
