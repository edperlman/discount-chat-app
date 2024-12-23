"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionTypes = void 0;
const lodash_1 = __importDefault(require("lodash"));
const getUniqueId_1 = __importDefault(require("../utils/getUniqueId"));
const getDate_1 = __importDefault(require("../utils/getDate"));
const constant_1 = require("../Components/Preview/Display/Surface/constant");
const filterEdges_1 = require("../utils/filterEdges");
var ActionTypes;
(function (ActionTypes) {
    ActionTypes[ActionTypes["IsMobile"] = 0] = "IsMobile";
    ActionTypes[ActionTypes["IsTablet"] = 1] = "IsTablet";
    ActionTypes[ActionTypes["SidebarToggle"] = 2] = "SidebarToggle";
    ActionTypes[ActionTypes["PreviewToggle"] = 3] = "PreviewToggle";
    ActionTypes[ActionTypes["EditorToggle"] = 4] = "EditorToggle";
    ActionTypes[ActionTypes["TemplatesToggle"] = 5] = "TemplatesToggle";
    ActionTypes[ActionTypes["NavMenuToggle"] = 6] = "NavMenuToggle";
    ActionTypes[ActionTypes["Surface"] = 7] = "Surface";
    ActionTypes[ActionTypes["UpdatePayload"] = 8] = "UpdatePayload";
    ActionTypes[ActionTypes["ActionPreview"] = 9] = "ActionPreview";
    ActionTypes[ActionTypes["User"] = 10] = "User";
    ActionTypes[ActionTypes["OpenCreateNewScreen"] = 11] = "OpenCreateNewScreen";
    ActionTypes[ActionTypes["ActiveScreen"] = 12] = "ActiveScreen";
    ActionTypes[ActionTypes["CreateNewScreen"] = 13] = "CreateNewScreen";
    ActionTypes[ActionTypes["DuplicateScreen"] = 14] = "DuplicateScreen";
    ActionTypes[ActionTypes["DeleteScreen"] = 15] = "DeleteScreen";
    ActionTypes[ActionTypes["RenameScreen"] = 16] = "RenameScreen";
    ActionTypes[ActionTypes["CreateNewProject"] = 17] = "CreateNewProject";
    ActionTypes[ActionTypes["ActiveProject"] = 18] = "ActiveProject";
    ActionTypes[ActionTypes["DeleteProject"] = 19] = "DeleteProject";
    ActionTypes[ActionTypes["DuplicateProject"] = 20] = "DuplicateProject";
    ActionTypes[ActionTypes["RenameProject"] = 21] = "RenameProject";
    ActionTypes[ActionTypes["UpdateFlowEdges"] = 22] = "UpdateFlowEdges";
    ActionTypes[ActionTypes["UpdateNodesAndViewPort"] = 23] = "UpdateNodesAndViewPort";
})(ActionTypes || (exports.ActionTypes = ActionTypes = {}));
const reducer = (state, action) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const { activeProject, activeScreen } = state;
    switch (action.type) {
        case ActionTypes.IsMobile:
            return Object.assign(Object.assign({}, state), { isMobile: action.payload });
        case ActionTypes.IsTablet:
            return Object.assign(Object.assign({}, state), { isTablet: action.payload });
        case ActionTypes.SidebarToggle:
            return Object.assign(Object.assign({}, state), { sideBarToggle: action.payload });
        case ActionTypes.PreviewToggle:
            return Object.assign(Object.assign({}, state), { previewTabsToggle: action.payload });
        case ActionTypes.EditorToggle:
            return Object.assign(Object.assign({}, state), { editorTabsToggle: action.payload });
        case ActionTypes.TemplatesToggle:
            return Object.assign(Object.assign({}, state), { templatesToggle: action.payload });
        case ActionTypes.NavMenuToggle:
            return Object.assign(Object.assign({}, state), { navMenuToggle: action.payload });
        case ActionTypes.Surface: {
            state.screens[activeScreen].payload.surface = action.payload;
            state.screens[activeScreen].changedByEditor = false;
            return Object.assign({}, state);
        }
        case ActionTypes.UpdatePayload: {
            state.screens[activeScreen].payload.blocks = (_a = action === null || action === void 0 ? void 0 : action.payload) === null || _a === void 0 ? void 0 : _a.blocks;
            if ((_b = action === null || action === void 0 ? void 0 : action.payload) === null || _b === void 0 ? void 0 : _b.surface)
                state.screens[activeScreen].payload.surface = (_c = action === null || action === void 0 ? void 0 : action.payload) === null || _c === void 0 ? void 0 : _c.surface;
            state.screens[activeScreen].changedByEditor =
                ((_d = action === null || action === void 0 ? void 0 : action.payload) === null || _d === void 0 ? void 0 : _d.changedByEditor) === undefined;
            state.projects[activeProject].flowEdges = (0, filterEdges_1.filterEdges)(state.projects[activeProject].flowEdges, (_e = action === null || action === void 0 ? void 0 : action.payload) === null || _e === void 0 ? void 0 : _e.blocks.map((node) => node.actionId), activeScreen);
            return Object.assign({}, state);
        }
        case ActionTypes.ActionPreview: {
            state.screens[activeScreen].actionPreview = action.payload;
            return Object.assign({}, state);
        }
        case ActionTypes.User:
            return Object.assign(Object.assign({}, state), { user: action.payload });
        case ActionTypes.OpenCreateNewScreen:
            return Object.assign(Object.assign({}, state), { openCreateNewScreen: action.payload });
        case ActionTypes.ActiveScreen:
            return Object.assign(Object.assign({}, state), { openCreateNewScreen: false, activeScreen: action.payload });
        case ActionTypes.CreateNewScreen: {
            const id = (0, getUniqueId_1.default)();
            return Object.assign(Object.assign({}, state), { screens: Object.assign(Object.assign({}, state.screens), { [id]: {
                        id,
                        name: (action === null || action === void 0 ? void 0 : action.payload) || 'Untitled Screen',
                        payload: {
                            surface: constant_1.SurfaceOptions.Message,
                            blocks: [],
                        },
                        date: (0, getDate_1.default)(),
                        actionPreview: {},
                    } }), projects: Object.assign(Object.assign({}, state.projects), { [activeProject]: Object.assign(Object.assign({}, state.projects[activeProject]), { screens: [...state.projects[activeProject].screens, id] }) }), openCreateNewScreen: false, activeScreen: id });
        }
        case ActionTypes.DuplicateScreen: {
            const id = (0, getUniqueId_1.default)();
            const screens = state.projects[activeProject].screens;
            screens.splice(screens.indexOf(action.payload.id), 0, id);
            return Object.assign(Object.assign({}, state), { screens: Object.assign(Object.assign({}, state.screens), { [id]: Object.assign(Object.assign({}, state.screens[action.payload.id]), { id, date: (0, getDate_1.default)(), actionPreview: {}, name: (action === null || action === void 0 ? void 0 : action.payload.name) || 'Untitled Screen', payload: state.screens[action.payload.id].payload }) }), projects: Object.assign(Object.assign({}, state.projects), { [activeProject]: Object.assign(Object.assign({}, state.projects[activeProject]), { screens }) }), openCreateNewScreen: false, activeScreen: id });
        }
        case ActionTypes.RenameScreen: {
            state.screens[(_f = action === null || action === void 0 ? void 0 : action.payload) === null || _f === void 0 ? void 0 : _f.id].name = action.payload.name;
            return Object.assign({}, state);
        }
        case ActionTypes.DeleteScreen: {
            delete state.screens[action.payload];
            state.projects[activeProject].screens = [
                ...state.projects[activeProject].screens.filter((id) => id !== action.payload),
            ];
            if (state.projects[activeProject].screens.length > 0) {
                state.activeScreen = state.projects[activeProject].screens[0];
            }
            else if (state.projects[activeProject].screens.length === 0) {
                if (Object.keys(state.projects).length > 0) {
                    delete state.projects[activeProject];
                    state.activeProject = '';
                    state.activeScreen = '';
                }
            }
            state.projects[activeProject].flowEdges = state.projects[activeProject].flowEdges.filter((edge) => edge.source !== action.payload && edge.target !== action.payload);
            state.projects[activeProject].flowNodes = state.projects[activeProject].flowNodes.filter((node) => node.id !== action.payload);
            return Object.assign({}, state);
        }
        case ActionTypes.CreateNewProject: {
            const activeProjectId = (0, getUniqueId_1.default)();
            const activeScreenId = (0, getUniqueId_1.default)();
            return Object.assign(Object.assign({}, state), { projects: Object.assign(Object.assign({}, state.projects), { [activeProjectId]: {
                        id: activeProjectId,
                        name: (action === null || action === void 0 ? void 0 : action.payload) || 'Untitled Project',
                        screens: [activeScreenId],
                        date: (0, getDate_1.default)(),
                        flowEdges: [],
                        flowNodes: [],
                    } }), activeProject: activeProjectId, screens: Object.assign(Object.assign({}, state.screens), { [activeScreenId]: {
                        id: activeScreenId,
                        name: 'Untitled Screen',
                        date: (0, getDate_1.default)(),
                        payload: {
                            surface: constant_1.SurfaceOptions.Message,
                            blocks: [],
                        },
                        actionPreview: {},
                    } }) });
        }
        case ActionTypes.ActiveProject:
            return Object.assign(Object.assign({}, state), { activeProject: action.payload, activeScreen: state.projects[action.payload].screens[0] });
        case ActionTypes.DuplicateProject: {
            const activeProjectId = (0, getUniqueId_1.default)();
            const screensIds = state.projects[action.payload.id].screens;
            const newScreensIds = screensIds.map(() => (0, getUniqueId_1.default)());
            const screens = lodash_1.default.cloneDeep(state.screens);
            newScreensIds.forEach((id, index) => {
                screens[id] = Object.assign(Object.assign({}, screens[screensIds[index]]), { date: (0, getDate_1.default)(), id });
            });
            return Object.assign(Object.assign({}, state), { projects: Object.assign(Object.assign({}, state.projects), { [activeProjectId]: Object.assign(Object.assign({}, state.projects[action.payload.id]), { id: activeProjectId, name: (action === null || action === void 0 ? void 0 : action.payload.name) || 'Untitled Project', screens: newScreensIds, date: (0, getDate_1.default)() }) }), activeProject: activeProjectId, screens: screens });
        }
        case ActionTypes.DeleteProject: {
            window.console.log((_g = state.projects[action.payload]) === null || _g === void 0 ? void 0 : _g.screens);
            const screensIds = (_h = state.projects[action.payload]) === null || _h === void 0 ? void 0 : _h.screens;
            screensIds === null || screensIds === void 0 ? void 0 : screensIds.map((id) => delete state.screens[id]);
            delete state.projects[action.payload];
            return Object.assign(Object.assign({}, state), { activeProject: '', activeScreen: '' });
        }
        case ActionTypes.RenameProject: {
            state.projects[action.payload.id].name = action.payload.name;
            return Object.assign({}, state);
        }
        case ActionTypes.UpdateFlowEdges: {
            state.projects[activeProject].flowEdges = action.payload;
            return Object.assign({}, state);
        }
        case ActionTypes.UpdateNodesAndViewPort: {
            const { nodes, viewport } = action.payload;
            state.projects[activeProject].flowNodes = nodes;
            state.projects[activeProject].viewport = viewport;
            return Object.assign({}, state);
        }
        default:
            return state;
    }
};
exports.default = reducer;
