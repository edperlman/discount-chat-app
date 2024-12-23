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
const react_1 = require("react");
const onToggledFeature_1 = require("../lib/onToggledFeature");
const account_1 = require("../views/account");
const [registerAccountRouter, unregisterAccountRouter] = (0, account_1.registerAccountRoute)('/manage-devices', {
    name: 'manage-devices',
    component: (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('../views/account/deviceManagement/DeviceManagementAccountPage')))),
});
(0, onToggledFeature_1.onToggledFeature)('device-management', {
    up: () => {
        (0, account_1.registerAccountSidebarItem)({
            href: '/account/manage-devices',
            i18nLabel: 'Manage_Devices',
            icon: 'mobile',
        });
        registerAccountRouter();
    },
    down: () => {
        (0, account_1.unregisterSidebarItem)('Manage_Devices');
        unregisterAccountRouter();
    },
});
