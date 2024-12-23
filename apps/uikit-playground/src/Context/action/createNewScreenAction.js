"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewScreenAction = void 0;
const reducer_1 = require("../reducer");
const createNewScreenAction = (payload) => ({
    type: reducer_1.ActionTypes.CreateNewScreen,
    payload,
});
exports.createNewScreenAction = createNewScreenAction;
