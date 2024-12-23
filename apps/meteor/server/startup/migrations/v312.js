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
const migrations_1 = require("../../lib/migrations");
(0, migrations_1.addMigration)({
    version: 312,
    up() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Promise.allSettled([
                    models_1.LivechatRooms.col.dropIndex('v.token_1'),
                    models_1.Rooms.col.dropIndex('t_1'),
                    models_1.Subscriptions.col.dropIndex('rid_1'),
                    models_1.Users.col.dropIndex('active_1'),
                ]);
            }
            catch (error) {
                console.warn('Error dropping redundant indexes, continuing...');
                console.warn(error);
            }
        });
    },
});
