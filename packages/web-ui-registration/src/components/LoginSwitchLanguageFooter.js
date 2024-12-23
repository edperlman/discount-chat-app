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
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const layout_1 = require("@rocket.chat/layout");
const tools_1 = require("@rocket.chat/tools");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const useSuggestedLanguages = (_a) => {
    var _b;
    var { browserLanguage = (0, tools_1.normalizeLanguage)((_b = window.navigator.language) !== null && _b !== void 0 ? _b : 'en'), } = _a;
    const availableLanguages = (0, ui_contexts_1.useLanguages)();
    const currentLanguage = (0, ui_contexts_1.useLanguage)();
    const serverLanguage = (0, tools_1.normalizeLanguage)((0, ui_contexts_1.useSetting)('Language', 'en'));
    const suggestions = (0, react_1.useMemo)(() => {
        const potentialLanguages = new Set([serverLanguage, browserLanguage, 'en'].map(tools_1.normalizeLanguage));
        const potentialSuggestions = Array.from(potentialLanguages).map((potentialLanguageKey) => availableLanguages.find((language) => language.key === potentialLanguageKey));
        return potentialSuggestions.filter((language) => {
            return !!language && language.key !== currentLanguage;
        });
    }, [serverLanguage, browserLanguage, availableLanguages, currentLanguage]);
    const { i18n } = (0, react_i18next_1.useTranslation)();
    (0, react_1.useEffect)(() => {
        i18n.loadLanguages(suggestions.map((suggestion) => suggestion.key));
    }, [i18n, suggestions]);
    return { suggestions };
};
const LoginSwitchLanguageFooter = (_a) => {
    var _b;
    var { browserLanguage = (0, tools_1.normalizeLanguage)((_b = window.navigator.language) !== null && _b !== void 0 ? _b : 'en'), } = _a;
    const loadLanguage = (0, ui_contexts_1.useLoadLanguage)();
    const { suggestions } = useSuggestedLanguages({ browserLanguage });
    const [, setPreferedLanguage] = (0, fuselage_hooks_1.useLocalStorage)('preferedLanguage', '');
    const handleSwitchLanguageClick = (language) => (event) => __awaiter(void 0, void 0, void 0, function* () {
        event.preventDefault();
        yield loadLanguage(language.key);
        setPreferedLanguage(language.key);
    });
    if (!suggestions.length) {
        return null;
    }
    return ((0, jsx_runtime_1.jsx)(layout_1.HorizontalWizardLayoutCaption, { children: suggestions.map((suggestion) => ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { secondary: true, small: true, mie: 8, onClick: handleSwitchLanguageClick(suggestion), children: (0, jsx_runtime_1.jsxs)(react_i18next_1.Trans, { i18nKey: 'registration.component.switchLanguage', tOptions: { lng: suggestion.key }, children: ["Change to", ' ', (0, jsx_runtime_1.jsx)("strong", { children: (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: { name: suggestion.ogName } }) })] }) }, suggestion.key))) }));
};
exports.default = LoginSwitchLanguageFooter;
