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
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const AppSetting_1 = __importDefault(require("./AppSetting"));
const useAppTranslation_1 = require("../../../hooks/useAppTranslation");
const AppSettings = ({ settings }) => {
    const appId = (0, ui_contexts_1.useRouteParameter)('id');
    const tApp = (0, useAppTranslation_1.useAppTranslation)(appId || '');
    const groupedSettings = (0, react_1.useMemo)(() => {
        const groups = Object.values(settings).reduce((acc, setting) => {
            const section = setting.section || 'general';
            if (!acc[section]) {
                acc[section] = [];
            }
            acc[section].push(setting);
            return acc;
        }, {});
        return Object.entries(groups);
    }, [settings]);
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', flexDirection: 'column', maxWidth: 'x640', w: 'full', marginInline: 'auto', children: (0, jsx_runtime_1.jsx)(fuselage_1.Accordion, { children: groupedSettings.map(([section, sectionSettings], index) => ((0, jsx_runtime_1.jsx)(fuselage_1.AccordionItem, { title: tApp(section), defaultExpanded: index === 0, children: (0, jsx_runtime_1.jsx)(fuselage_1.FieldGroup, { children: sectionSettings.map((field) => ((0, jsx_runtime_1.jsx)(AppSetting_1.default, Object.assign({}, field), field.id))) }) }, section))) }) }));
};
exports.default = AppSettings;
