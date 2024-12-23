"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialState = void 0;
const constant_1 = require("../Components/Preview/Display/Surface/constant");
const getUniqueId_1 = __importDefault(require("../utils/getUniqueId"));
const getDate_1 = __importDefault(require("../utils/getDate"));
const initialProjectId = (0, getUniqueId_1.default)();
const initialScreenId = (0, getUniqueId_1.default)();
exports.initialState = {
    isMobile: false,
    isTablet: false,
    sideBarToggle: false,
    templatesToggle: false,
    previewTabsToggle: 0,
    editorTabsToggle: 0,
    navMenuToggle: false,
    activeProject: initialProjectId,
    activeScreen: initialScreenId,
    openCreateNewScreen: false,
    projects: {
        [initialProjectId]: {
            id: initialProjectId,
            name: 'Untitled Project',
            screens: [initialScreenId],
            date: (0, getDate_1.default)(),
            flowEdges: [],
            flowNodes: [],
            viewport: undefined,
        },
    },
    screens: {
        [initialScreenId]: {
            payload: {
                surface: constant_1.SurfaceOptions.Message,
                blocks: [],
            },
            id: initialScreenId,
            name: 'Untitled Screen',
            date: (0, getDate_1.default)(),
            actionPreview: {},
        },
    },
    user: null,
};
