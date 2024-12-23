"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activeProjectAction = void 0;
const reducer_1 = require("../reducer");
const activeProjectAction = (payload) => ({
    type: reducer_1.ActionTypes.ActiveProject,
    payload,
});
exports.activeProjectAction = activeProjectAction;
