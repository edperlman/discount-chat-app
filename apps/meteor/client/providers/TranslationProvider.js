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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const languages_1 = __importDefault(require("@rocket.chat/i18n/dist/languages"));
const en_i18n_json_1 = __importDefault(require("@rocket.chat/i18n/src/locales/en.i18n.json"));
const tools_1 = require("@rocket.chat/tools");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const i18next_http_backend_1 = __importDefault(require("i18next-http-backend"));
const moment_1 = __importDefault(require("moment"));
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const client_1 = require("../../app/utils/client");
const i18n_1 = require("../../app/utils/lib/i18n");
const orchestrator_1 = require("../apps/orchestrator");
const loggedIn_1 = require("../lib/loggedIn");
const isRTLScriptLanguage_1 = require("../lib/utils/isRTLScriptLanguage");
i18n_1.i18n.use(i18next_http_backend_1.default).use(react_i18next_1.initReactI18next);
const useCustomTranslations = (i18n) => {
    const customTranslations = (0, ui_contexts_1.useSetting)('Custom_Translations');
    const parsedCustomTranslations = (0, react_1.useMemo)(() => {
        if (!customTranslations || typeof customTranslations !== 'string') {
            return undefined;
        }
        try {
            return JSON.parse(customTranslations);
        }
        catch (e) {
            console.error(e);
            return undefined;
        }
    }, [customTranslations]);
    (0, react_1.useEffect)(() => {
        if (!parsedCustomTranslations) {
            return;
        }
        (0, i18n_1.applyCustomTranslations)(i18n, parsedCustomTranslations);
        const handleLanguageChanged = () => {
            (0, i18n_1.applyCustomTranslations)(i18n, parsedCustomTranslations);
        };
        i18n.on('languageChanged', handleLanguageChanged);
        return () => {
            i18n.off('languageChanged', handleLanguageChanged);
        };
    }, [i18n, parsedCustomTranslations]);
};
const localeCache = new Map();
let isI18nInitialized = false;
const useI18next = (lng) => {
    // i18n.init is async, so there's a chance a race condition happens and it is initialized twice
    // This breaks translations because it loads `lng` in the first init but not the second.
    if (!isI18nInitialized) {
        isI18nInitialized = true;
        i18n_1.i18n.init({
            lng,
            fallbackLng: 'en',
            ns: i18n_1.availableTranslationNamespaces,
            defaultNS: i18n_1.defaultTranslationNamespace,
            nsSeparator: '.',
            resources: {
                en: (0, i18n_1.extractTranslationNamespaces)(en_i18n_json_1.default),
            },
            partialBundledLanguages: true,
            backend: {
                loadPath: 'i18n/{{lng}}.json',
                parse: (data, _lngs, namespaces = []) => (0, i18n_1.extractTranslationKeys)(JSON.parse(data), namespaces),
                request: (_options, url, _payload, callback) => {
                    const params = url.split('/');
                    const lng = params[params.length - 1];
                    let promise = localeCache.get(lng);
                    if (!promise) {
                        promise = fetch((0, client_1.getURL)(url)).then((res) => res.text());
                        localeCache.set(lng, promise);
                    }
                    promise.then((res) => callback(null, { data: res, status: 200 }), () => callback(null, { data: '', status: 500 }));
                },
            },
            react: {
                useSuspense: true,
                bindI18n: 'languageChanged loaded',
                bindI18nStore: 'added removed',
            },
            interpolation: {
                escapeValue: false,
            },
        });
    }
    (0, react_1.useEffect)(() => {
        i18n_1.i18n.changeLanguage(lng);
    }, [lng]);
    return i18n_1.i18n;
};
const useAutoLanguage = () => {
    var _a, _b;
    const serverLanguage = (0, ui_contexts_1.useSetting)('Language', '');
    const browserLanguage = (0, tools_1.normalizeLanguage)((_a = window.navigator.userLanguage) !== null && _a !== void 0 ? _a : window.navigator.language);
    const defaultUserLanguage = browserLanguage || serverLanguage || 'en';
    // if the language is supported, if not remove the region
    const suggestedLanguage = languages_1.default.includes(defaultUserLanguage)
        ? defaultUserLanguage
        : ((_b = defaultUserLanguage.split('-').shift()) !== null && _b !== void 0 ? _b : 'en');
    // usually that value is set based on the user's config language
    const [language] = (0, fuselage_hooks_1.useLocalStorage)('userLanguage', suggestedLanguage);
    document.documentElement.classList[(0, isRTLScriptLanguage_1.isRTLScriptLanguage)(language) ? 'add' : 'remove']('rtl');
    document.documentElement.setAttribute('dir', (0, isRTLScriptLanguage_1.isRTLScriptLanguage)(language) ? 'rtl' : 'ltr');
    document.documentElement.lang = language;
    // if user has no language set, we should set it to the default language
    return language || suggestedLanguage;
};
const getLanguageName = (code, lng) => {
    var _a;
    try {
        const lang = new Intl.DisplayNames([lng], { type: 'language' });
        return (_a = lang.of(code)) !== null && _a !== void 0 ? _a : code;
    }
    catch (e) {
        return code;
    }
};
const TranslationProvider = ({ children }) => {
    const loadLocale = (0, ui_contexts_1.useMethod)('loadLocale');
    const language = useAutoLanguage();
    const i18nextInstance = useI18next(language);
    useCustomTranslations(i18nextInstance);
    const availableLanguages = (0, react_1.useMemo)(() => [
        {
            en: 'Default',
            name: i18nextInstance.t('Default'),
            ogName: i18nextInstance.t('Default'),
            key: '',
        },
        ...[...new Set([...i18nextInstance.languages, ...languages_1.default])]
            .map((key) => ({
            en: key,
            name: getLanguageName(key, language),
            ogName: getLanguageName(key, key),
            key,
        }))
            .sort(({ name: nameA }, { name: nameB }) => nameA.localeCompare(nameB)),
    ], [language, i18nextInstance]);
    (0, react_1.useEffect)(() => {
        if (moment_1.default.locales().includes(language.toLowerCase())) {
            moment_1.default.locale(language);
            return;
        }
        const locale = !availableLanguages.find((lng) => lng.key === language) ? language.split('-').shift() : language;
        loadLocale(locale !== null && locale !== void 0 ? locale : language)
            .then((localeSrc) => {
            localeSrc && Function(localeSrc).call({ moment: moment_1.default });
            moment_1.default.locale(language);
        })
            .catch((error) => {
            moment_1.default.locale('en');
            console.error('Error loading moment locale:', error);
        });
    }, [language, loadLocale, availableLanguages]);
    (0, react_1.useEffect)(() => (0, loggedIn_1.onLoggedIn)(() => {
        orchestrator_1.AppClientOrchestratorInstance.getAppClientManager().initialize();
        orchestrator_1.AppClientOrchestratorInstance.load();
    }), []);
    return ((0, jsx_runtime_1.jsx)(react_i18next_1.I18nextProvider, { i18n: i18nextInstance, children: (0, jsx_runtime_1.jsx)(TranslationProviderInner, { children: children, availableLanguages: availableLanguages }) }));
};
/**
 * I was forced to create this component to keep the api useTranslation from rocketchat
 * rocketchat useTranslation invalidates the provider content, triggering all the places that use it
 * i18next triggers a re-render inside useTranslation, since now we are using 100% of the i18next
 * the only way to invalidate after changing the language in a safe way is using the useTranslation from i8next
 * and invalidating the provider content
 */
// eslint-disable-next-line react/no-multi-comp
const TranslationProviderInner = ({ children, availableLanguages, }) => {
    const { t, i18n } = (0, react_i18next_1.useTranslation)();
    const value = (0, react_1.useMemo)(() => ({
        language: i18n.language,
        languages: availableLanguages,
        loadLanguage: (language) => __awaiter(void 0, void 0, void 0, function* () {
            i18n.changeLanguage(language);
        }),
        translate: Object.assign((0, i18n_1.addSprinfToI18n)(t), {
            has: ((key, options) => key && i18n.exists(key, options)),
        }),
    }), [availableLanguages, i18n, t]);
    return (0, jsx_runtime_1.jsx)(ui_contexts_1.TranslationContext.Provider, { children: children, value: value });
};
exports.default = TranslationProvider;
