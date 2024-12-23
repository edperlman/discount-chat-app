"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const WorkspaceCredentials_1 = require("./raw/WorkspaceCredentials");
(0, models_1.registerModel)('IWorkspaceCredentialsModel', new WorkspaceCredentials_1.WorkspaceCredentialsRaw(utils_1.db));
