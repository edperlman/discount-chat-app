"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAssetsSetAssetProps = exports.isAssetsUnsetAssetProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default();
const assetsUnsetAssetPropsSchema = {
    type: 'object',
    properties: {
        assetName: { type: 'string' },
        refreshAllClients: { type: 'boolean', nullable: true },
    },
    required: ['assetName'],
    additionalProperties: false,
};
const assetsSetAssetPropsSchema = {
    type: 'object',
    properties: {
        assetName: { type: 'string' },
        asset: { type: 'string' },
        refreshAllClients: { type: 'boolean', nullable: true },
    },
    required: ['assetName'],
    additionalProperties: false,
};
exports.isAssetsUnsetAssetProps = ajv.compile(assetsUnsetAssetPropsSchema);
exports.isAssetsSetAssetProps = ajv.compile(assetsSetAssetPropsSchema);
