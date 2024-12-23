"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openCreateNewScreenAction = void 0;
const reducer_1 = require("../reducer");
const openCreateNewScreenAction = (payload) => ({
    type: reducer_1.ActionTypes.OpenCreateNewScreen,
    payload,
});
exports.openCreateNewScreenAction = openCreateNewScreenAction;
