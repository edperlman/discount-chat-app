"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webapp_1 = require("meteor/webapp");
const room_1 = require("./room");
const user_1 = require("./user");
require("./middlewares");
webapp_1.WebApp.connectHandlers.use('/avatar/room/', room_1.roomAvatar);
webapp_1.WebApp.connectHandlers.use('/avatar/uid/', user_1.userAvatarById);
webapp_1.WebApp.connectHandlers.use('/avatar/', user_1.userAvatarByUsername);
