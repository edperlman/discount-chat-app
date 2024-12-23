"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renameScreenAction = void 0;
const reducer_1 = require("../reducer");
const renameScreenAction = (payload) => ({
    type: reducer_1.ActionTypes.RenameScreen,
    payload,
});
exports.renameScreenAction = renameScreenAction;
