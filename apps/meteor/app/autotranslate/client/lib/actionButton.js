"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const meteor_1 = require("meteor/meteor");
const autotranslate_1 = require("./autotranslate");
meteor_1.Meteor.startup(() => {
    autotranslate_1.AutoTranslate.init();
});
