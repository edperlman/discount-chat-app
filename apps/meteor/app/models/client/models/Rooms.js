"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rooms = void 0;
const CachedChatRoom_1 = require("./CachedChatRoom");
/** @deprecated new code refer to Minimongo collections like this one; prefer fetching data from the REST API, listening to changes via streamer events, and storing the state in a Tanstack Query */
exports.Rooms = CachedChatRoom_1.CachedChatRoom.collection;
