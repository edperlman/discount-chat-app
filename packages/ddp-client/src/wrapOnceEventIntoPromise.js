"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapOnceEventIntoPromise = wrapOnceEventIntoPromise;
/**
 * This function takes an event emitter (an object that emits events) and an event name
 * as arguments, and returns a `Promise` that is resolved when the event is emitted, or
 * is rejected if the event object has an `error` property.
 * @param emitter The event emitter
 * @param event The event name
 * @returns A `Promise` that is resolved when the event is emitted, or is rejected if the event object has an `error` property
 */
function wrapOnceEventIntoPromise(emitter, event) {
    // Create a new Promise and set up its resolve and reject callbacks
    return new Promise((resolve, reject) => {
        // When the event is emitted, call the appropriate callback
        emitter.once(event, (data) => {
            // If the event object has an error property, reject
            if (data.error) {
                return reject(data.error);
            }
            // Otherwise, resolve with the event object
            resolve(data);
        });
    });
}
