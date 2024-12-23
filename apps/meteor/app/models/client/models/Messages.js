"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Messages = void 0;
const mongo_1 = require("meteor/mongo");
class ChatMessageCollection extends mongo_1.Mongo.Collection {
    constructor() {
        super(null);
    }
}
/** @deprecated new code refer to Minimongo collections like this one; prefer fetching data from the REST API, listening to changes via streamer events, and storing the state in a Tanstack Query */
exports.Messages = new ChatMessageCollection();
