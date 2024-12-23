"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppEvents = void 0;
var AppEvents;
(function (AppEvents) {
    AppEvents["APP_ADDED"] = "app/added";
    AppEvents["APP_REMOVED"] = "app/removed";
    AppEvents["APP_UPDATED"] = "app/updated";
    AppEvents["APP_STATUS_CHANGE"] = "app/statusUpdate";
    AppEvents["APP_SETTING_UPDATED"] = "app/settingUpdated";
    AppEvents["COMMAND_ADDED"] = "command/added";
    AppEvents["COMMAND_DISABLED"] = "command/disabled";
    AppEvents["COMMAND_UPDATED"] = "command/updated";
    AppEvents["COMMAND_REMOVED"] = "command/removed";
    AppEvents["ACTIONS_CHANGED"] = "actions/changed";
})(AppEvents || (exports.AppEvents = AppEvents = {}));
