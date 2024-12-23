"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCallback = registerCallback;
exports.enableCallbacks = enableCallbacks;
exports.disableCallbacks = disableCallbacks;
const callbacks_1 = require("../../../../lib/callbacks");
const server_1 = require("../../../settings/server");
const callbackDefinitions = [];
function enableCallback(definition) {
    callbacks_1.callbacks.add(definition.hook, definition.callback, callbacks_1.callbacks.priority.LOW, definition.id);
}
function registerCallback(callbackDefinition) {
    callbackDefinitions.push(callbackDefinition);
    if (server_1.settings.get('FEDERATION_Enabled')) {
        enableCallback(callbackDefinition);
    }
}
function enableCallbacks() {
    for (const definition of callbackDefinitions) {
        enableCallback(definition);
    }
}
function disableCallbacks() {
    for (const definition of callbackDefinitions) {
        callbacks_1.callbacks.remove(definition.hook, definition.id);
    }
}
