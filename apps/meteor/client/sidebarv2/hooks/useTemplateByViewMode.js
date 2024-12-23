"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTemplateByViewMode = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const Condensed_1 = __importDefault(require("../Item/Condensed"));
const Extended_1 = __importDefault(require("../Item/Extended"));
const Medium_1 = __importDefault(require("../Item/Medium"));
const useTemplateByViewMode = () => {
    const sidebarViewMode = (0, ui_contexts_1.useUserPreference)('sidebarViewMode');
    return (0, react_1.useMemo)(() => {
        switch (sidebarViewMode) {
            case 'extended':
                return Extended_1.default;
            case 'medium':
                return Medium_1.default;
            case 'condensed':
            default:
                return Condensed_1.default;
        }
    }, [sidebarViewMode]);
};
exports.useTemplateByViewMode = useTemplateByViewMode;
