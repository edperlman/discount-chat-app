"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultProvider = void 0;
const meteor_1 = require("meteor/meteor");
const SearchProvider_1 = require("../model/SearchProvider");
/**
 * Implements the default provider (based on mongo db search)
 */
class DefaultProvider extends SearchProvider_1.SearchProvider {
    /**
     * Enable settings: GlobalSearchEnabled, PageSize
     */
    constructor() {
        super('defaultProvider');
        this._settings.add('GlobalSearchEnabled', 'boolean', false, {
            i18nLabel: 'Global_Search',
            alert: 'This feature is currently in beta and could decrease the application performance',
        });
        this._settings.add('PageSize', 'int', 10, {
            i18nLabel: 'Search_Page_Size',
        });
    }
    get i18nLabel() {
        return 'Default_provider';
    }
    get i18nDescription() {
        return 'You_can_search_using_RegExp_eg';
    }
    /**
     * Uses Meteor function 'messageSearch'
     */
    search(text, context, payload = {}, callback) {
        const _rid = payload.searchAll ? undefined : context.rid;
        const _limit = payload.limit || this._settings.get('PageSize');
        meteor_1.Meteor.call('messageSearch', text, _rid, _limit, callback);
    }
}
exports.DefaultProvider = DefaultProvider;
