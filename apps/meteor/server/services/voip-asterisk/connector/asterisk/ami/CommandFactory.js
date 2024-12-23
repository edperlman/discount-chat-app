"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandFactory = void 0;
/**
 * Factory class for creating a command specific object.
 * @remarks
 * Even though there may be multiple |Commands| object, the Command execution is
 * logically organized based on the entities on the call server.
 * e.g even though extension_info and extension_list are two different commands,
 * they will be executed by |PJSIPEndpoint| class.
 */
const logger_1 = require("@rocket.chat/logger");
const Command_1 = require("../Command");
const Commands_1 = require("../Commands");
const ACDQueue_1 = require("./ACDQueue");
const ContinuousMonitor_1 = require("./ContinuousMonitor");
const PJSIPEndpoint_1 = require("./PJSIPEndpoint");
class CommandFactory {
    static getCommandObject(command, db) {
        this.logger.debug({ msg: `Creating command object for ${Commands_1.Commands[command]}` });
        switch (command) {
            case Commands_1.Commands.ping:
                return new Command_1.Command(Commands_1.Commands.ping.toString(), false, db);
            case Commands_1.Commands.extension_info:
            case Commands_1.Commands.extension_list: {
                return new PJSIPEndpoint_1.PJSIPEndpoint(command.toString(), false, db);
            }
            case Commands_1.Commands.queue_details:
            case Commands_1.Commands.queue_summary: {
                return new ACDQueue_1.ACDQueue(command.toString(), false, db);
            }
            case Commands_1.Commands.event_stream: {
                return new ContinuousMonitor_1.ContinuousMonitor(command.toString(), false, db);
            }
        }
    }
}
exports.CommandFactory = CommandFactory;
CommandFactory.logger = new logger_1.Logger('CommandFactory');
