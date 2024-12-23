"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withUserIdProps = exports.withUserIdSchema = exports.withBaseProps = exports.baseSchema = exports.withGroupBaseProperties = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({
    coerceTypes: true,
});
const withGroupBaseProperties = (properties = {}, required = []) => ({
    oneOf: [
        {
            type: 'object',
            properties: Object.assign({ roomId: {
                    type: 'string',
                } }, properties),
            required: ['roomId'].concat(required),
            additionalProperties: false,
        },
        {
            type: 'object',
            properties: Object.assign({ roomName: {
                    type: 'string',
                } }, properties),
            required: ['roomName'].concat(required),
            additionalProperties: false,
        },
    ],
});
exports.withGroupBaseProperties = withGroupBaseProperties;
exports.baseSchema = (0, exports.withGroupBaseProperties)();
exports.withBaseProps = ajv.compile(exports.baseSchema);
exports.withUserIdSchema = (0, exports.withGroupBaseProperties)({
    userId: {
        type: 'string',
    },
}, ['userId']);
exports.withUserIdProps = ajv.compile(exports.withUserIdSchema);
