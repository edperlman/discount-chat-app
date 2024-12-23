"use strict";
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
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const PriorityEditForm_1 = __importDefault(require("./PriorityEditForm"));
const Skeleton_1 = require("../../components/Skeleton");
const usePriorityInfo_1 = require("../../views/omnichannel/directory/hooks/usePriorityInfo");
function PriorityEditFormWithData(_a) {
    var { priorityId } = _a, props = __rest(_a, ["priorityId"]);
    const { t } = (0, react_i18next_1.useTranslation)();
    const { data, isInitialLoading, isError } = (0, usePriorityInfo_1.usePriorityInfo)(priorityId);
    if (isInitialLoading) {
        return (0, jsx_runtime_1.jsx)(Skeleton_1.FormSkeleton, {});
    }
    if (isError || !data) {
        return ((0, jsx_runtime_1.jsx)(fuselage_1.Callout, { m: 16, type: 'danger', children: t('Not_Available') }));
    }
    return (0, jsx_runtime_1.jsx)(PriorityEditForm_1.default, Object.assign({}, props, { data: data }));
}
exports.default = PriorityEditFormWithData;
