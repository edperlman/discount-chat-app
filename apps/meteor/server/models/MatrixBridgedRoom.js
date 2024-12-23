"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const MatrixBridgedRoom_1 = require("./raw/MatrixBridgedRoom");
(0, models_1.registerModel)('IMatrixBridgedRoomModel', new MatrixBridgedRoom_1.MatrixBridgedRoomRaw(utils_1.db));
