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
const AppReleasesItem_1 = __importDefault(require("./AppReleasesItem"));
const AccordionLoading_1 = __importDefault(require("../../../components/AccordionLoading"));
const AppReleases = ({ id }) => {
    const getVersions = (0, ui_contexts_1.useEndpoint)('GET', '/apps/:id/versions', { id });
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const { data, isLoading, isFetched } = (0, react_query_1.useQuery)(['apps', id, 'versions'], () => __awaiter(void 0, void 0, void 0, function* () {
        const { apps } = yield getVersions();
        if (apps.length === 0) {
            throw new Error(t('No_results_found'));
        }
        return apps;
    }), {
        onError: (error) => {
            dispatchToastMessage({ type: 'error', message: error });
        },
    });
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Accordion, { width: '100%', alignSelf: 'center', children: [isLoading && (0, jsx_runtime_1.jsx)(AccordionLoading_1.default, {}), isFetched && (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: data === null || data === void 0 ? void 0 : data.map((release) => (0, jsx_runtime_1.jsx)(AppReleasesItem_1.default, { release: release }, release.version)) })] }) }));
};
exports.default = AppReleases;
