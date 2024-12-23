"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const WebdavAccounts_1 = require("./raw/WebdavAccounts");
(0, models_1.registerModel)('IWebdavAccountsModel', new WebdavAccounts_1.WebdavAccountsRaw(utils_1.db));
