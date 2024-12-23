"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAction = void 0;
const reducer_1 = require("../reducer");
const userAction = (payload) => ({
    type: reducer_1.ActionTypes.User,
    payload,
});
exports.userAction = userAction;
