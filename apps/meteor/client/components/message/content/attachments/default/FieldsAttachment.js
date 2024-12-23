"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const Field_1 = __importDefault(require("./Field"));
const ShortField_1 = __importDefault(require("./ShortField"));
const FieldsAttachment = ({ fields }) => ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { flexWrap: 'wrap', display: 'flex', mb: 4, mi: -4, children: fields.map((field, index) => (field.short ? (0, jsx_runtime_1.jsx)(ShortField_1.default, Object.assign({}, field), index) : (0, jsx_runtime_1.jsx)(Field_1.default, Object.assign({}, field), index))) }));
exports.default = FieldsAttachment;
