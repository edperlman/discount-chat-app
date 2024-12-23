"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmnichannelRoomIconProvider = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const react_dom_1 = require("react-dom");
const shim_1 = require("use-sync-external-store/shim");
const AsyncStatePhase_1 = require("../../../../lib/asyncState/AsyncStatePhase");
const OmnichannelRoomIconContext_1 = require("../context/OmnichannelRoomIconContext");
const OmnichannelRoomIconManager_1 = __importDefault(require("../lib/OmnichannelRoomIconManager"));
let icons = Array.from(OmnichannelRoomIconManager_1.default.icons.values());
const OmnichannelRoomIconProvider = ({ children }) => {
    const svgIcons = (0, shim_1.useSyncExternalStore)((0, react_1.useCallback)((callback) => OmnichannelRoomIconManager_1.default.on('change', () => {
        icons = Array.from(OmnichannelRoomIconManager_1.default.icons.values());
        callback();
    }), []), () => icons);
    return ((0, jsx_runtime_1.jsxs)(OmnichannelRoomIconContext_1.OmnichannelRoomIconContext.Provider, { value: (0, react_1.useMemo)(() => {
            const extractSnapshot = (app, iconName) => {
                const icon = OmnichannelRoomIconManager_1.default.get(app, iconName);
                if (icon) {
                    return {
                        phase: AsyncStatePhase_1.AsyncStatePhase.RESOLVED,
                        value: icon,
                        error: undefined,
                    };
                }
                return {
                    phase: AsyncStatePhase_1.AsyncStatePhase.LOADING,
                    value: undefined,
                    error: undefined,
                };
            };
            // We cache all the icons here, so that we can use them in the OmnichannelRoomIcon component
            const snapshots = new Map();
            return {
                queryIcon: (app, iconName) => [
                    (callback) => OmnichannelRoomIconManager_1.default.on(`${app}-${iconName}`, () => {
                        snapshots.set(`${app}-${iconName}`, extractSnapshot(app, iconName));
                        // Then we call the callback (onStoreChange), signaling React to re-render
                        callback();
                    }),
                    // No problem here, because it's return value is a cached in the snapshots map on subsequent calls
                    () => {
                        let snapshot = snapshots.get(`${app}-${iconName}`);
                        if (!snapshot) {
                            snapshot = extractSnapshot(app, iconName);
                            snapshots.set(`${app}-${iconName}`, snapshot);
                        }
                        return snapshot;
                    },
                ],
            };
        }, []), children: [(0, react_dom_1.createPortal)((0, jsx_runtime_1.jsx)("svg", { xmlns: 'http://www.w3.org/2000/svg', xmlnsXlink: 'http://www.w3.org/1999/xlink', style: { display: 'none' }, dangerouslySetInnerHTML: { __html: svgIcons.join('') } }), document.body, 'custom-icons'), children] }));
};
exports.OmnichannelRoomIconProvider = OmnichannelRoomIconProvider;
