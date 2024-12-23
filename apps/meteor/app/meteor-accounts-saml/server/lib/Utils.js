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
exports.SAMLUtils = void 0;
const events_1 = require("events");
const zlib_1 = __importDefault(require("zlib"));
const constants_1 = require("./constants");
const arrayUtils_1 = require("../../../../lib/utils/arrayUtils");
let providerList = [];
let debug = false;
let relayState = null;
let logger;
const globalSettings = {
    generateUsername: false,
    nameOverwrite: false,
    mailOverwrite: false,
    immutableProperty: 'EMail',
    defaultUserRole: 'user',
    userDataFieldMap: '{"username":"username", "email":"email", "cn": "name"}',
    usernameNormalize: 'None',
    channelsAttributeUpdate: false,
    includePrivateChannelsInUpdate: false,
};
class SAMLUtils {
    static get isDebugging() {
        return debug;
    }
    static get globalSettings() {
        return globalSettings;
    }
    static get serviceProviders() {
        return providerList;
    }
    static get relayState() {
        return relayState;
    }
    static set relayState(value) {
        relayState = value;
    }
    static getServiceProviderOptions(providerName) {
        this.log(providerName, providerList);
        return providerList.find((providerOptions) => providerOptions.provider === providerName);
    }
    static setServiceProvidersList(list) {
        providerList = list;
    }
    static setLoggerInstance(instance) {
        logger = instance;
    }
    // TODO: Some of those should probably not be global
    static updateGlobalSettings(samlConfigs) {
        debug = Boolean(samlConfigs.debug);
        globalSettings.generateUsername = Boolean(samlConfigs.generateUsername);
        globalSettings.nameOverwrite = Boolean(samlConfigs.nameOverwrite);
        globalSettings.mailOverwrite = Boolean(samlConfigs.mailOverwrite);
        globalSettings.channelsAttributeUpdate = Boolean(samlConfigs.channelsAttributeUpdate);
        globalSettings.includePrivateChannelsInUpdate = Boolean(samlConfigs.includePrivateChannelsInUpdate);
        if (samlConfigs.immutableProperty && typeof samlConfigs.immutableProperty === 'string') {
            globalSettings.immutableProperty = samlConfigs.immutableProperty;
        }
        if (samlConfigs.usernameNormalize && typeof samlConfigs.usernameNormalize === 'string') {
            globalSettings.usernameNormalize = samlConfigs.usernameNormalize;
        }
        if (samlConfigs.defaultUserRole && typeof samlConfigs.defaultUserRole === 'string') {
            globalSettings.defaultUserRole = samlConfigs.defaultUserRole;
        }
        if (samlConfigs.userDataFieldMap && typeof samlConfigs.userDataFieldMap === 'string') {
            globalSettings.userDataFieldMap = samlConfigs.userDataFieldMap;
        }
    }
    static generateUniqueID() {
        const chars = 'abcdef0123456789';
        let uniqueID = 'id-';
        for (let i = 0; i < 20; i++) {
            uniqueID += chars.substr(Math.floor(Math.random() * 15), 1);
        }
        return uniqueID;
    }
    static generateInstant() {
        return new Date().toISOString();
    }
    static certToPEM(cert) {
        const lines = cert.match(/.{1,64}/g);
        if (!lines) {
            throw new Error('Invalid Certificate');
        }
        lines.splice(0, 0, '-----BEGIN CERTIFICATE-----');
        lines.push('-----END CERTIFICATE-----');
        return lines.join('\n');
    }
    static fillTemplateData(template, data) {
        let newTemplate = template;
        for (const variable in data) {
            if (variable in data) {
                const key = `__${variable}__`;
                while (newTemplate.includes(key)) {
                    newTemplate = newTemplate.replace(key, data[variable]);
                }
            }
        }
        return newTemplate;
    }
    static getValidationActionRedirectPath(credentialToken, redirectUrl) {
        const redirectUrlParam = redirectUrl ? `&redirectUrl=${encodeURIComponent(redirectUrl)}` : '';
        // the saml_idp_credentialToken param is needed by the mobile app
        return `saml/${credentialToken}?saml_idp_credentialToken=${credentialToken}${redirectUrlParam}`;
    }
    static log(obj, ...args) {
        if (debug && logger) {
            logger.debug(obj, ...args);
        }
    }
    static error(obj, ...args) {
        if (logger) {
            logger.error(obj, ...args);
        }
    }
    static inflateXml(base64Data, successCallback, errorCallback) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const buffer = Buffer.from(base64Data, 'base64');
                zlib_1.default.inflateRaw(buffer, (err, decoded) => {
                    if (err) {
                        this.log(`Error while inflating. ${err}`);
                        return reject(errorCallback(err));
                    }
                    if (!decoded) {
                        return reject(errorCallback('Failed to extract request data'));
                    }
                    const xmlString = this.convertArrayBufferToString(decoded);
                    return resolve(successCallback(xmlString));
                });
            });
        });
    }
    static validateStatus(doc) {
        var _a;
        let successStatus = false;
        let status = null;
        let messageText = '';
        const statusNodes = doc.getElementsByTagNameNS('urn:oasis:names:tc:SAML:2.0:protocol', 'StatusCode');
        if (statusNodes.length) {
            const statusNode = statusNodes[0];
            const statusMessage = doc.getElementsByTagNameNS('urn:oasis:names:tc:SAML:2.0:protocol', 'StatusMessage')[0];
            if ((_a = statusMessage === null || statusMessage === void 0 ? void 0 : statusMessage.firstChild) === null || _a === void 0 ? void 0 : _a.textContent) {
                messageText = statusMessage.firstChild.textContent;
            }
            status = statusNode.getAttribute('Value');
            if (status === constants_1.StatusCode.success) {
                successStatus = true;
            }
        }
        return {
            success: successStatus,
            message: messageText,
            statusCode: status || '',
        };
    }
    static normalizeCert(cert) {
        if (!cert) {
            return cert;
        }
        return cert
            .replace(/-+BEGIN CERTIFICATE-+\r?\n?/, '')
            .replace(/-+END CERTIFICATE-+\r?\n?/, '')
            .replace(/\r\n/g, '\n')
            .trim();
    }
    static getUserDataMapping() {
        const { userDataFieldMap, immutableProperty } = globalSettings;
        let map;
        try {
            map = JSON.parse(userDataFieldMap);
        }
        catch (e) {
            SAMLUtils.log(userDataFieldMap);
            SAMLUtils.log(e);
            throw new Error('Failed to parse custom user field map');
        }
        const parsedMap = {
            attributeList: new Set(),
            email: {
                fieldName: 'email',
            },
            username: {
                fieldName: 'username',
            },
            name: {
                fieldName: 'cn',
            },
            identifier: {
                type: '',
            },
        };
        let identifier = immutableProperty.toLowerCase();
        for (const spFieldName in map) {
            if (!map.hasOwnProperty(spFieldName)) {
                continue;
            }
            const attribute = map[spFieldName];
            if (typeof attribute !== 'string' && typeof attribute !== 'object') {
                throw new Error(`SAML User Map: Invalid configuration for ${spFieldName} field.`);
            }
            if (spFieldName === '__identifier__') {
                if (typeof attribute !== 'string') {
                    throw new Error('SAML User Map: Invalid identifier.');
                }
                identifier = attribute;
                continue;
            }
            let attributeMap = null;
            // If it's a complex type, let's check what's in it
            if (typeof attribute === 'object') {
                // A fieldName is mandatory for complex fields. If it's missing, let's skip this one.
                if (!attribute.hasOwnProperty('fieldName') && !attribute.hasOwnProperty('fieldNames')) {
                    continue;
                }
                const fieldName = attribute.fieldName || attribute.fieldNames;
                const { regex, template } = attribute;
                if (Array.isArray(fieldName)) {
                    if (!fieldName.length) {
                        throw new Error(`SAML User Map: Invalid configuration for ${spFieldName} field.`);
                    }
                    for (const idpFieldName of fieldName) {
                        parsedMap.attributeList.add(idpFieldName);
                    }
                }
                else {
                    parsedMap.attributeList.add(fieldName);
                }
                if (regex && typeof regex !== 'string') {
                    throw new Error('SAML User Map: Invalid RegEx');
                }
                if (template && typeof template !== 'string') {
                    throw new Error('SAML User Map: Invalid Template');
                }
                attributeMap = Object.assign(Object.assign({ fieldName }, (regex && { regex })), (template && { template }));
            }
            else if (typeof attribute === 'string') {
                attributeMap = {
                    fieldName: attribute,
                };
                parsedMap.attributeList.add(attribute);
            }
            if (attributeMap) {
                if (spFieldName === 'email' || spFieldName === 'username' || spFieldName === 'name') {
                    parsedMap[spFieldName] = attributeMap;
                }
            }
        }
        if (identifier) {
            const defaultTypes = ['email', 'username'];
            if (defaultTypes.includes(identifier)) {
                parsedMap.identifier.type = identifier;
            }
            else {
                parsedMap.identifier.type = 'custom';
                parsedMap.identifier.attribute = identifier;
                parsedMap.attributeList.add(identifier);
            }
        }
        return parsedMap;
    }
    static getProfileValue(profile, mapping, forceString = false) {
        const values = {
            regex: '',
        };
        const fieldNames = (0, arrayUtils_1.ensureArray)(mapping.fieldName);
        let mainValue;
        for (const fieldName of fieldNames) {
            let profileValue = profile[fieldName];
            if (Array.isArray(profileValue)) {
                for (let i = 0; i < profile[fieldName].length; i++) {
                    // Add every index to the list of possible values to be used, both first to last and from last to first
                    values[`${fieldName}[${i}]`] = profileValue[i];
                    values[`${fieldName}[-${Math.abs(0 - profileValue.length + i)}]`] = profileValue[i];
                }
                values[`${fieldName}[]`] = profileValue.join(' ');
                if (forceString) {
                    profileValue = profileValue.join(' ');
                }
            }
            else {
                values[fieldName] = profileValue;
            }
            values[fieldName] = profileValue;
            if (!mainValue) {
                mainValue = profileValue;
            }
        }
        let shouldRunTemplate = false;
        if (typeof mapping.template === 'string') {
            // unless the regex result is used on the template, we process the template first
            if (mapping.template.includes('__regex__')) {
                shouldRunTemplate = true;
            }
            else {
                mainValue = this.fillTemplateData(mapping.template, values);
            }
        }
        if (mapping.regex && mainValue && mainValue.match) {
            let regexValue;
            const match = mainValue.match(new RegExp(mapping.regex));
            if (match === null || match === void 0 ? void 0 : match.length) {
                if (match.length >= 2) {
                    regexValue = match[1];
                }
                else {
                    regexValue = match[0];
                }
            }
            if (regexValue) {
                values.regex = regexValue;
                if (!shouldRunTemplate) {
                    mainValue = regexValue;
                }
            }
        }
        if (shouldRunTemplate && typeof mapping.template === 'string') {
            mainValue = this.fillTemplateData(mapping.template, values);
        }
        return mainValue;
    }
    static convertArrayBufferToString(buffer, encoding = 'utf8') {
        return Buffer.from(buffer).toString(encoding);
    }
    static normalizeUsername(name) {
        const { globalSettings } = this;
        switch (globalSettings.usernameNormalize) {
            case 'Lowercase':
                name = name.toLowerCase();
                break;
        }
        return name;
    }
    static mapProfileToUserObject(profile) {
        const userDataMap = this.getUserDataMapping();
        SAMLUtils.log('parsed userDataMap', userDataMap);
        if (userDataMap.identifier.type === 'custom') {
            if (!userDataMap.identifier.attribute) {
                throw new Error('SAML User Data Map: invalid Identifier configuration received.');
            }
            if (!profile[userDataMap.identifier.attribute]) {
                throw new Error(`SAML Profile did not have the expected identifier (${userDataMap.identifier.attribute}).`);
            }
        }
        const attributeList = new Map();
        for (const attributeName of userDataMap.attributeList) {
            if (profile[attributeName] === undefined) {
                this.log(`SAML user profile is missing the attribute ${attributeName}.`);
                continue;
            }
            attributeList.set(attributeName, profile[attributeName]);
        }
        const email = this.getProfileValue(profile, userDataMap.email);
        const profileUsername = this.getProfileValue(profile, userDataMap.username, true);
        const name = this.getProfileValue(profile, userDataMap.name, true);
        // Even if we're not using the email to identify the user, it is still mandatory because it's a mandatory information on Rocket.Chat
        if (!email) {
            throw new Error('SAML Profile did not contain an email address');
        }
        const userObject = {
            samlLogin: {
                provider: this.relayState,
                idp: profile.issuer,
                idpSession: profile.sessionIndex,
                nameID: profile.nameID,
            },
            emailList: (0, arrayUtils_1.ensureArray)(email),
            fullName: name || profile.displayName || profile.username,
            eppn: profile.eppn,
            attributeList,
            identifier: userDataMap.identifier,
        };
        if (profileUsername) {
            userObject.username = this.normalizeUsername(profileUsername);
        }
        if (profile.language) {
            userObject.language = profile.language;
        }
        if (profile.channels) {
            if (Array.isArray(profile.channels)) {
                userObject.channels = profile.channels;
            }
            else {
                userObject.channels = profile.channels.split(',');
            }
        }
        this.events.emit('mapUser', { profile, userObject });
        return userObject;
    }
}
exports.SAMLUtils = SAMLUtils;
SAMLUtils.events = new events_1.EventEmitter();
