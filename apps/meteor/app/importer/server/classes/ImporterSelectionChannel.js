"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectionChannel = void 0;
class SelectionChannel {
    /**
     * Constructs a new selection channel.
     *
     * @param channelId the unique identifier of the channel
     * @param name the name of the channel
     * @param isArchived whether the channel was archived or not
     * @param doImport whether we will be importing the channel or not
     */
    constructor(channelId, name, isArchived, doImport, isPrivate, isDirect) {
        this.channel_id = channelId;
        this.name = name;
        this.is_archived = isArchived;
        this.do_import = doImport;
        this.is_private = isPrivate;
        this.is_direct = isDirect;
    }
}
exports.SelectionChannel = SelectionChannel;
