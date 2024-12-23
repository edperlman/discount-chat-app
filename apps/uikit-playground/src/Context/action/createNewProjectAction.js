"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewProjectAction = void 0;
const reducer_1 = require("../reducer");
const createNewProjectAction = (payload) => ({
    type: reducer_1.ActionTypes.CreateNewProject,
    payload,
});
exports.createNewProjectAction = createNewProjectAction;
