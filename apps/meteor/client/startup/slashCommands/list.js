"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const meteor_1 = require("meteor/meteor");
const tracker_1 = require("meteor/tracker");
const client_1 = require("../../../app/utils/client");
const SDKClient_1 = require("../../../app/utils/client/lib/SDKClient");
let oldUserId = null;
tracker_1.Tracker.autorun(() => __awaiter(void 0, void 0, void 0, function* () {
    const newUserId = meteor_1.Meteor.userId();
    if (oldUserId === null && newUserId) {
        SDKClient_1.sdk.rest.get('/v1/commands.list').then((result) => {
            result.commands.forEach((command) => {
                client_1.slashCommands.add(command);
            });
        });
    }
    oldUserId = meteor_1.Meteor.userId();
}));
