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
const getGitHubInfo_1 = require("./getGitHubInfo");
const changelogFunctions = {
    getReleaseLine: (changeset, _type, options) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        if (!(options === null || options === void 0 ? void 0 : options.repo)) {
            throw new Error('Please provide a repo to this changelog generator like this:\n"changelog": ["@rocket.chat/release-changelog", { "repo": "org/repo" }]');
        }
        let prFromSummary;
        let commitFromSummary;
        const usersFromSummary = [];
        const replacedChangelog = changeset.summary
            .replace(/^\s*(?:pr|pull|pull\s+request):\s*#?(\d+)/im, (_, pr) => {
            const num = Number(pr);
            if (!isNaN(num))
                prFromSummary = num;
            return '';
        })
            .replace(/^\s*commit:\s*([^\s]+)/im, (_, commit) => {
            commitFromSummary = commit;
            return '';
        })
            .replace(/^\s*(?:author|user):\s*@?([^\s]+)/gim, (_, user) => {
            usersFromSummary.push(user);
            return '';
        })
            .trim();
        const [firstLine, ...futureLines] = replacedChangelog.split('\n').map((l) => l.trimEnd());
        const links = yield (() => __awaiter(void 0, void 0, void 0, function* () {
            const commitToFetchFrom = commitFromSummary || changeset.commit;
            if (!commitToFetchFrom) {
                return;
            }
            const { author, pull } = yield (0, getGitHubInfo_1.getCommitInfo)({
                repo: options.repo,
                commit: commitToFetchFrom,
                pr: prFromSummary,
            });
            return { pull, author };
        }))();
        const users = (() => {
            var _a;
            if (usersFromSummary.length) {
                return usersFromSummary.map((userFromSummary) => `[@${userFromSummary}](https://github.com/${userFromSummary})`).join(', ');
            }
            if (((_a = links === null || links === void 0 ? void 0 : links.author) === null || _a === void 0 ? void 0 : _a.association) === 'CONTRIBUTOR') {
                return `[@${links.author.login}](https://github.com/${links.author.login})`;
            }
        })();
        const prefix = [
            (links === null || links === void 0 ? void 0 : links.pull) ? `[#${(_a = links === null || links === void 0 ? void 0 : links.pull) === null || _a === void 0 ? void 0 : _a.number}](${(_b = links === null || links === void 0 ? void 0 : links.pull) === null || _b === void 0 ? void 0 : _b.url})` : '',
            // links.commit === null ? '' : links.commit,
            users ? `by ${users}` : '',
        ]
            .filter(Boolean)
            .join(' ');
        return `-${prefix ? ` (${prefix})` : ''} ${firstLine}\n${futureLines.map((l) => `  ${l}`).join('\n')}`;
    }),
    getDependencyReleaseLine: (changesets, dependenciesUpdated, options) => __awaiter(void 0, void 0, void 0, function* () {
        if (!options.repo) {
            throw new Error('Please provide a repo to this changelog generator like this:\n"changelog": ["@rocket.chat/release-changelog", { "repo": "org/repo" }]');
        }
        if (dependenciesUpdated.length === 0)
            return '';
        const commits = changesets
            .map((cs) => cs.commit)
            .filter((_) => _)
            .join(', ');
        const changesetLink = `- <details><summary>Updated dependencies [${commits}]:</summary>\n`;
        const updatedDepenenciesList = dependenciesUpdated.map((dependency) => `  - ${dependency.name}@${dependency.newVersion}`);
        return [changesetLink, ...updatedDepenenciesList, '  </details>'].join('\n');
    }),
};
exports.default = changelogFunctions;
