"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const VideoConference_1 = require("./raw/VideoConference");
(0, models_1.registerModel)('IVideoConferenceModel', new VideoConference_1.VideoConferenceRaw(utils_1.db));
