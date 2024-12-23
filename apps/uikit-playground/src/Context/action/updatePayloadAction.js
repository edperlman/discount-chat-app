"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePayloadAction = void 0;
const reducer_1 = require("../reducer");
const updatePayloadAction = (payload) => ({
    type: reducer_1.ActionTypes.UpdatePayload,
    payload,
});
exports.updatePayloadAction = updatePayloadAction;
