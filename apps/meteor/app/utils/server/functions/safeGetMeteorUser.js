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
exports.safeGetMeteorUser = safeGetMeteorUser;
const meteor_1 = require("meteor/meteor");
const invalidEnvironmentErrorMessage = 'Meteor.userId can only be invoked in method calls or publications.';
/**
 * Helper that executes the `Meteor.userAsync()`, but
 * supresses errors thrown if the code isn't
 * executed inside Meteor's environment
 *
 * Use this function only if it the code path is
 * expected to run out of Meteor's environment and
 * is prepared to handle those cases. Otherwise, it
 * is advisable to call `Meteor.userAsync()` directly
 *
 * @returns The current user in the Meteor session, or null if not available
 */
function safeGetMeteorUser() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Explicitly await here otherwise the try...catch wouldn't work.
            return yield meteor_1.Meteor.userAsync();
        }
        catch (error) {
            // This is the only type of error we want to capture and supress,
            // so if the error thrown is different from what we expect, we let it go
            if ((error === null || error === void 0 ? void 0 : error.message) !== invalidEnvironmentErrorMessage) {
                throw error;
            }
            return null;
        }
    });
}
