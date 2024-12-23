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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const EditOauthApp_1 = __importDefault(require("./EditOauthApp"));
const Skeleton_1 = require("../../../components/Skeleton");
const EditOauthAppWithData = (_a) => {
    var { _id } = _a, props = __rest(_a, ["_id"]);
    const { t } = (0, react_i18next_1.useTranslation)();
    const getOauthApps = (0, ui_contexts_1.useEndpoint)('GET', '/v1/oauth-apps.get');
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const { data, isLoading, error, refetch } = (0, react_query_1.useQuery)(['oauth-apps', _id], () => __awaiter(void 0, void 0, void 0, function* () {
        const oauthApps = yield getOauthApps({ _id });
        return oauthApps;
    }), {
        onError: (error) => dispatchToastMessage({ type: 'error', message: error }),
    });
    const onChange = (0, react_1.useCallback)(() => {
        refetch();
    }, [refetch]);
    if (isLoading) {
        return (0, jsx_runtime_1.jsx)(Skeleton_1.FormSkeleton, { pi: 20 });
    }
    if (error || !data || !_id) {
        return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'h2', pb: 20, children: t('error-application-not-found') }));
    }
    return (0, jsx_runtime_1.jsx)(EditOauthApp_1.default, Object.assign({ data: data.oauthApp, onChange: onChange }, props));
};
exports.default = EditOauthAppWithData;
