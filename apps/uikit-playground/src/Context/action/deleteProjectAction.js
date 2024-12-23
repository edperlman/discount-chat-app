"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProjectAction = void 0;
const reducer_1 = require("../reducer");
const deleteProjectAction = (payload) => ({
    type: reducer_1.ActionTypes.DeleteProject,
    payload,
});
exports.deleteProjectAction = deleteProjectAction;
