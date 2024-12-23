"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const callbacks_1 = require("../../../../../lib/callbacks");
callbacks_1.callbacks.add('livechat.beforeListTags', () => models_1.LivechatTag.find({}, { projection: { name: 1, departments: 1 } }).toArray(), callbacks_1.callbacks.priority.LOW, 'livechat-before-list-tags');
