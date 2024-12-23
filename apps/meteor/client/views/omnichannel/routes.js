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
exports.registerOmnichannelRoute = void 0;
const react_1 = require("react");
const createRouteGroup_1 = require("../../lib/createRouteGroup");
exports.registerOmnichannelRoute = (0, createRouteGroup_1.createRouteGroup)('omnichannel', '/omnichannel', (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./OmnichannelRouter')))));
(0, exports.registerOmnichannelRoute)('/installation', {
    name: 'omnichannel-installation',
    component: (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./installation/Installation')))),
});
(0, exports.registerOmnichannelRoute)('/managers', {
    name: 'omnichannel-managers',
    component: (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./managers/ManagersRoute')))),
});
(0, exports.registerOmnichannelRoute)('/agents/:context?/:id?', {
    name: 'omnichannel-agents',
    component: (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./agents/AgentsPage')))),
});
(0, exports.registerOmnichannelRoute)('/webhooks', {
    name: 'omnichannel-webhooks',
    component: (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./webhooks/WebhooksPageContainer')))),
});
(0, exports.registerOmnichannelRoute)('/customfields/:context?/:id?', {
    name: 'omnichannel-customfields',
    component: (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./customFields/CustomFieldsRoute')))),
});
(0, exports.registerOmnichannelRoute)('/appearance', {
    name: 'omnichannel-appearance',
    component: (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./appearance/AppearancePageContainer')))),
});
(0, exports.registerOmnichannelRoute)('/businessHours/:context?/:type?/:id?', {
    name: 'omnichannel-businessHours',
    component: (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./businessHours/BusinessHoursRouter')))),
});
(0, exports.registerOmnichannelRoute)('/units/:context?/:id?', {
    name: 'omnichannel-units',
    component: (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('../../omnichannel/units/UnitsRoute')))),
});
(0, exports.registerOmnichannelRoute)('/tags/:context?/:id?', {
    name: 'omnichannel-tags',
    component: (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('../../omnichannel/tags/TagsRoute')))),
});
(0, exports.registerOmnichannelRoute)('/triggers/:context?/:id?', {
    name: 'omnichannel-triggers',
    component: (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./triggers/TriggersRoute')))),
});
(0, exports.registerOmnichannelRoute)('/current/:id?/:tab?/:context?', {
    name: 'omnichannel-current-chats',
    component: (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./currentChats/CurrentChatsRoute')))),
});
(0, exports.registerOmnichannelRoute)('/departments/:context?/:id?/:tab?', {
    name: 'omnichannel-departments',
    component: (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./departments/DepartmentsRoute')))),
});
(0, exports.registerOmnichannelRoute)('/realtime-monitoring', {
    name: 'omnichannel-realTime',
    component: (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./realTimeMonitoring/RealTimeMonitoringPage')))),
});
(0, exports.registerOmnichannelRoute)('/analytics', {
    name: 'omnichannel-analytics',
    component: (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./analytics/AnalyticsPage')))),
});
