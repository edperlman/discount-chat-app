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
const models_1 = require("@rocket.chat/models");
const upsertPermissions_1 = require("../../../app/authorization/server/functions/upsertPermissions");
const migrations_1 = require("../../lib/migrations");
(0, migrations_1.addMigration)({
    version: 315,
    name: 'Copy roles from add-team-channel permission to new create-team-channel, create-team-group and move-room-to-team permissions',
    up() {
        return __awaiter(this, void 0, void 0, function* () {
            // Calling upsertPermissions on purpose so that the new permissions are added before the migration runs
            yield (0, upsertPermissions_1.upsertPermissions)();
            const addTeamChannelPermission = yield models_1.Permissions.findOneById('add-team-channel', {
                projection: { roles: 1 },
            });
            if (addTeamChannelPermission) {
                yield models_1.Permissions.updateMany({ _id: { $in: ['create-team-channel', 'create-team-group', 'move-room-to-team'] } }, { $set: { roles: addTeamChannelPermission.roles } });
                yield models_1.Permissions.deleteOne({ _id: 'add-team-channel' });
            }
        });
    },
});
