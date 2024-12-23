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
const core_services_1 = require("@rocket.chat/core-services");
const callbacks_1 = require("../../../lib/callbacks");
const server_1 = require("../../settings/server");
const beforeGetMentions = (mentionIds, teamMentions) => __awaiter(void 0, void 0, void 0, function* () {
    if (!teamMentions.length) {
        return mentionIds;
    }
    const teamsIds = teamMentions.map(({ _id }) => _id);
    const members = yield core_services_1.Team.getMembersByTeamIds(teamsIds, { projection: { userId: 1 } });
    return [...new Set([...mentionIds, ...members.map(({ userId }) => userId)])];
});
server_1.settings.watch('Troubleshoot_Disable_Teams_Mention', (value) => {
    if (value) {
        callbacks_1.callbacks.remove('beforeGetMentions', 'before-get-mentions-get-teams');
    }
    else {
        callbacks_1.callbacks.add('beforeGetMentions', beforeGetMentions, callbacks_1.callbacks.priority.MEDIUM, 'before-get-mentions-get-teams');
    }
});
