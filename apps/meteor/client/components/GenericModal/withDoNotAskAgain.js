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
exports.withDoNotAskAgain = withDoNotAskAgain;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
function withDoNotAskAgain(Component) {
    var _a, _b;
    const WrappedComponent = function (_a) {
        var { onConfirm, dontAskAgain } = _a, props = __rest(_a, ["onConfirm", "dontAskAgain"]);
        const t = (0, ui_contexts_1.useTranslation)();
        const dontAskAgainId = (0, fuselage_hooks_1.useUniqueId)();
        const dontAskAgainList = (0, ui_contexts_1.useUserPreference)('dontAskAgainList');
        const { action, label } = dontAskAgain;
        const saveFn = (0, ui_contexts_1.useEndpoint)('POST', '/v1/users.setPreferences');
        const [state, setState] = (0, react_1.useState)(false);
        const handleConfirm = () => __awaiter(this, void 0, void 0, function* () {
            try {
                if (state) {
                    yield saveFn({ data: { dontAskAgainList: [...(dontAskAgainList || []), { action, label }] } });
                }
                yield onConfirm();
            }
            catch (e) {
                console.error(e);
            }
        });
        const onChange = () => {
            setState(!state);
        };
        return ((0, jsx_runtime_1.jsx)(Component, Object.assign({}, props, { dontAskAgain: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', children: [(0, jsx_runtime_1.jsx)(fuselage_1.CheckBox, { id: dontAskAgainId, checked: state, onChange: onChange, name: 'dont_ask_again' }), (0, jsx_runtime_1.jsx)(fuselage_1.Label, { color: 'annotation', fontScale: 'p2', mis: 8, htmlFor: dontAskAgainId, children: t('Dont_ask_me_again') })] }), onConfirm: handleConfirm })));
    };
    WrappedComponent.displayName = `withDoNotAskAgain(${(_b = (_a = Component.displayName) !== null && _a !== void 0 ? _a : Component.name) !== null && _b !== void 0 ? _b : 'Component'})`;
    return WrappedComponent;
}
