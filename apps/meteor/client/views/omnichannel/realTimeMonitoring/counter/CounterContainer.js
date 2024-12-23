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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const CounterItem_1 = __importDefault(require("./CounterItem"));
const CounterRow_1 = __importDefault(require("./CounterRow"));
const useAsyncState_1 = require("../../../../hooks/useAsyncState");
const CounterContainer = (_a) => {
    var { data, state, initialData } = _a, props = __rest(_a, ["data", "state", "initialData"]);
    const { t } = (0, react_i18next_1.useTranslation)();
    const [displayData, setDisplayData] = (0, react_1.useState)(initialData);
    const { totalizers } = data || { totalizers: initialData };
    (0, react_1.useEffect)(() => {
        if (state === useAsyncState_1.AsyncStatePhase.RESOLVED) {
            setDisplayData(totalizers);
        }
    }, [state, t, totalizers]);
    return ((0, jsx_runtime_1.jsx)(CounterRow_1.default, Object.assign({}, props, { children: displayData.map(({ title, value }, i) => ((0, jsx_runtime_1.jsx)(CounterItem_1.default, { title: title ? t(title) : (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { width: 'x60' }), count: value }, i))) })));
};
exports.default = CounterContainer;
