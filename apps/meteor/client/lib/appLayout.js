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
Object.defineProperty(exports, "__esModule", { value: true });
exports.appLayout = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const emitter_1 = require("@rocket.chat/emitter");
const react_1 = __importStar(require("react"));
const ConnectionStatusBar = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('../components/connectionStatus/ConnectionStatusBar'))));
const BannerRegion = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('../views/banners/BannerRegion'))));
const ModalRegion = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('../views/modal/ModalRegion'))));
const ActionManagerBusyState = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('../components/ActionManagerBusyState'))));
const CloudAnnouncementsRegion = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('../views/cloud/CloudAnnouncementsRegion'))));
class AppLayoutSubscription extends emitter_1.Emitter {
    constructor() {
        super(...arguments);
        this.descriptor = null;
        this.getSnapshot = () => this.descriptor;
        this.subscribe = (onStoreChange) => this.on('update', onStoreChange);
    }
    setCurrentValue(descriptor) {
        this.descriptor = descriptor;
        this.emit('update');
    }
    render(element) {
        this.setCurrentValue(element);
    }
    wrap(element) {
        return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(ConnectionStatusBar, {}), (0, jsx_runtime_1.jsx)(ActionManagerBusyState, {}), (0, jsx_runtime_1.jsx)(CloudAnnouncementsRegion, {}), (0, jsx_runtime_1.jsx)(BannerRegion, {}), element, (0, jsx_runtime_1.jsx)(ModalRegion, {})] }));
    }
}
exports.appLayout = new AppLayoutSubscription();
