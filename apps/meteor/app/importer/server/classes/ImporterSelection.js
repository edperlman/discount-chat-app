"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImporterSelection = void 0;
class ImporterSelection {
    /**
     * Constructs a new importer selection object.
     *
     * @param name the name of the importer
     * @param users the users which can be selected
     * @param channels the channels which can be selected
     * @param messageCount the number of messages
     */
    constructor(name, users, channels, messageCount, contacts) {
        this.name = name;
        this.users = users;
        this.channels = channels;
        this.message_count = messageCount;
        this.contacts = contacts;
    }
}
exports.ImporterSelection = ImporterSelection;
