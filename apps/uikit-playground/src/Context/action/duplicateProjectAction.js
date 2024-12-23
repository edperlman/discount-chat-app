"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.duplicateProjectAction = void 0;
const reducer_1 = require("../reducer");
const duplicateProjectAction = (payload) => ({
    type: reducer_1.ActionTypes.DuplicateProject,
    payload,
});
exports.duplicateProjectAction = duplicateProjectAction;
