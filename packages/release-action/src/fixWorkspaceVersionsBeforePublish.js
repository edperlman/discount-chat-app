"use strict";
// Changesets doesn't currently support workspace versions:
// https://github.com/changesets/changesets/issues/432
// https://github.com/changesets/action/issues/246
// To work around that, we'll manually resolve any `workspace:` version ranges
// with this tool prior to publishing. If/when changesets adds native support for
// publishing with Yarn 3, we can remove this script.
//
// We'll only support the `workspace:^` range, which is the only one we
// generally want to use.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixWorkspaceVersionsBeforePublish = fixWorkspaceVersionsBeforePublish;
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
const exec_1 = require("@actions/exec");
const utils_1 = require("./utils");
const DEPENDENCY_TYPES = ['dependencies', 'devDependencies', 'peerDependencies'];
function fixWorkspaceVersionsBeforePublish() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c, _d, e_2, _e, _f;
        var _g;
        const rawWorkspaces = yield (0, exec_1.getExecOutput)('yarn workspaces list --json');
        const workspaces = rawWorkspaces.stdout
            .trim()
            .split('\n')
            .map((line) => JSON.parse(line))
            .filter((workspace) => workspace.location !== '.');
        // Get the version of each workspace package.
        const workspaceVersions = new Map();
        try {
            for (var _h = true, workspaces_1 = __asyncValues(workspaces), workspaces_1_1; workspaces_1_1 = yield workspaces_1.next(), _a = workspaces_1_1.done, !_a; _h = true) {
                _c = workspaces_1_1.value;
                _h = false;
                const workspace = _c;
                const packageJson = yield (0, utils_1.readPackageJson)(workspace.location);
                workspaceVersions.set(workspace.name, packageJson.version);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_h && !_a && (_b = workspaces_1.return)) yield _b.call(workspaces_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            // Replace any `workspace:^` version ranges with the actual version.
            for (var _j = true, workspaces_2 = __asyncValues(workspaces), workspaces_2_1; workspaces_2_1 = yield workspaces_2.next(), _d = workspaces_2_1.done, !_d; _j = true) {
                _f = workspaces_2_1.value;
                _j = false;
                const workspace = _f;
                const packageJson = yield (0, utils_1.readPackageJson)(workspace.location);
                for (const dependencyType of DEPENDENCY_TYPES) {
                    const dependencies = Object.keys((_g = packageJson[dependencyType]) !== null && _g !== void 0 ? _g : {});
                    for (const dependency of dependencies) {
                        const dependencyVersion = packageJson[dependencyType][dependency];
                        if (dependencyVersion.startsWith('workspace:')) {
                            const realVersion = workspaceVersions.get(dependency);
                            if (!realVersion) {
                                throw new Error(`Could not find version for workspace ${dependency}`);
                            }
                            const semver = dependencyVersion.slice('workspace:'.length);
                            if (semver === '*') {
                                packageJson[dependencyType][dependency] = `=${realVersion}`;
                            }
                            else if (semver === '^') {
                                packageJson[dependencyType][dependency] = `^${realVersion}`;
                            }
                            else if (semver === '~') {
                                packageJson[dependencyType][dependency] = `~${realVersion}`;
                            }
                            else {
                                packageJson[dependencyType][dependency] = semver;
                            }
                        }
                    }
                }
                yield promises_1.default.writeFile(node_path_1.default.join(workspace.location, 'package.json'), `${JSON.stringify(packageJson, null, 2)}\n`);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (!_j && !_d && (_e = workspaces_2.return)) yield _e.call(workspaces_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
    });
}
