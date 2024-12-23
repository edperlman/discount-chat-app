"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const AppErrorPage = (_props) => {
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', justifyContent: 'center', height: 'full', backgroundColor: 'surface', children: (0, jsx_runtime_1.jsxs)(fuselage_1.States, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.StatesIcon, { name: 'error-circle' }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesTitle, { children: "Application Error" }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesSubtitle, { children: "The application GUI just crashed." }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesActions, { children: (0, jsx_runtime_1.jsx)(fuselage_1.StatesAction, { onClick: () => {
                            const result = indexedDB.deleteDatabase('MeteorDynamicImportCache');
                            result.onsuccess = () => {
                                window.location.reload();
                            };
                            result.onerror = () => {
                                window.location.reload();
                            };
                        }, children: "Reload Application" }) })] }) }));
};
exports.default = AppErrorPage;
