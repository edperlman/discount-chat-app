"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTranslationsForApps = void 0;
const tools_1 = require("@rocket.chat/tools");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const highOrderFunctions_1 = require("../../lib/utils/highOrderFunctions");
const useTranslationsForApps = () => {
    const getAppsLanguages = (0, ui_contexts_1.useEndpoint)('GET', '/apps/languages');
    const { isSuccess, data } = (0, react_query_1.useQuery)({
        queryKey: ['apps', 'translations'],
        queryFn: () => getAppsLanguages(),
        staleTime: Infinity,
    });
    const { i18n } = (0, react_i18next_1.useTranslation)();
    (0, react_1.useEffect)(() => {
        if (!isSuccess) {
            return;
        }
        data.apps.forEach(({ id: appId, languages }) => {
            Object.entries(languages).forEach(([language, translations]) => {
                const normalizedLanguage = (0, tools_1.normalizeLanguage)(language);
                const namespace = `app-${appId}`;
                i18n.addResourceBundle(normalizedLanguage, namespace, translations);
            });
        });
    }, [i18n, data, isSuccess]);
    const queryClient = (0, react_query_1.useQueryClient)();
    const subscribeToApps = (0, ui_contexts_1.useStream)('apps');
    const uid = (0, ui_contexts_1.useUserId)();
    (0, react_1.useEffect)(() => {
        if (!uid) {
            return;
        }
        const invalidate = (0, highOrderFunctions_1.withDebouncing)({ wait: 100 })(() => {
            queryClient.invalidateQueries(['apps', 'translations']);
        });
        const unsubscribe = subscribeToApps('apps', ([key]) => {
            if (key === 'app/added') {
                invalidate();
            }
        });
        return () => {
            unsubscribe();
            invalidate.cancel();
        };
    }, [uid, subscribeToApps, queryClient]);
};
exports.useTranslationsForApps = useTranslationsForApps;
