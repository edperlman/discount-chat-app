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
const models_1 = require("@rocket.chat/models");
const server_1 = require("../../../../../app/api/server");
const canAccessRoom_1 = require("../../../../../app/authorization/server/functions/canAccessRoom");
server_1.API.v1.addRoute('omnichannel/:rid/request-transcript', { authRequired: true, permissionsRequired: ['request-pdf-transcript'] }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const room = yield models_1.LivechatRooms.findOneById(this.urlParams.rid);
            if (!room) {
                throw new Error('error-invalid-room');
            }
            if (!(yield (0, canAccessRoom_1.canAccessRoomAsync)(room, { _id: this.userId }))) {
                throw new Error('error-not-allowed');
            }
            // Flow is as follows:
            // 1. Call OmnichannelTranscript.requestTranscript()
            // 2. OmnichannelTranscript.requestTranscript() calls QueueWorker.queueWork()
            // 3. QueueWorker.queueWork() eventually calls OmnichannelTranscript.workOnPdf()
            // 4. OmnichannelTranscript.workOnPdf() calls OmnichannelTranscript.pdfComplete() when processing ends
            // 5. OmnichannelTranscript.pdfComplete() sends the messages to the user, and updates the room with the flags
            yield core_services_1.OmnichannelTranscript.requestTranscript({
                details: {
                    userId: this.userId,
                    rid: this.urlParams.rid,
                },
            });
            return server_1.API.v1.success();
        });
    },
});
