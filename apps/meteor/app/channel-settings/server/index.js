"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveRoomName = exports.saveRoomTopic = void 0;
require("./methods/saveRoomSettings");
var saveRoomTopic_1 = require("./functions/saveRoomTopic");
Object.defineProperty(exports, "saveRoomTopic", { enumerable: true, get: function () { return saveRoomTopic_1.saveRoomTopic; } });
var saveRoomName_1 = require("./functions/saveRoomName");
Object.defineProperty(exports, "saveRoomName", { enumerable: true, get: function () { return saveRoomName_1.saveRoomName; } });
