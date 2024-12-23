"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_typings_1 = require("@rocket.chat/core-typings");
const moment_1 = __importDefault(require("moment"));
const client_1 = require("../../ui-utils/client");
const messageTypes = [
    {
        id: 'voip-call-started',
        system: true,
        message: 'Voip_call_started',
    },
    {
        id: 'voip-call-duration',
        system: true,
        message: 'Voip_call_duration',
        data(message) {
            if (!(0, core_typings_1.isVoipMessage)(message)) {
                return { duration: '' };
            }
            const seconds = (message.voipData.callDuration || 0) / 1000;
            const duration = moment_1.default.duration(seconds, 'seconds').humanize();
            return {
                duration,
            };
        },
    },
    {
        id: 'voip-call-declined',
        system: true,
        message: 'Voip_call_declined',
    },
    {
        id: 'voip-call-on-hold',
        system: true,
        message: 'Voip_call_on_hold',
    },
    {
        id: 'voip-call-unhold',
        system: true,
        message: 'Voip_call_unhold',
    },
    {
        id: 'voip-call-ended',
        system: true,
        message: 'Voip_call_ended',
    },
    {
        id: 'voip-call-ended-unexpectedly',
        system: true,
        message: 'Voip_call_ended_unexpectedly',
        data(message) {
            return {
                reason: message.msg,
            };
        },
    },
    {
        id: 'voip-call-wrapup',
        system: true,
        message: 'Voip_call_wrapup',
        data(message) {
            return {
                comment: message.msg,
            };
        },
    },
];
messageTypes.map((e) => client_1.MessageTypes.registerType(e));
