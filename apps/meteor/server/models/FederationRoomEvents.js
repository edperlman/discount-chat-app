"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const FederationRoomEvents_1 = require("./raw/FederationRoomEvents");
(0, models_1.registerModel)('IFederationRoomEventsModel', new FederationRoomEvents_1.FederationRoomEvents(utils_1.db));
