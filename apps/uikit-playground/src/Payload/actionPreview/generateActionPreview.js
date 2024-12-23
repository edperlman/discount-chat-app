"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constant_1 = require("../../Components/Preview/Display/Surface/constant");
const container_1 = __importDefault(require("./container"));
const generateActionPreview = ({ type, data, surface, blocks, user, }) => {
    const actionPreview = Object.assign({ type,
        user, api_app_id: '', token: '', container: container_1.default[surface || constant_1.SurfaceOptions.Message], trigger_id: '', team: null, enterprise: null, is_enterprise_install: false, response_url: '' }, data);
    if (type === 'View Submission') {
        actionPreview.view = blocks;
    }
    return actionPreview;
};
exports.default = generateActionPreview;
