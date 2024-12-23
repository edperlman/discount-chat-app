"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.duplicateScreenAction = void 0;
const reducer_1 = require("../reducer");
const duplicateScreenAction = (payload) => ({
    type: reducer_1.ActionTypes.DuplicateScreen,
    payload,
});
exports.duplicateScreenAction = duplicateScreenAction;
