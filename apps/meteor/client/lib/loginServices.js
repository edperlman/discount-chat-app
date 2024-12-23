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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginServices = void 0;
const emitter_1 = require("@rocket.chat/emitter");
const string_helpers_1 = require("@rocket.chat/string-helpers");
const SDKClient_1 = require("../../app/utils/client/lib/SDKClient");
const maxRetries = 3;
const timeout = 10000;
class LoginServices extends emitter_1.Emitter {
    constructor() {
        super(...arguments);
        this.retries = 0;
        this.services = [];
        this.serviceButtons = [];
        this.state = 'none';
        this.config = {
            'apple': { title: 'Apple', icon: 'apple' },
            'facebook': { title: 'Facebook', icon: 'facebook' },
            'twitter': { title: 'Twitter', icon: 'twitter' },
            'google': { title: 'Google', icon: 'google' },
            'github': { title: 'Github', icon: 'github' },
            'github_enterprise': { title: 'Github Enterprise', icon: 'github' },
            'gitlab': { title: 'Gitlab', icon: 'gitlab' },
            'dolphin': { title: 'Dolphin', icon: 'dophin' },
            'drupal': { title: 'Drupal', icon: 'drupal' },
            'nextcloud': { title: 'Nextcloud', icon: 'nextcloud' },
            'tokenpass': { title: 'Tokenpass', icon: 'tokenpass' },
            'meteor-developer': { title: 'Meteor', icon: 'meteor' },
            'wordpress': { title: 'WordPress', icon: 'wordpress' },
            'linkedin': { title: 'Linkedin', icon: 'linkedin' },
        };
    }
    setServices(state, services) {
        this.services = services;
        this.state = state;
        this.generateServiceButtons();
        if (state === 'loaded') {
            this.retries = 0;
            this.emit('loaded', services);
        }
    }
    generateServiceButtons() {
        const filtered = this.services.filter((config) => !('showButton' in config) || config.showButton !== false) || [];
        const sorted = filtered.sort(({ service: service1 }, { service: service2 }) => service1.localeCompare(service2));
        this.serviceButtons = sorted.map((service) => {
            // Remove the appId attribute if present
            const _a = Object.assign(Object.assign({}, service), { appId: undefined }), { appId: _ } = _a, serviceData = __rest(_a, ["appId"]);
            // Get the hardcoded title and icon, or fallback to capitalizing the service name
            const serviceConfig = this.config[service.service] || {
                title: (0, string_helpers_1.capitalize)(service.service),
            };
            return Object.assign(Object.assign({}, serviceData), serviceConfig);
        });
        this.emit('changed');
    }
    getLoginService(serviceName) {
        if (!this.ready) {
            return;
        }
        return this.services.find(({ service }) => service === serviceName);
    }
    loadLoginService(serviceName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.ready) {
                return this.getLoginService(serviceName);
            }
            return new Promise((resolve, reject) => {
                this.onLoad(() => resolve(this.getLoginService(serviceName)));
                setTimeout(() => reject(new Error('LoadLoginService timeout')), timeout);
            });
        });
    }
    get ready() {
        return this.state === 'loaded';
    }
    getLoginServiceButtons() {
        if (!this.ready) {
            if (this.state === 'none') {
                void this.loadServices();
            }
        }
        return this.serviceButtons;
    }
    onLoad(callback) {
        if (this.ready) {
            return callback(this.services);
        }
        void this.loadServices();
        this.once('loaded', callback);
    }
    loadServices() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.state === 'error') {
                if (this.retries >= maxRetries) {
                    return;
                }
                this.retries++;
            }
            else if (this.state !== 'none') {
                return;
            }
            try {
                this.state = 'loading';
                const { configurations } = yield SDKClient_1.sdk.rest.get('/v1/service.configurations');
                this.setServices('loaded', configurations);
            }
            catch (e) {
                this.setServices('error', []);
                throw e;
            }
        });
    }
}
exports.loginServices = new LoginServices();
