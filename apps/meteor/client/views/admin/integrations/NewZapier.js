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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const blogSpotStyleScriptImport = (src) => new Promise((resolve) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    document.body.appendChild(script);
    const resolveFunc = (event) => resolve(event.currentTarget);
    script.addEventListener('readystatechange', (event) => resolveFunc(event));
    script.addEventListener('load', (event) => resolveFunc(event));
    script.src = src;
});
const NewZapier = (_a) => {
    var props = __rest(_a, []);
    const { t } = (0, react_i18next_1.useTranslation)();
    const [script, setScript] = (0, react_1.useState)();
    (0, react_1.useEffect)(() => {
        const importZapier = () => __awaiter(void 0, void 0, void 0, function* () {
            const scriptEl = yield blogSpotStyleScriptImport('https://zapier.com/apps/embed/widget.js?services=rocketchat&html_id=zapier-goes-here');
            setScript(scriptEl);
        });
        if (!script) {
            importZapier();
        }
        return () => {
            var _a;
            if (script) {
                (_a = script.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(script);
            }
        };
    }, [script]);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Callout, { type: 'warning', icon: 'warning', title: t('Zapier_integration_has_been_deprecated'), mbs: 16, mbe: 4, children: t('Install_Zapier_from_marketplace') }), !script && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', flexDirection: 'column', alignItems: 'stretch', mbs: 10, children: (0, jsx_runtime_1.jsxs)(fuselage_1.Margins, { blockEnd: 14, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { variant: 'rect', height: 71 }), (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { variant: 'rect', height: 71 }), (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { variant: 'rect', height: 71 }), (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { variant: 'rect', height: 71 }), (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { variant: 'rect', height: 71 })] }) })), (0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({ id: 'zapier-goes-here' }, props))] }));
};
exports.default = NewZapier;
