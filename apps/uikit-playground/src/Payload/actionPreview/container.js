"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constant_1 = require("../../Components/Preview/Display/Surface/constant");
const container = {
    [constant_1.SurfaceOptions.Message]: {
        type: 'message',
        text: 'The contents of the original message where the action originated',
    },
    [constant_1.SurfaceOptions.Banner]: {
        type: 'banner',
        text: '',
    },
    [constant_1.SurfaceOptions.Modal]: {
        type: 'modal',
        text: '',
    },
    [constant_1.SurfaceOptions.ContextualBar]: {
        type: 'ContextualBar',
        text: '',
    },
};
exports.default = container;
