"use strict";
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
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const EditSound_1 = __importDefault(require("./EditSound"));
const Skeleton_1 = require("../../../components/Skeleton");
function EditCustomSound(_a) {
    var { _id, onChange } = _a, props = __rest(_a, ["_id", "onChange"]);
    const { t } = (0, react_i18next_1.useTranslation)();
    const getSounds = (0, ui_contexts_1.useEndpoint)('GET', '/v1/custom-sounds.list');
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const { data, isLoading, refetch } = (0, react_query_1.useQuery)(['custom-sounds', _id], () => __awaiter(this, void 0, void 0, function* () {
        const { sounds } = yield getSounds({ query: JSON.stringify({ _id }) });
        if (sounds.length === 0) {
            throw new Error(t('No_results_found'));
        }
        return sounds[0];
    }), {
        onError: (error) => {
            dispatchToastMessage({ type: 'error', message: error });
        },
    });
    if (isLoading) {
        return (0, jsx_runtime_1.jsx)(Skeleton_1.FormSkeleton, { pi: 20 });
    }
    if (!data) {
        return null;
    }
    const handleChange = () => {
        onChange === null || onChange === void 0 ? void 0 : onChange();
        refetch === null || refetch === void 0 ? void 0 : refetch();
    };
    return (0, jsx_runtime_1.jsx)(EditSound_1.default, Object.assign({ data: data, onChange: handleChange }, props));
}
exports.default = EditCustomSound;
