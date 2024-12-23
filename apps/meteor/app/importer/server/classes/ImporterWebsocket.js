"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImporterWebsocket = void 0;
const Notifications_1 = __importDefault(require("../../../notifications/server/lib/Notifications"));
class ImporterWebsocketDef {
    constructor() {
        this.streamer = Notifications_1.default.streamImporters;
    }
    /**
     * Called when the progress is updated.
     *
     * @param {Progress} progress The progress of the import.
     */
    progressUpdated(progress) {
        this.streamer.emit('progress', progress);
    }
}
exports.ImporterWebsocket = new ImporterWebsocketDef();
