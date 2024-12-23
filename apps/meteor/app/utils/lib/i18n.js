"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyCustomTranslations = exports.defaultTranslationNamespace = exports.availableTranslationNamespaces = exports.extractTranslationKeys = exports.extractTranslationNamespaces = exports.t = exports.addSprinfToI18n = exports.i18n = void 0;
const i18next_1 = __importDefault(require("i18next"));
const i18next_sprintf_postprocessor_1 = __importDefault(require("i18next-sprintf-postprocessor"));
const isObject_1 = require("../../../lib/utils/isObject");
exports.i18n = i18next_1.default.use(i18next_sprintf_postprocessor_1.default);
const addSprinfToI18n = function (t) {
    return function (key, ...replaces) {
        if (replaces[0] === undefined) {
            return t(key);
        }
        if ((0, isObject_1.isObject)(replaces[0]) && !Array.isArray(replaces[0])) {
            return t(key, replaces[0]);
        }
        return t(key, {
            postProcess: 'sprintf',
            sprintf: replaces,
        });
    };
};
exports.addSprinfToI18n = addSprinfToI18n;
exports.t = (0, exports.addSprinfToI18n)(exports.i18n.t.bind(exports.i18n));
/**
 * Extract the translation keys from a flat object and group them by namespace
 *
 * Example:
 *
 * ```js
 * const source = {
 *   'core.key1': 'value1',
 *   'core.key2': 'value2',
 *   'onboarding.key1': 'value1',
 *   'onboarding.key2': 'value2',
 *   'registration.key1': 'value1',
 *   'registration.key2': 'value2',
 *   'cloud.key1': 'value1',
 *   'cloud.key2': 'value2',
 *   'subscription.key1': 'value1',
 *   'subscription.key2': 'value2',
 * };
 *
 * const result = extractTranslationNamespaces(source);
 *
 * console.log(result);
 *
 * // {
 * //   core: {
 * //     key1: 'value1',
 * //     key2: 'value2'
 * //   },
 * //   onboarding: {
 * //     key1: 'value1',
 * //     key2: 'value2'
 * //   },
 * //   registration: {
 * //     key1: 'value1',
 * //     key2: 'value2'
 * //   },
 * //   cloud: {
 * //     key1: 'value1',
 * //     key2: 'value2'
 * //   },
 * //   subscription: {
 * //     key1: 'value1',
 * //     key2: 'value2'
 * //   }
 * // }
 * ```
 *
 * @param source the flat object with the translation keys
 */
const extractTranslationNamespaces = (source) => {
    const result = {
        core: {},
        onboarding: {},
        registration: {},
        cloud: {},
        subscription: {},
    };
    for (const [key, value] of Object.entries(source)) {
        const prefix = exports.availableTranslationNamespaces.find((namespace) => key.startsWith(`${namespace}.`));
        const keyWithoutNamespace = prefix ? key.slice(prefix.length + 1) : key;
        const ns = prefix !== null && prefix !== void 0 ? prefix : exports.defaultTranslationNamespace;
        result[ns][keyWithoutNamespace] = value;
    }
    return result;
};
exports.extractTranslationNamespaces = extractTranslationNamespaces;
/**
 * Extract only the translation keys that match the given namespaces
 *
 * @param source the flat object with the translation keys
 * @param namespaces the namespaces to extract
 */
const extractTranslationKeys = (source, namespaces = []) => {
    const all = (0, exports.extractTranslationNamespaces)(source);
    return Array.isArray(namespaces)
        ? namespaces.reduce((result, namespace) => (Object.assign(Object.assign({}, result), all[namespace])), {})
        : all[namespaces];
};
exports.extractTranslationKeys = extractTranslationKeys;
const namespacesMap = {
    core: true,
    onboarding: true,
    registration: true,
    cloud: true,
    subscription: true,
};
exports.availableTranslationNamespaces = Object.keys(namespacesMap);
exports.defaultTranslationNamespace = 'core';
const applyCustomTranslations = (i18n, parsedCustomTranslations, { namespaces, languages } = {}) => {
    for (const [lng, translations] of Object.entries(parsedCustomTranslations)) {
        if (languages && !languages.includes(lng)) {
            continue;
        }
        for (const [key, value] of Object.entries(translations)) {
            const prefix = exports.availableTranslationNamespaces.find((namespace) => key.startsWith(`${namespace}.`));
            const keyWithoutNamespace = prefix ? key.slice(prefix.length + 1) : key;
            const ns = prefix !== null && prefix !== void 0 ? prefix : exports.defaultTranslationNamespace;
            if (namespaces && !namespaces.includes(ns)) {
                continue;
            }
            i18n.addResourceBundle(lng, ns, { [keyWithoutNamespace]: value }, true, true);
        }
    }
};
exports.applyCustomTranslations = applyCustomTranslations;
