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
exports.registerAccountRoute = void 0;
const react_1 = require("react");
const createRouteGroup_1 = require("../../lib/createRouteGroup");
exports.registerAccountRoute = (0, createRouteGroup_1.createRouteGroup)('account', '/account', (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./AccountRouter')))));
(0, exports.registerAccountRoute)('/preferences', {
    name: 'preferences',
    component: (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./preferences/AccountPreferencesPage')))),
});
(0, exports.registerAccountRoute)('/profile', {
    name: 'profile',
    component: (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./profile/AccountProfileRoute')))),
});
(0, exports.registerAccountRoute)('/security', {
    name: 'security',
    component: (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./security/AccountSecurityRoute')))),
});
(0, exports.registerAccountRoute)('/integrations', {
    name: 'integrations',
    component: (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./integrations/AccountIntegrationsRoute')))),
});
(0, exports.registerAccountRoute)('/tokens', {
    name: 'tokens',
    component: (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./tokens/AccountTokensRoute')))),
});
(0, exports.registerAccountRoute)('/omnichannel', {
    name: 'omnichannel',
    component: (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./omnichannel/OmnichannelPreferencesPage')))),
});
(0, exports.registerAccountRoute)('/feature-preview', {
    name: 'feature-preview',
    component: (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./featurePreview/AccountFeaturePreviewPage')))),
});
(0, exports.registerAccountRoute)('/accessibility-and-appearance', {
    name: 'accessibility-and-appearance',
    component: (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./accessibility/AccessibilityPage')))),
});
