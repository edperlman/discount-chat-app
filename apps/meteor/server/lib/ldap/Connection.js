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
exports.LDAPConnection = void 0;
const ldapjs_1 = __importDefault(require("ldapjs"));
const Logger_1 = require("./Logger");
const getLDAPConditionalSetting_1 = require("./getLDAPConditionalSetting");
const server_1 = require("../../../app/settings/server");
const arrayUtils_1 = require("../../../lib/utils/arrayUtils");
class LDAPConnection {
    constructor() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
        this.ldapjs = ldapjs_1.default;
        this.connected = false;
        this._receivedResponse = false;
        this._connectionTimedOut = false;
        this.options = {
            host: (_a = server_1.settings.get('LDAP_Host')) !== null && _a !== void 0 ? _a : '',
            port: (_b = server_1.settings.get('LDAP_Port')) !== null && _b !== void 0 ? _b : 389,
            reconnect: (_c = server_1.settings.get('LDAP_Reconnect')) !== null && _c !== void 0 ? _c : false,
            timeout: (_d = server_1.settings.get('LDAP_Timeout')) !== null && _d !== void 0 ? _d : 60000,
            connectionTimeout: (_e = server_1.settings.get('LDAP_Connect_Timeout')) !== null && _e !== void 0 ? _e : 1000,
            idleTimeout: (_f = server_1.settings.get('LDAP_Idle_Timeout')) !== null && _f !== void 0 ? _f : 1000,
            encryption: (_g = server_1.settings.get('LDAP_Encryption')) !== null && _g !== void 0 ? _g : 'plain',
            caCert: server_1.settings.get('LDAP_CA_Cert'),
            rejectUnauthorized: server_1.settings.get('LDAP_Reject_Unauthorized') || false,
            baseDN: (_h = server_1.settings.get('LDAP_BaseDN')) !== null && _h !== void 0 ? _h : '',
            userSearchFilter: (_j = server_1.settings.get('LDAP_User_Search_Filter')) !== null && _j !== void 0 ? _j : '',
            userSearchScope: (_k = server_1.settings.get('LDAP_User_Search_Scope')) !== null && _k !== void 0 ? _k : 'sub',
            userSearchField: (_l = (0, getLDAPConditionalSetting_1.getLDAPConditionalSetting)('LDAP_User_Search_Field')) !== null && _l !== void 0 ? _l : '',
            searchPageSize: (_m = server_1.settings.get('LDAP_Search_Page_Size')) !== null && _m !== void 0 ? _m : 250,
            searchSizeLimit: (_o = server_1.settings.get('LDAP_Search_Size_Limit')) !== null && _o !== void 0 ? _o : 1000,
            uniqueIdentifierField: server_1.settings.get('LDAP_Unique_Identifier_Field'),
            groupFilterEnabled: (_p = server_1.settings.get('LDAP_Group_Filter_Enable')) !== null && _p !== void 0 ? _p : false,
            groupFilterObjectClass: server_1.settings.get('LDAP_Group_Filter_ObjectClass'),
            groupFilterGroupIdAttribute: server_1.settings.get('LDAP_Group_Filter_Group_Id_Attribute'),
            groupFilterGroupMemberAttribute: server_1.settings.get('LDAP_Group_Filter_Group_Member_Attribute'),
            groupFilterGroupMemberFormat: server_1.settings.get('LDAP_Group_Filter_Group_Member_Format'),
            groupFilterGroupName: server_1.settings.get('LDAP_Group_Filter_Group_Name'),
            authentication: (_q = server_1.settings.get('LDAP_Authentication')) !== null && _q !== void 0 ? _q : false,
            authenticationUserDN: (_r = server_1.settings.get('LDAP_Authentication_UserDN')) !== null && _r !== void 0 ? _r : '',
            authenticationPassword: (_s = server_1.settings.get('LDAP_Authentication_Password')) !== null && _s !== void 0 ? _s : '',
            attributesToQuery: this.parseAttributeList(server_1.settings.get('LDAP_User_Search_AttributesToQuery')),
        };
        if (!this.options.host) {
            Logger_1.logger.warn('LDAP Host is not configured.');
        }
        if (!this.options.baseDN) {
            Logger_1.logger.warn('LDAP Search BaseDN is not configured.');
        }
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.initializeConnection((error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(result);
                });
            });
        });
    }
    disconnect() {
        this.usingAuthentication = false;
        this.connected = false;
        Logger_1.connLogger.info('Disconnecting');
        if (this.client) {
            this.client.unbind();
        }
    }
    testConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.connect();
                yield this.maybeBindDN();
            }
            finally {
                this.disconnect();
            }
        });
    }
    searchByUsername(escapedUsername) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchOptions = {
                filter: this.getUserFilter(escapedUsername),
                scope: this.options.userSearchScope || 'sub',
                sizeLimit: this.options.searchSizeLimit,
                attributes: this.options.attributesToQuery,
            };
            if (this.options.searchPageSize > 0) {
                searchOptions.paged = {
                    pageSize: this.options.searchPageSize,
                    pagePause: false,
                };
            }
            Logger_1.searchLogger.info({
                msg: 'Searching by username',
                username: escapedUsername,
                baseDN: this.options.baseDN,
                searchOptions,
            });
            return this.search(this.options.baseDN, searchOptions);
        });
    }
    findOneByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield this.searchByUsername(username);
            if (results.length === 1) {
                return results[0];
            }
        });
    }
    searchById(id, attribute) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchOptions = {
                scope: this.options.userSearchScope || 'sub',
                attributes: this.options.attributesToQuery,
            };
            if (attribute) {
                searchOptions.filter = new this.ldapjs.filters.EqualityFilter({
                    attribute,
                    value: Buffer.from(id, 'hex'),
                });
            }
            else if (this.options.uniqueIdentifierField) {
                // If we don't know what attribute the id came from, we have to look for all of them.
                const possibleFields = this.options.uniqueIdentifierField.split(',').concat(this.options.userSearchField.split(','));
                const filters = [];
                for (const field of possibleFields) {
                    if (!field) {
                        continue;
                    }
                    filters.push(new this.ldapjs.filters.EqualityFilter({
                        attribute: field,
                        value: Buffer.from(id, 'hex'),
                    }));
                }
                searchOptions.filter = new this.ldapjs.filters.OrFilter({ filters });
            }
            else {
                throw new Error('Unique Identifier Field is not configured.');
            }
            Logger_1.searchLogger.info({ msg: 'Searching by id', id });
            Logger_1.searchLogger.debug({ msg: 'search filter', searchOptions, baseDN: this.options.baseDN });
            return this.search(this.options.baseDN, searchOptions);
        });
    }
    findOneById(id, attribute) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield this.searchById(id, attribute);
            if (results.length === 1) {
                return results[0];
            }
        });
    }
    searchAllUsers(_a) {
        return __awaiter(this, arguments, void 0, function* ({ dataCallback, endCallback, entryCallback, }) {
            Logger_1.searchLogger.info('Searching all users');
            const searchOptions = {
                filter: this.getUserFilter('*'),
                scope: this.options.userSearchScope || 'sub',
                sizeLimit: this.options.searchSizeLimit,
                attributes: this.options.attributesToQuery,
            };
            if (this.options.searchPageSize > 0) {
                let count = 0;
                yield this.doPagedSearch(this.options.baseDN, searchOptions, this.options.searchPageSize, (error, entries, { end, next } = { end: false, next: undefined }) => {
                    if (error) {
                        endCallback === null || endCallback === void 0 ? void 0 : endCallback(error);
                        return;
                    }
                    count += entries.length;
                    dataCallback === null || dataCallback === void 0 ? void 0 : dataCallback(entries);
                    if (end) {
                        endCallback === null || endCallback === void 0 ? void 0 : endCallback();
                    }
                    if (next) {
                        next(count);
                    }
                }, entryCallback);
                return;
            }
            yield this.doAsyncSearch(this.options.baseDN, searchOptions, (error, result) => {
                dataCallback === null || dataCallback === void 0 ? void 0 : dataCallback(result);
                endCallback === null || endCallback === void 0 ? void 0 : endCallback(error);
            }, entryCallback);
        });
    }
    authenticate(dn, password) {
        return __awaiter(this, void 0, void 0, function* () {
            Logger_1.authLogger.info({ msg: 'Authenticating', dn });
            try {
                yield this.bindDN(dn, password);
                Logger_1.authLogger.info({ msg: 'Authenticated', dn });
                return true;
            }
            catch (error) {
                Logger_1.authLogger.info({ msg: 'Not authenticated', dn });
                Logger_1.authLogger.debug({ msg: 'error', error });
                return false;
            }
        });
    }
    search(baseDN, searchOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.doCustomSearch(baseDN, searchOptions, (entry) => this.extractLdapEntryData(entry));
        });
    }
    searchRaw(baseDN, searchOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.doCustomSearch(baseDN, searchOptions, (entry) => entry);
        });
    }
    searchAndCount(baseDN, searchOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            let count = 0;
            yield this.doCustomSearch(baseDN, searchOptions, () => __awaiter(this, void 0, void 0, function* () {
                count++;
            }));
            return count;
        });
    }
    extractLdapAttribute(value) {
        if (Array.isArray(value)) {
            return value.map((item) => this.extractLdapAttribute(item));
        }
        if (typeof value === 'string') {
            return value;
        }
        return value.toString();
    }
    extractLdapEntryData(entry) {
        const values = {
            _raw: entry.raw,
        };
        Object.keys(values._raw).forEach((key) => {
            values[key] = this.extractLdapAttribute(values._raw[key]);
            const dataType = typeof values[key];
            // eslint-disable-next-line no-control-regex
            if (dataType === 'string' && values[key].length > 100 && /[\x00-\x1F]/.test(values[key])) {
                Logger_1.mapLogger.debug({
                    msg: 'Extracted Attribute',
                    key,
                    type: dataType,
                    length: values[key].length,
                    value: `${values[key].substr(0, 100)}...`,
                });
                return;
            }
            Logger_1.mapLogger.debug({ msg: 'Extracted Attribute', key, type: dataType, value: values[key] });
        });
        return values;
    }
    doCustomSearch(baseDN, searchOptions, entryCallback) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.runBeforeSearch(searchOptions);
            if (!searchOptions.scope) {
                searchOptions.scope = this.options.userSearchScope || 'sub';
            }
            Logger_1.searchLogger.debug({ msg: 'searchOptions', searchOptions, baseDN });
            let realEntries = 0;
            return new Promise((resolve, reject) => {
                this.client.search(baseDN, searchOptions, (error, res) => {
                    if (error) {
                        Logger_1.searchLogger.error(error);
                        reject(error);
                        return;
                    }
                    res.on('error', (error) => {
                        Logger_1.searchLogger.error(error);
                        reject(error);
                    });
                    const entries = [];
                    res.on('searchEntry', (entry) => {
                        try {
                            const result = entryCallback(entry);
                            if (result) {
                                entries.push(result);
                            }
                            realEntries++;
                        }
                        catch (e) {
                            Logger_1.searchLogger.error(e);
                            throw e;
                        }
                    });
                    res.on('end', () => {
                        Logger_1.searchLogger.info(`LDAP Search found ${realEntries} entries and loaded the data of ${entries.length}.`);
                        resolve(entries);
                    });
                });
            });
        });
    }
    /*
        Create an LDAP search filter based on the username
    */
    getUserFilter(username) {
        const filter = [];
        this.addUserFilters(filter, username);
        const usernameFilter = this.options.userSearchField.split(',').map((item) => `(${item}=${username})`);
        if (usernameFilter.length === 0) {
            Logger_1.logger.error('LDAP_LDAP_User_Search_Field not defined');
        }
        else if (usernameFilter.length === 1) {
            filter.push(`${usernameFilter[0]}`);
        }
        else {
            filter.push(`(|${usernameFilter.join('')})`);
        }
        return `(&${filter.join('')})`;
    }
    searchMembersOfGroupFilter() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.options.groupFilterEnabled) {
                return [];
            }
            if (!this.options.groupFilterGroupMemberAttribute) {
                return [];
            }
            if (!this.options.groupFilterGroupMemberFormat) {
                Logger_1.searchLogger.debug(`LDAP Group Filter is enabled but no group member format is set.`);
                return [];
            }
            const filter = ['(&'];
            if (this.options.groupFilterObjectClass) {
                filter.push(`(objectclass=${this.options.groupFilterObjectClass})`);
            }
            if (this.options.groupFilterGroupIdAttribute) {
                filter.push(`(${this.options.groupFilterGroupIdAttribute}=${this.options.groupFilterGroupName})`);
            }
            filter.push(')');
            const searchOptions = {
                filter: filter.join(''),
                scope: 'sub',
            };
            Logger_1.searchLogger.debug({ msg: 'Group filter LDAP:', filter: searchOptions.filter });
            const result = yield this.searchRaw(this.options.baseDN, searchOptions);
            if (!Array.isArray(result) || result.length === 0) {
                Logger_1.searchLogger.debug({ msg: 'No groups found', result });
                return [];
            }
            const members = this.extractLdapAttribute(result[0].raw[this.options.groupFilterGroupMemberAttribute]);
            return (0, arrayUtils_1.ensureArray)(members);
        });
    }
    isUserAcceptedByGroupFilter(username, userdn) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.options.groupFilterEnabled) {
                return true;
            }
            const filter = ['(&'];
            if (this.options.groupFilterObjectClass) {
                filter.push(`(objectclass=${this.options.groupFilterObjectClass})`);
            }
            if (this.options.groupFilterGroupMemberAttribute) {
                filter.push(`(${this.options.groupFilterGroupMemberAttribute}=${this.options.groupFilterGroupMemberFormat})`);
            }
            if (this.options.groupFilterGroupIdAttribute) {
                filter.push(`(${this.options.groupFilterGroupIdAttribute}=${this.options.groupFilterGroupName})`);
            }
            filter.push(')');
            const searchOptions = {
                filter: filter
                    .join('')
                    .replace(/#{username}/g, username)
                    .replace(/#{userdn}/g, userdn),
                scope: 'sub',
            };
            Logger_1.searchLogger.debug({ msg: 'Group filter LDAP:', filter: searchOptions.filter });
            const result = yield this.searchAndCount(this.options.baseDN, searchOptions);
            if (result === 0) {
                return false;
            }
            return true;
        });
    }
    addUserFilters(filters, _username) {
        const { userSearchFilter } = this.options;
        if (userSearchFilter !== '') {
            if (userSearchFilter[0] === '(') {
                filters.push(`${userSearchFilter}`);
            }
            else {
                filters.push(`(${userSearchFilter})`);
            }
        }
    }
    bindDN(dn, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                try {
                    this.client.bind(dn, password, (error) => {
                        if (error) {
                            return reject(error);
                        }
                        resolve();
                    });
                }
                catch (error) {
                    reject(error);
                }
            });
        });
    }
    doAsyncSearch(baseDN, searchOptions, callback, entryCallback) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.runBeforeSearch(searchOptions);
            Logger_1.searchLogger.debug({ msg: 'searchOptions', searchOptions, baseDN });
            this.client.search(baseDN, searchOptions, (error, res) => {
                if (error) {
                    Logger_1.searchLogger.error(error);
                    callback(error);
                    return;
                }
                res.on('error', (error) => {
                    Logger_1.searchLogger.error(error);
                    callback(error);
                });
                const entries = [];
                res.on('searchEntry', (entry) => {
                    try {
                        const result = entryCallback ? entryCallback(entry) : entry;
                        entries.push(result);
                    }
                    catch (e) {
                        Logger_1.searchLogger.error(e);
                        throw e;
                    }
                });
                res.on('end', () => {
                    Logger_1.searchLogger.info({ msg: 'Search result count', count: entries.length });
                    callback(null, entries);
                });
            });
        });
    }
    processSearchPage({ entries, title, end, next }, callback) {
        Logger_1.searchLogger.info(title);
        // Force LDAP idle to wait the record processing
        this._updateIdle(true);
        callback(null, entries, {
            end,
            next: () => {
                // Reset idle timer
                this._updateIdle();
                next === null || next === void 0 ? void 0 : next();
            },
        });
    }
    doPagedSearch(baseDN, searchOptions, pageSize, callback, entryCallback) {
        return __awaiter(this, void 0, void 0, function* () {
            searchOptions.paged = {
                pageSize,
                pagePause: true,
            };
            yield this.runBeforeSearch(searchOptions);
            Logger_1.searchLogger.debug({ msg: 'searchOptions', searchOptions, baseDN });
            this.client.search(baseDN, searchOptions, (error, res) => {
                if (error) {
                    Logger_1.searchLogger.error(error);
                    callback(error);
                    return;
                }
                res.on('error', (error) => {
                    Logger_1.searchLogger.error(error);
                    callback(error);
                });
                let entries = [];
                const internalPageSize = pageSize * 2;
                res.on('searchEntry', (entry) => {
                    try {
                        const result = entryCallback ? entryCallback(entry) : entry;
                        entries.push(result);
                        if (entries.length >= internalPageSize) {
                            this.processSearchPage({
                                entries,
                                title: 'Internal Page',
                                end: false,
                            }, callback);
                            entries = [];
                        }
                    }
                    catch (e) {
                        Logger_1.searchLogger.error(e);
                        throw e;
                    }
                });
                res.on('page', (_result, next) => {
                    if (!next) {
                        this._updateIdle(true);
                        this.processSearchPage({
                            entries,
                            title: 'Final Page',
                            end: true,
                        }, callback);
                        entries = [];
                    }
                    else if (entries.length) {
                        this.processSearchPage({
                            entries,
                            title: 'Page',
                            end: false,
                            next,
                        }, callback);
                        entries = [];
                    }
                });
                res.on('end', () => {
                    if (entries.length) {
                        this.processSearchPage({
                            entries,
                            title: 'Final Page',
                            end: true,
                        }, callback);
                        entries = [];
                    }
                });
            });
        });
    }
    _updateIdle(override) {
        // @ts-expect-error use a private function to signal to the lib that we're still working
        this.client._updateIdle(override);
    }
    maybeBindDN() {
        return __awaiter(this, arguments, void 0, function* ({ forceBindAuthenticationUser = false } = {}) {
            if (!forceBindAuthenticationUser && (this.usingAuthentication || !this.options.authentication)) {
                return;
            }
            if (!this.options.authenticationUserDN) {
                Logger_1.logger.error('Invalid UserDN for authentication');
                return;
            }
            Logger_1.bindLogger.info({ msg: 'Binding UserDN', userDN: this.options.authenticationUserDN });
            try {
                yield this.bindDN(this.options.authenticationUserDN, this.options.authenticationPassword);
                this.usingAuthentication = true;
            }
            catch (error) {
                Logger_1.authLogger.error({
                    msg: 'Base Authentication Issue',
                    err: error,
                    dn: this.options.authenticationUserDN,
                });
                this.usingAuthentication = false;
            }
        });
    }
    runBeforeSearch(_searchOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.maybeBindDN();
        });
    }
    bindAuthenticationUser() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.maybeBindDN({ forceBindAuthenticationUser: true });
        });
    }
    /*
        Get list of options to initialize a new ldapjs Client
    */
    getClientOptions() {
        const clientOptions = {
            url: `${this.options.host}:${this.options.port}`,
            timeout: this.options.timeout,
            connectTimeout: this.options.connectionTimeout,
            idleTimeout: this.options.idleTimeout,
            reconnect: this.options.reconnect,
            log: Logger_1.connLogger,
        };
        const tlsOptions = {
            rejectUnauthorized: this.options.rejectUnauthorized,
        };
        if (this.options.caCert) {
            // Split CA cert into array of strings
            const chainLines = this.options.caCert.split('\n');
            let cert = [];
            const ca = [];
            chainLines.forEach((line) => {
                cert.push(line);
                if (line.match(/-END CERTIFICATE-/)) {
                    ca.push(cert.join('\n'));
                    cert = [];
                }
            });
            tlsOptions.ca = ca;
        }
        if (this.options.encryption === 'ssl') {
            clientOptions.url = `ldaps://${clientOptions.url}`;
            clientOptions.tlsOptions = tlsOptions;
        }
        else {
            clientOptions.url = `ldap://${clientOptions.url}`;
        }
        return {
            clientOptions,
            tlsOptions,
        };
    }
    handleConnectionResponse(error, response) {
        if (!this._receivedResponse) {
            this._receivedResponse = true;
            this._connectionCallback(error, response);
            return;
        }
        if (this._connectionTimedOut && !error) {
            Logger_1.connLogger.info('Received a response after the connection timedout.');
        }
        else {
            Logger_1.logger.debug('Ignored error/response:');
        }
        if (error) {
            Logger_1.connLogger.debug(error);
        }
        else {
            Logger_1.connLogger.debug(response);
        }
    }
    initializeConnection(callback) {
        Logger_1.connLogger.info('Init Setup');
        this._receivedResponse = false;
        this._connectionTimedOut = false;
        this._connectionCallback = callback;
        const { clientOptions, tlsOptions } = this.getClientOptions();
        Logger_1.connLogger.info({ msg: 'Connecting', url: clientOptions.url });
        Logger_1.connLogger.debug({ msg: 'clientOptions', clientOptions });
        this.client = ldapjs_1.default.createClient(clientOptions);
        this.client.on('error', (error) => {
            Logger_1.connLogger.error(error);
            this.handleConnectionResponse(error, null);
        });
        this.client.on('idle', () => {
            Logger_1.searchLogger.info('Idle');
            this.disconnect();
        });
        this.client.on('close', () => {
            Logger_1.searchLogger.info('Closed');
        });
        if (this.options.encryption === 'tls') {
            // Set host parameter for tls.connect which is used by ldapjs starttls. This may not be needed anymore
            // https://github.com/RocketChat/Rocket.Chat/issues/2035
            // https://github.com/mcavage/node-ldapjs/issues/349
            tlsOptions.host = this.options.host;
            Logger_1.connLogger.info('Starting TLS');
            Logger_1.connLogger.debug({ msg: 'tlsOptions', tlsOptions });
            this.client.starttls(tlsOptions, null, (error, response) => {
                if (error) {
                    Logger_1.connLogger.error({ msg: 'TLS connection', error });
                    return this.handleConnectionResponse(error, null);
                }
                Logger_1.connLogger.info('TLS connected');
                this.connected = true;
                this.handleConnectionResponse(null, response);
            });
        }
        else {
            this.client.on('connect', (response) => {
                Logger_1.connLogger.info('LDAP connected');
                this.connected = true;
                this.handleConnectionResponse(null, response);
            });
        }
        setTimeout(() => {
            if (!this._receivedResponse) {
                Logger_1.connLogger.error({ msg: 'connection time out', timeout: clientOptions.connectTimeout });
                this.handleConnectionResponse(new Error('Timeout'));
                this._connectionTimedOut = true;
            }
        }, clientOptions.connectTimeout);
    }
    parseAttributeList(csv) {
        if (!csv) {
            return ['*', '+'];
        }
        const list = csv.split(',').map((item) => item.trim());
        if (!(list === null || list === void 0 ? void 0 : list.length)) {
            return ['*', '+'];
        }
        return list;
    }
}
exports.LDAPConnection = LDAPConnection;
