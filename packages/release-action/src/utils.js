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
exports.BumpLevels = void 0;
exports.getChangelogEntry = getChangelogEntry;
exports.readPackageJson = readPackageJson;
exports.bumpFileVersions = bumpFileVersions;
exports.createBumpFile = createBumpFile;
exports.getEngineVersionsMd = getEngineVersionsMd;
exports.isPreRelease = isPreRelease;
exports.createTempReleaseNotes = createTempReleaseNotes;
const fs_1 = __importDefault(require("fs"));
const promises_1 = require("fs/promises");
const path_1 = __importDefault(require("path"));
const mdast_util_to_string_1 = __importDefault(require("mdast-util-to-string"));
const remark_parse_1 = __importDefault(require("remark-parse"));
const remark_stringify_1 = __importDefault(require("remark-stringify"));
const unified_1 = __importDefault(require("unified"));
const getMetadata_1 = require("./getMetadata");
exports.BumpLevels = {
    dep: 0,
    patch: 1,
    minor: 2,
    major: 3,
};
function getChangelogEntry(changelog, version) {
    const ast = (0, unified_1.default)().use(remark_parse_1.default).parse(changelog);
    let highestLevel = exports.BumpLevels.dep;
    const nodes = ast.children;
    let headingStartInfo;
    let endIndex;
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node.type === 'heading') {
            const stringified = (0, mdast_util_to_string_1.default)(node);
            const match = stringified.toLowerCase().match(/(major|minor|patch)/);
            if (match !== null) {
                const level = exports.BumpLevels[match[0]];
                highestLevel = Math.max(level, highestLevel);
            }
            if (headingStartInfo === undefined && stringified === version) {
                headingStartInfo = {
                    index: i,
                    depth: node.depth,
                };
                continue;
            }
            if (endIndex === undefined && headingStartInfo !== undefined && headingStartInfo.depth === node.depth) {
                endIndex = i;
                break;
            }
        }
    }
    if (headingStartInfo) {
        ast.children = ast.children.slice(headingStartInfo.index + 1, endIndex);
    }
    return {
        content: (0, unified_1.default)().use(remark_stringify_1.default).stringify(ast),
        highestLevel,
    };
}
function readPackageJson(cwd) {
    return __awaiter(this, void 0, void 0, function* () {
        const filePath = path_1.default.resolve(cwd, 'package.json');
        return JSON.parse(yield (0, promises_1.readFile)(filePath, 'utf-8'));
    });
}
function getUpdateFilesList(cwd) {
    return __awaiter(this, void 0, void 0, function* () {
        const file = yield readPackageJson(cwd);
        if (!file.houston) {
            return [];
        }
        const { houston } = file;
        if (!houston.updateFiles) {
            return [];
        }
        return houston.updateFiles;
    });
}
function bumpFileVersions(cwd, oldVersion, newVersion) {
    return __awaiter(this, void 0, void 0, function* () {
        const files = yield getUpdateFilesList(cwd);
        yield Promise.all(files.map((file) => __awaiter(this, void 0, void 0, function* () {
            const filePath = path_1.default.join(cwd, file);
            const data = yield (0, promises_1.readFile)(filePath, 'utf8');
            yield (0, promises_1.writeFile)(filePath, data.replace(oldVersion, newVersion), 'utf8');
        })));
    });
}
function createBumpFile(cwd, pkgName) {
    return __awaiter(this, void 0, void 0, function* () {
        const filePath = path_1.default.join(cwd, '.changeset', `bump-patch-${Date.now()}.md`);
        const data = `---
'${pkgName}': patch
---

Bump ${pkgName} version.
`;
        yield (0, promises_1.writeFile)(filePath, data, 'utf8');
    });
}
function getEngineVersionsMd(cwd) {
    return __awaiter(this, void 0, void 0, function* () {
        const { node } = yield (0, getMetadata_1.getNodeNpmVersions)(cwd);
        const appsEngine = yield (0, getMetadata_1.getAppsEngineVersion)(cwd);
        const mongo = yield (0, getMetadata_1.getMongoVersion)(cwd);
        return `### Engine versions

- Node: \`${node}\`
- MongoDB: \`${mongo.join(', ')}\`
- Apps-Engine: \`${appsEngine}\`

`;
    });
}
function isPreRelease(cwd) {
    try {
        fs_1.default.accessSync(path_1.default.resolve(cwd, '.changeset', 'pre.json'));
        return true;
    }
    catch (e) {
        // nothing to do, not a pre release
    }
    return false;
}
function createTempReleaseNotes(version, releaseBody) {
    return `
<!-- release-notes-start -->
<!-- This content is automatically generated. Changing this will not reflect on the final release log -->

_You can see below a preview of the release change log:_

# ${version}

${releaseBody}
<!-- release-notes-end -->`;
}
