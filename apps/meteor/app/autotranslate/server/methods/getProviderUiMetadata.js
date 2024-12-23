"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const meteor_1 = require("meteor/meteor");
const autotranslate_1 = require("../autotranslate");
meteor_1.Meteor.methods({
    'autoTranslate.getProviderUiMetadata'() {
        if (!meteor_1.Meteor.userId()) {
            throw new meteor_1.Meteor.Error('error-action-not-allowed', 'Login neccessary', {
                method: 'autoTranslate.getProviderUiMetadata',
            });
        }
        return Object.fromEntries(autotranslate_1.TranslationProviderRegistry.getProviders().map((provider) => {
            const { name, displayName } = provider._getProviderMetadata();
            return [name, { name, displayName }];
        }));
    },
});
