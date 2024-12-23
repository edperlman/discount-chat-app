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
const meteor_1 = require("meteor/meteor");
const logger_1 = require("./logger/logger");
const service_1 = require("./service");
meteor_1.Meteor.methods({
    /**
     * Get the current provider with key, description, resultTemplate, suggestionItemTemplate and settings (as Map)
     */
    'rocketchatSearch.getProvider'() {
        const provider = service_1.searchProviderService.activeProvider;
        if (!provider) {
            return undefined;
        }
        return {
            key: provider.key,
            description: provider.i18nDescription,
            icon: provider.iconName,
            resultTemplate: provider.resultTemplate,
            supportsSuggestions: provider.supportsSuggestions,
            suggestionItemTemplate: provider.suggestionItemTemplate,
            settings: Object.fromEntries(Object.values(provider.settingsAsMap).map((setting) => [setting.key, setting.value])),
        };
    },
    /**
     * Search using the current search provider and check if results are valid for the user. The search result has
     * the format `{messages:{start:0,numFound:1,docs:[{...}]},users:{...},rooms:{...}}`
     * @param text the search text
     * @param context the context (uid, rid)
     * @param payload custom payload (e.g. for paging)
     */
    'rocketchatSearch.search'(text, context, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            payload = payload !== null ? payload : undefined; // TODO is this cleanup necessary?
            if (!service_1.searchProviderService.activeProvider) {
                throw new Error('Provider currently not active');
            }
            logger_1.SearchLogger.debug({ msg: 'search', text, context, payload });
            return new Promise((resolve, reject) => {
                var _a;
                (_a = service_1.searchProviderService.activeProvider) === null || _a === void 0 ? void 0 : _a.search(text, context, payload, (error, data) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(data);
                });
            }).then((result) => service_1.validationService.validateSearchResult(result));
        });
    },
    'rocketchatSearch.suggest'(text, context, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            payload !== null && payload !== void 0 ? payload : (payload = undefined); // TODO is this cleanup necessary?
            if (!service_1.searchProviderService.activeProvider) {
                throw new Error('Provider currently not active');
            }
            logger_1.SearchLogger.debug({ msg: 'suggest', text, context, payload });
            return new Promise((resolve, reject) => {
                var _a;
                (_a = service_1.searchProviderService.activeProvider) === null || _a === void 0 ? void 0 : _a.suggest(text, context, payload, (error, data) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(data);
                });
            });
        });
    },
});
