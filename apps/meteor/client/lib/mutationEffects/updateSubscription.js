"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSubscription = void 0;
const client_1 = require("../../../app/models/client");
const updateSubscription = (roomId, userId, data) => {
    const oldDocument = client_1.Subscriptions.findOne({ 'rid': roomId, 'u._id': userId });
    client_1.Subscriptions.update({ 'rid': roomId, 'u._id': userId }, { $set: data });
    return oldDocument;
};
exports.updateSubscription = updateSubscription;
