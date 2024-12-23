"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventService = void 0;
const logger_1 = require("../logger/logger");
const service_1 = require("../service");
class EventService {
    _pushError(name, value, _payload) {
        // TODO implement a (performant) cache
        logger_1.SearchLogger.debug(`Error on event '${name}' with id '${value}'`);
    }
    promoteEvent(name, value, payload) {
        var _a;
        if (!((_a = service_1.searchProviderService.activeProvider) === null || _a === void 0 ? void 0 : _a.on(name, value))) {
            this._pushError(name, value, payload);
        }
    }
}
exports.EventService = EventService;
