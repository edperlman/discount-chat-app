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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUsersResetAvatarProps = exports.isUsersSetAvatarProps = exports.isUsers2faSendEmailCodeProps = exports.isUsersInfoProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({
    coerceTypes: true,
});
const UsersInfoSchema = {
    type: 'object',
    properties: {
        userId: {
            type: 'string',
            nullable: true,
        },
        username: {
            type: 'string',
            nullable: true,
        },
    },
    required: [],
    additionalProperties: false,
};
exports.isUsersInfoProps = ajv.compile(UsersInfoSchema);
const Users2faSendEmailCodeSchema = {
    type: 'object',
    properties: {
        emailOrUsername: {
            type: 'string',
        },
    },
    required: ['emailOrUsername'],
    additionalProperties: false,
};
exports.isUsers2faSendEmailCodeProps = ajv.compile(Users2faSendEmailCodeSchema);
const UsersSetAvatarSchema = {
    type: 'object',
    properties: {
        userId: {
            type: 'string',
            nullable: true,
        },
        username: {
            type: 'string',
            nullable: true,
        },
        avatarUrl: {
            type: 'string',
            nullable: true,
        },
    },
    required: [],
    additionalProperties: false,
};
exports.isUsersSetAvatarProps = ajv.compile(UsersSetAvatarSchema);
const UsersResetAvatarSchema = {
    type: 'object',
    properties: {
        userId: {
            type: 'string',
            nullable: true,
        },
        username: {
            type: 'string',
            nullable: true,
        },
    },
    required: [],
    additionalProperties: false,
};
exports.isUsersResetAvatarProps = ajv.compile(UsersResetAvatarSchema);
__exportStar(require("./users/UserCreateParamsPOST"), exports);
__exportStar(require("./users/UserSetActiveStatusParamsPOST"), exports);
__exportStar(require("./users/UserDeactivateIdleParamsPOST"), exports);
__exportStar(require("./users/UsersInfoParamsGet"), exports);
__exportStar(require("./users/UsersListStatusParamsGET"), exports);
__exportStar(require("./users/UsersSendWelcomeEmailParamsPOST"), exports);
__exportStar(require("./users/UserRegisterParamsPOST"), exports);
__exportStar(require("./users/UserLogoutParamsPOST"), exports);
__exportStar(require("./users/UsersListTeamsParamsGET"), exports);
__exportStar(require("./users/UsersAutocompleteParamsGET"), exports);
