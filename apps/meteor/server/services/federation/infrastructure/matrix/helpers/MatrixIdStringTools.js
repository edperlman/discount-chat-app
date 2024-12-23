"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractUserIdAndHomeserverFromMatrixId = exports.extractServerNameFromExternalIdentifier = exports.isAnExternalUserIdFormat = exports.isAnExternalIdentifierFormat = exports.formatExternalAliasIdToInternalFormat = exports.formatExternalUserIdToInternalUsernameFormat = exports.removeExternalSpecificCharsFromExternalIdentifier = void 0;
const removeExternalSpecificCharsFromExternalIdentifier = (matrixId = '') => {
    return matrixId.replace('@', '').replace('!', '').replace('#', '');
};
exports.removeExternalSpecificCharsFromExternalIdentifier = removeExternalSpecificCharsFromExternalIdentifier;
const formatExternalUserIdToInternalUsernameFormat = (matrixId = '') => {
    var _a;
    return (_a = matrixId.split(':')[0]) === null || _a === void 0 ? void 0 : _a.replace('@', '');
};
exports.formatExternalUserIdToInternalUsernameFormat = formatExternalUserIdToInternalUsernameFormat;
const formatExternalAliasIdToInternalFormat = (alias = '') => {
    var _a;
    return (_a = alias.split(':')[0]) === null || _a === void 0 ? void 0 : _a.replace('#', '');
};
exports.formatExternalAliasIdToInternalFormat = formatExternalAliasIdToInternalFormat;
const isAnExternalIdentifierFormat = (identifier) => identifier.includes(':');
exports.isAnExternalIdentifierFormat = isAnExternalIdentifierFormat;
const isAnExternalUserIdFormat = (userId) => (0, exports.isAnExternalIdentifierFormat)(userId) && userId.includes('@');
exports.isAnExternalUserIdFormat = isAnExternalUserIdFormat;
const extractServerNameFromExternalIdentifier = (identifier = '') => {
    const splitted = identifier.split(':');
    return splitted.length > 1 ? splitted[1] : '';
};
exports.extractServerNameFromExternalIdentifier = extractServerNameFromExternalIdentifier;
const extractUserIdAndHomeserverFromMatrixId = (matrixId = '') => {
    return matrixId.replace('@', '').split(':');
};
exports.extractUserIdAndHomeserverFromMatrixId = extractUserIdAndHomeserverFromMatrixId;
