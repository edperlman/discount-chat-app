"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Commands = void 0;
/**
 * Enumerator represnting set of commands supported by the connector.
 * @remark : This enum will be used by the consumer of |CommandHandler| class to
 * execute a particular management commamd.
 */
var Commands;
(function (Commands) {
    Commands[Commands["ping"] = 0] = "ping";
    Commands[Commands["extension_list"] = 1] = "extension_list";
    Commands[Commands["extension_info"] = 2] = "extension_info";
    Commands[Commands["queue_summary"] = 3] = "queue_summary";
    Commands[Commands["queue_details"] = 4] = "queue_details";
    Commands[Commands["event_stream"] = 5] = "event_stream";
})(Commands || (exports.Commands = Commands = {}));
