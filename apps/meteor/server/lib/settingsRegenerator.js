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
exports.settingsRegenerator = settingsRegenerator;
// Validates settings on DB are correct on structure
// And deletes invalid ones
const logger_1 = require("@rocket.chat/logger");
const models_1 = require("@rocket.chat/models");
// Validates settings on DB are correct on structure by matching the ones missing all the required fields
const logger = new logger_1.Logger('SettingsRegenerator');
function settingsRegenerator() {
    return __awaiter(this, void 0, void 0, function* () {
        const invalidSettings = yield models_1.Settings.find({
            // Putting the $and explicit to ensure it's "intentional"
            $and: [
                { value: { $exists: false } },
                { type: { $exists: false } },
                { public: { $exists: false } },
                { packageValue: { $exists: false } },
                { blocked: { $exists: false } },
                { sorter: { $exists: false } },
                { i18nLabel: { $exists: false } },
            ],
        }, { projection: { _id: 1 } }).toArray();
        if (invalidSettings.length > 0) {
            logger.warn({
                msg: 'Invalid settings found on DB. Deleting them.',
                settings: invalidSettings.map(({ _id }) => _id),
            });
            yield models_1.Settings.deleteMany({ _id: { $in: invalidSettings.map(({ _id }) => _id) } });
            // No need to notify listener
        }
        else {
            logger.info('No invalid settings found on DB.');
        }
    });
}
