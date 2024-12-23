"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginPresence = void 0;
const meteor_1 = require("meteor/meteor");
const client_1 = require("../../../settings/client");
class LoginPresence {
    constructor() {
        this.awayTime = 600000; // 10 minutes
        this.started = false;
    }
    startTimer() {
        this.stopTimer();
        if (!this.awayTime) {
            return;
        }
        this.timer = setTimeout(() => this.disconnect(), this.awayTime);
    }
    stopTimer() {
        clearTimeout(this.timer);
    }
    disconnect() {
        const status = meteor_1.Meteor.status();
        if (status && status.status !== 'offline') {
            if (!meteor_1.Meteor.userId() && client_1.settings.get('Accounts_AllowAnonymousRead') !== true) {
                meteor_1.Meteor.disconnect();
            }
        }
        this.stopTimer();
    }
    connect() {
        const status = meteor_1.Meteor.status();
        if (status && status.status === 'offline') {
            meteor_1.Meteor.reconnect();
        }
    }
    start() {
        if (this.started) {
            return;
        }
        window.addEventListener('focus', () => {
            this.stopTimer();
            this.connect();
        });
        window.addEventListener('blur', () => {
            this.startTimer();
        });
        if (!window.document.hasFocus()) {
            this.startTimer();
        }
        this.started = true;
    }
}
const instance = new LoginPresence();
exports.LoginPresence = instance;
instance.start();
