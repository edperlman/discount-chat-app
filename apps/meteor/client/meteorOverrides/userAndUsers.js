"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Users_1 = require("../../app/models/client/models/Users");
Meteor.users = Users_1.Users;
// overwrite Meteor.users collection so records on it don't get erased whenever the client reconnects to websocket
Meteor.user = function user() {
    var _a;
    const uid = Meteor.userId();
    if (!uid) {
        return null;
    }
    return ((_a = Users_1.Users.findOne({ _id: uid })) !== null && _a !== void 0 ? _a : null);
};
