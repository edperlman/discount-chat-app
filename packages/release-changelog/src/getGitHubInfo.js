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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommitInfo = getCommitInfo;
const dataloader_1 = __importDefault(require("dataloader"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const validRepoNameRegex = /^[\w.-]+\/[\w.-]+$/;
function makeQuery(repos) {
    return `
			query {
				${Object.keys(repos)
        .map((repo, i) => `a${i}: repository(
						owner: ${JSON.stringify(repo.split('/')[0])}
						name: ${JSON.stringify(repo.split('/')[1])}
					) {
						${repos[repo]
        .map((data) => data.kind === 'commit'
        ? `a${data.commit}: object(expression: ${JSON.stringify(data.commit)}) {
						... on Commit {
						commitUrl
						message
						associatedPullRequests(first: 50) {
							nodes {
								number
								url
								mergedAt
								authorAssociation
								author {
									login
									url
								}
							}
						}
						author {
							user {
								login
								url
							}
						}
					}}`
        : `pr__${data.pull}: pullRequest(number: ${data.pull}) {
										url
										authorAssociation
										author {
											login
											url
										}
										mergeCommit {
											commitUrl
											abbreviatedOid
										}
									}`)
        .join('\n')}
					}`)
        .join('\n')}
				}
		`;
}
// why are we using dataloader?
// it provides use with two things
// 1. caching
// since getInfo will be called inside of changeset's getReleaseLine
// and there could be a lot of release lines for a single commit
// caching is important so we don't do a bunch of requests for the same commit
// 2. batching
// getReleaseLine will be called a large number of times but it'll be called at the same time
// so instead of doing a bunch of network requests, we can do a single one.
const GHDataLoader = new dataloader_1.default((requests) => __awaiter(void 0, void 0, void 0, function* () {
    if (!process.env.GITHUB_TOKEN) {
        throw new Error('Please create a GitHub personal access token at https://github.com/settings/tokens/new with `read:user` and `repo:status` permissions and add it as the GITHUB_TOKEN environment variable');
    }
    const repos = {};
    requests.forEach((_a) => {
        var { repo } = _a, data = __rest(_a, ["repo"]);
        if (repos[repo] === undefined) {
            repos[repo] = [];
        }
        repos[repo].push(data);
    });
    const data = yield (0, node_fetch_1.default)('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
            Authorization: `Token ${process.env.GITHUB_TOKEN}`,
        },
        body: JSON.stringify({ query: makeQuery(repos) }),
    }).then((x) => x.json());
    if (data.errors) {
        throw new Error(`An error occurred when fetching data from GitHub\n${JSON.stringify(data.errors, null, 2)}`);
    }
    // this is mainly for the case where there's an authentication problem
    if (!data.data) {
        throw new Error(`An error occurred when fetching data from GitHub\n${JSON.stringify(data)}`);
    }
    const cleanedData = {};
    Object.keys(repos).forEach((repo, index) => {
        const output = {
            commit: {},
            pull: {},
        };
        cleanedData[repo] = output;
        Object.entries(data.data[`a${index}`]).forEach(([field, value]) => {
            // this is "a" because that's how it was when it was first written, "a" means it's a commit not a pr
            // we could change it to commit__ but then we have to get new GraphQL results from the GH API to put in the tests
            if (field[0] === 'a') {
                output.commit[field.substring(1)] = value;
            }
            else {
                output.pull[field.replace('pr__', '')] = value;
            }
        });
    });
    return requests.map((_a) => {
        var { repo } = _a, data = __rest(_a, ["repo"]);
        return cleanedData[repo][data.kind][data.kind === 'pull' ? data.pull : data.commit];
    });
}), {
    maxBatchSize: 80,
});
function getCommitInfo(request) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!request.commit) {
            throw new Error('Please pass a commit SHA to getInfo');
        }
        if (!request.repo) {
            throw new Error('Please pass a GitHub repository in the form of userOrOrg/repoName to getInfo');
        }
        if (!validRepoNameRegex.test(request.repo)) {
            throw new Error(`Please pass a valid GitHub repository in the form of userOrOrg/repoName to getInfo (it has to match the "${validRepoNameRegex.source}" pattern)`);
        }
        const data = yield GHDataLoader.load(Object.assign({ kind: 'commit' }, request));
        const prMatch = data.message.match(/\(#(\d+)\)$/m);
        if (!prMatch && !request.pr) {
            return {
                author: { login: data.author.login, url: data.author.url, association: 'MEMBER' },
            };
        }
        const pr = request.pr || Number(prMatch[1]);
        const pullRequest = yield GHDataLoader.load({ kind: 'pull', pull: pr, repo: request.repo });
        return {
            pull: {
                number: pr,
                url: pullRequest.url,
            },
            author: {
                login: pullRequest.author.login,
                url: pullRequest.author.url,
                association: pullRequest.authorAssociation,
            },
        };
    });
}
