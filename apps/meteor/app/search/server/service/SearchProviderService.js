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
exports.SearchProviderService = void 0;
const highOrderFunctions_1 = require("../../../../lib/utils/highOrderFunctions");
const server_1 = require("../../../settings/server");
const logger_1 = require("../logger/logger");
class SearchProviderService {
    constructor() {
        this.providers = {};
    }
    /**
     * Stop current provider (if there is one) and start the new
     * @param id the id of the provider which should be started
     */
    use(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.providers[id]) {
                throw new Error(`provider ${id} cannot be found`);
            }
            let reason;
            if (!this.activeProvider) {
                reason = 'startup';
            }
            else if (this.activeProvider.key === this.providers[id].key) {
                reason = 'update';
            }
            else {
                reason = 'switch';
            }
            if (this.activeProvider) {
                const provider = this.activeProvider;
                logger_1.SearchLogger.debug(`Stopping provider '${provider.key}'`);
                yield new Promise((resolve) => provider.stop(resolve));
            }
            this.activeProvider = undefined;
            logger_1.SearchLogger.debug(`Start provider '${id}'`);
            yield this.providers[id].run(reason);
            this.activeProvider = this.providers[id];
        });
    }
    /**
     * Registers a search provider on system startup
     */
    register(provider) {
        this.providers[provider.key] = provider;
    }
    /**
     * Starts the service (loads provider settings for admin ui, add lister not setting changes, enable current provider
     */
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.SearchLogger.debug('Load data for all providers');
            const { providers } = this;
            // add settings for admininistration
            yield server_1.settingsRegistry.addGroup('Search', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    yield this.add('Search.Provider', 'defaultProvider', {
                        type: 'select',
                        values: Object.values(providers).map((provider) => ({
                            key: provider.key,
                            i18nLabel: provider.i18nLabel,
                        })),
                        public: true,
                        i18nLabel: 'Search_Provider',
                    });
                    yield Promise.all(Object.keys(providers)
                        .filter((key) => providers[key].settings && providers[key].settings.length > 0)
                        .map((key) => __awaiter(this, void 0, void 0, function* () {
                        yield this.section(providers[key].i18nLabel, function () {
                            return __awaiter(this, void 0, void 0, function* () {
                                yield Promise.all(providers[key].settings.map((setting) => __awaiter(this, void 0, void 0, function* () {
                                    const _options = Object.assign({ type: setting.type }, setting.options);
                                    _options.enableQuery = _options.enableQuery || [];
                                    if (!_options.enableQuery) {
                                        _options.enableQuery = [];
                                    }
                                    if (Array.isArray(_options.enableQuery)) {
                                        _options.enableQuery.push({
                                            _id: 'Search.Provider',
                                            value: key,
                                        });
                                    }
                                    yield this.add(setting.id, setting.defaultValue, _options);
                                })));
                            });
                        });
                    })));
                });
            });
            // add listener to react on setting changes
            const configProvider = (0, highOrderFunctions_1.withDebouncing)({ wait: 1000 })(() => {
                const providerId = server_1.settings.get('Search.Provider');
                if (providerId) {
                    void this.use(providerId); // TODO do something with success and errors
                }
            });
            server_1.settings.watchByRegex(/^Search\./, configProvider);
        });
    }
}
exports.SearchProviderService = SearchProviderService;
