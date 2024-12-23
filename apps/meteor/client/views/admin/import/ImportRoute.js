"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const ImportHistoryPage_1 = __importDefault(require("./ImportHistoryPage"));
const ImportProgressPage_1 = __importDefault(require("./ImportProgressPage"));
const NewImportPage_1 = __importDefault(require("./NewImportPage"));
const PrepareImportPage_1 = __importDefault(require("./PrepareImportPage"));
const NotAuthorizedPage_1 = __importDefault(require("../../notAuthorized/NotAuthorizedPage"));
function ImportHistoryRoute({ page }) {
    const canRunImport = (0, ui_contexts_1.usePermission)('run-import');
    if (!canRunImport) {
        return (0, jsx_runtime_1.jsx)(NotAuthorizedPage_1.default, {});
    }
    if (page === 'history') {
        return (0, jsx_runtime_1.jsx)(ImportHistoryPage_1.default, {});
    }
    if (page === 'new') {
        return (0, jsx_runtime_1.jsx)(NewImportPage_1.default, {});
    }
    if (page === 'prepare') {
        return (0, jsx_runtime_1.jsx)(PrepareImportPage_1.default, {});
    }
    if (page === 'progress') {
        return (0, jsx_runtime_1.jsx)(ImportProgressPage_1.default, {});
    }
    return null;
}
exports.default = ImportHistoryRoute;
