"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePinMessage = void 0;
const client_1 = require("../../../app/models/client");
const PinMessagesNotAllowed_1 = require("../errors/PinMessagesNotAllowed");
const updatePinMessage = (message, data) => {
    const msg = client_1.Messages.findOne({ _id: message._id });
    if (!msg) {
        throw new PinMessagesNotAllowed_1.PinMessagesNotAllowed('Error pinning message', {
            method: 'pinMessage',
        });
    }
    client_1.Messages.update({
        _id: message._id,
        rid: message.rid,
    }, { $set: data });
};
exports.updatePinMessage = updatePinMessage;
