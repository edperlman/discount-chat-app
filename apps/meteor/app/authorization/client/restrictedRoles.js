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
const SDKClient_1 = require("../../utils/client/lib/SDKClient");
const lib_1 = require("../lib");
meteor_1.Meteor.startup(() => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield SDKClient_1.sdk.call('license:isEnterprise');
    if (result) {
        // #ToDo: Load this from the server with an API call instead of having a duplicate list
        lib_1.AuthorizationUtils.addRolePermissionWhiteList('guest', ['view-d-room', 'view-joined-room', 'view-p-room', 'start-discussion']);
    }
}));
