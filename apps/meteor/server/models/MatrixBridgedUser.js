"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const MatrixBridgedUser_1 = require("./raw/MatrixBridgedUser");
(0, models_1.registerModel)('IMatrixBridgedUserModel', new MatrixBridgedUser_1.MatrixBridgedUserRaw(utils_1.db));
