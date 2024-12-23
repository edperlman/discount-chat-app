"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchProvider = void 0;
const Settings_1 = require("./Settings");
const logger_1 = require("../logger/logger");
class SearchProvider {
    /**
     * Create search provider, key must match /^[A-Za-z0-9]+$/
     */
    constructor(key) {
        if (!key.match(/^[A-Za-z0-9]+$/)) {
            throw new Error(`cannot instantiate provider: ${key} does not match key-pattern`);
        }
        logger_1.SearchLogger.info(`create search provider ${key}`);
        this._key = key;
        this._settings = new Settings_1.Settings(key);
    }
    /* --- basic params ---*/
    get key() {
        return this._key;
    }
    get iconName() {
        return 'magnifier';
    }
    get settings() {
        return this._settings.list();
    }
    get settingsAsMap() {
        return this._settings.map();
    }
    /* --- templates ---*/
    get resultTemplate() {
        return 'DefaultSearchResultTemplate';
    }
    get suggestionItemTemplate() {
        return 'DefaultSuggestionItemTemplate';
    }
    /**
     * Returns an ordered list of suggestions. The result should have at least the form [{text:string}]
     * @param _text the search text
     * @param _context the context (uid, rid)
     * @param _payload custom payload (e.g. for paging)
     * @param callback is used to return result an can be called with (error,result)
     */
    suggest(_text, _context, _payload, callback) {
        callback === null || callback === void 0 ? void 0 : callback(null, []);
    }
    get supportsSuggestions() {
        return false;
    }
    /* --- triggers ---*/
    on(_name, _value) {
        return true;
    }
    /* --- livecycle ---*/
    run(reason) {
        return new Promise((resolve, reject) => {
            this._settings.load();
            this.start(reason, resolve, reject);
        });
    }
    start(_reason, resolve, _reject) {
        resolve(undefined);
    }
    stop(resolve) {
        resolve();
    }
}
exports.SearchProvider = SearchProvider;
