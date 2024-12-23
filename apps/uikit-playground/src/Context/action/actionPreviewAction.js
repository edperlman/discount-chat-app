"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actionPreviewAction = void 0;
const reducer_1 = require("../reducer");
const actionPreviewAction = (payload) => ({
    type: reducer_1.ActionTypes.ActionPreview,
    payload,
});
exports.actionPreviewAction = actionPreviewAction;
