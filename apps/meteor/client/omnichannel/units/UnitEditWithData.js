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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const UnitEdit_1 = __importDefault(require("./UnitEdit"));
const Contextualbar_1 = require("../../components/Contextualbar");
const UnitEditWithData = ({ unitId }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const getUnitById = (0, ui_contexts_1.useEndpoint)('GET', '/v1/livechat/units/:id', { id: unitId });
    const getMonitorsByUnitId = (0, ui_contexts_1.useEndpoint)('GET', '/v1/livechat/units/:unitId/monitors', { unitId });
    const getDepartmentsByUnitId = (0, ui_contexts_1.useEndpoint)('GET', '/v1/livechat/units/:unitId/departments', { unitId });
    const { data: unitData, isError, isLoading, } = (0, react_query_1.useQuery)(['livechat-getUnitById', unitId], () => __awaiter(void 0, void 0, void 0, function* () { return getUnitById(); }), { refetchOnWindowFocus: false });
    const { data: unitMonitors, isError: unitMonitorsError, isLoading: unitMonitorsLoading, } = (0, react_query_1.useQuery)(['livechat-getMonitorsByUnitId', unitId], () => __awaiter(void 0, void 0, void 0, function* () { return getMonitorsByUnitId({ unitId }); }), { refetchOnWindowFocus: false });
    const { data: unitDepartments, isError: unitDepartmentsError, isLoading: unitDepartmentsLoading, } = (0, react_query_1.useQuery)(['livechat-getDepartmentsByUnitId', unitId], () => __awaiter(void 0, void 0, void 0, function* () { return getDepartmentsByUnitId({ unitId }); }), {
        refetchOnWindowFocus: false,
    });
    if (isLoading || unitMonitorsLoading || unitDepartmentsLoading) {
        return (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarSkeleton, {});
    }
    if (isError || unitMonitorsError || unitDepartmentsError) {
        return ((0, jsx_runtime_1.jsx)(fuselage_1.Callout, { m: 16, type: 'danger', children: t('Not_Available') }));
    }
    return (0, jsx_runtime_1.jsx)(UnitEdit_1.default, { unitData: unitData, unitMonitors: unitMonitors.monitors, unitDepartments: unitDepartments.departments });
};
exports.default = UnitEditWithData;
