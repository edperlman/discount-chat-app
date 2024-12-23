"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const meteor_1 = require("meteor/meteor");
const tracker_1 = require("meteor/tracker");
const client_1 = require("../../../app/authorization/client");
const client_2 = require("../../../app/settings/client");
const callbacks_1 = require("../../../lib/callbacks");
meteor_1.Meteor.startup(() => {
    tracker_1.Tracker.autorun(() => {
        const isEnabled = client_2.settings.get('AutoTranslate_Enabled') && (0, client_1.hasPermission)('auto-translate');
        if (!isEnabled) {
            callbacks_1.callbacks.remove('streamMessage', 'autotranslate-stream');
            return;
        }
        Promise.resolve().then(() => __importStar(require('../../../app/autotranslate/client'))).then(({ createAutoTranslateMessageStreamHandler }) => {
            const streamMessage = createAutoTranslateMessageStreamHandler();
            callbacks_1.callbacks.remove('streamMessage', 'autotranslate-stream');
            callbacks_1.callbacks.add('streamMessage', streamMessage, callbacks_1.callbacks.priority.HIGH - 3, 'autotranslate-stream');
        });
    });
});
