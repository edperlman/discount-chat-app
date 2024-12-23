"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renameProjectAction = void 0;
const reducer_1 = require("../reducer");
const renameProjectAction = (payload) => ({
    type: reducer_1.ActionTypes.RenameProject,
    payload,
});
exports.renameProjectAction = renameProjectAction;
