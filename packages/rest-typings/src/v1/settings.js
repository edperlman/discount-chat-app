"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSettingsPublicWithPaginationProps = exports.isSettingsUpdatePropDefault = exports.isSettingsUpdatePropsColor = exports.isSettingsUpdatePropsActions = void 0;
const Ajv_1 = require("./Ajv");
const isSettingsUpdatePropsActions = (props) => 'execute' in props;
exports.isSettingsUpdatePropsActions = isSettingsUpdatePropsActions;
const isSettingsUpdatePropsColor = (props) => 'editor' in props && 'value' in props;
exports.isSettingsUpdatePropsColor = isSettingsUpdatePropsColor;
const isSettingsUpdatePropDefault = (props) => 'value' in props;
exports.isSettingsUpdatePropDefault = isSettingsUpdatePropDefault;
const SettingsPublicWithPaginationSchema = {
    type: 'object',
    properties: {
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
        _id: {
            type: 'string',
        },
        query: {
            type: 'string',
        },
    },
    required: [],
    additionalProperties: false,
};
exports.isSettingsPublicWithPaginationProps = Ajv_1.ajv.compile(SettingsPublicWithPaginationSchema);
