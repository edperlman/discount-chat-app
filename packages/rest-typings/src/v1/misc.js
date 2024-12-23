"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFingerprintProps = exports.isMethodCallAnonProps = exports.isMeteorCall = exports.isMethodCallProps = exports.isDirectoryProps = exports.isSpotlightProps = exports.isShieldSvgProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({
    coerceTypes: true,
});
const ShieldSvgSchema = {
    type: 'object',
    properties: {
        type: {
            type: 'string',
            nullable: true,
        },
        icon: {
            type: 'string',
            enum: ['true', 'false'],
            nullable: true,
        },
        channel: {
            type: 'string',
        },
        name: {
            type: 'string',
        },
    },
    required: ['name', 'channel'],
    additionalProperties: false,
};
exports.isShieldSvgProps = ajv.compile(ShieldSvgSchema);
const SpotlightSchema = {
    type: 'object',
    properties: {
        query: {
            type: 'string',
        },
    },
    required: ['query'],
    additionalProperties: false,
};
exports.isSpotlightProps = ajv.compile(SpotlightSchema);
const DirectorySchema = {
    type: 'object',
    properties: {
        text: {
            type: 'string',
            nullable: true,
        },
        type: {
            type: 'string',
            nullable: true,
        },
        workspace: {
            type: 'string',
            nullable: true,
        },
        count: {
            type: 'number',
            nullable: true,
        },
        offset: {
            type: 'number',
            nullable: true,
        },
        sort: {
            type: 'string',
            nullable: true,
        },
        query: {
            type: 'string',
            nullable: true,
        },
    },
    required: [],
    additionalProperties: false,
};
exports.isDirectoryProps = ajv.compile(DirectorySchema);
const MethodCallSchema = {
    type: 'object',
    properties: {
        method: {
            type: 'string',
        },
        params: {
            type: 'array',
        },
        id: {
            type: 'string',
        },
        msg: {
            type: 'string',
            enum: ['method'],
        },
    },
    required: ['method', 'params', 'id', 'msg'],
    additionalProperties: false,
};
exports.isMethodCallProps = ajv.compile(MethodCallSchema);
exports.isMeteorCall = ajv.compile({
    type: 'object',
    properties: {
        message: {
            type: 'string',
        },
    },
    required: ['message'],
    additionalProperties: false,
});
const MethodCallAnonSchema = {
    type: 'object',
    properties: {
        method: {
            type: 'string',
        },
        params: {
            type: 'array',
        },
        id: {
            type: 'string',
        },
        msg: {
            type: 'string',
            enum: ['method'],
        },
    },
    required: ['method', 'params', 'id', 'msg'],
    additionalProperties: false,
};
exports.isMethodCallAnonProps = ajv.compile(MethodCallAnonSchema);
const FingerprintSchema = {
    type: 'object',
    properties: {
        setDeploymentAs: {
            type: 'string',
            enum: ['new-workspace', 'updated-configuration'],
        },
    },
    required: ['setDeploymentAs'],
    additionalProperties: false,
};
exports.isFingerprintProps = ajv.compile(FingerprintSchema);
