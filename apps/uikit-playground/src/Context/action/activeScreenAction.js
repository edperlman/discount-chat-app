"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activeScreenAction = void 0;
const reducer_1 = require("../reducer");
const activeScreenAction = (payload) => ({
    type: reducer_1.ActionTypes.ActiveScreen,
    payload,
});
exports.activeScreenAction = activeScreenAction;
