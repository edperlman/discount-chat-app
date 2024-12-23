"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const meteor_1 = require("meteor/meteor");
const baseURI_1 = require("../lib/baseURI");
meteor_1.Meteor.absoluteUrl.defaultOptions.rootUrl = baseURI_1.baseURI;
