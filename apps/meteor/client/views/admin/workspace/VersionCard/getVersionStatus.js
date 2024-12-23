"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVersionStatus = void 0;
const semver_1 = __importDefault(require("semver"));
const getVersionStatus = (serverVersion, versions) => {
    const highestVersion = versions
        .sort((prev, current) => semver_1.default.compare(current.version, prev.version))
        .filter((v) => {
        const [prerelease] = semver_1.default.prerelease(v.version) || [];
        const [currentPrerelease] = semver_1.default.prerelease(serverVersion) || [];
        return !prerelease || prerelease === currentPrerelease;
    })[0];
    const currentVersionData = versions.find((v) => v.version === serverVersion) ||
        versions.find((v) => semver_1.default.satisfies(String(semver_1.default.coerce(v.version)), `=${semver_1.default.major(serverVersion)}.${semver_1.default.minor(serverVersion)}.x`));
    const currentVersionIsExpired = (currentVersionData === null || currentVersionData === void 0 ? void 0 : currentVersionData.expiration) && new Date(currentVersionData.expiration) < new Date();
    const isSupported = !currentVersionIsExpired && !!currentVersionData;
    return Object.assign(Object.assign(Object.assign({ label: 'outdated', version: serverVersion }, (isSupported && semver_1.default.gte(currentVersionData === null || currentVersionData === void 0 ? void 0 : currentVersionData.version, highestVersion.version) && { label: 'latest' })), (isSupported &&
        semver_1.default.gt(highestVersion.version, currentVersionData === null || currentVersionData === void 0 ? void 0 : currentVersionData.version) && { label: 'available_version', version: highestVersion.version })), { expiration: currentVersionData === null || currentVersionData === void 0 ? void 0 : currentVersionData.expiration });
};
exports.getVersionStatus = getVersionStatus;
