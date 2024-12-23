"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteScreenAction = void 0;
const reducer_1 = require("../reducer");
const deleteScreenAction = (payload) => ({
    type: reducer_1.ActionTypes.DeleteScreen,
    payload,
});
exports.deleteScreenAction = deleteScreenAction;
