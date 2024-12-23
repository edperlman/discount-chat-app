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
exports.updateCounter = updateCounter;
const models_1 = require("@rocket.chat/models");
const notifyListener_1 = require("../../../lib/server/lib/notifyListener");
const telemetryEvents_1 = __importDefault(require("../lib/telemetryEvents"));
function updateCounter(data) {
    void (() => __awaiter(this, void 0, void 0, function* () {
        const { value } = yield models_1.Settings.incrementValueById(data.settingsId, 1, { returnDocument: 'after' });
        if (value) {
            void (0, notifyListener_1.notifyOnSettingChanged)(value);
        }
    }))();
}
telemetryEvents_1.default.register('updateCounter', updateCounter);
