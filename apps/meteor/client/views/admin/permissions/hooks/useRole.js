"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRole = void 0;
const react_1 = require("react");
const client_1 = require("../../../../../app/models/client");
const useReactiveValue_1 = require("../../../../hooks/useReactiveValue");
const useRole = (_id) => (0, useReactiveValue_1.useReactiveValue)((0, react_1.useCallback)(() => client_1.Roles.findOne({ _id }), [_id]));
exports.useRole = useRole;
