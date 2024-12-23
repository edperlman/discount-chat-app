"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRoomRolesManagement = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const client_1 = require("../../../../../app/models/client");
// const roomRoles = RoomRoles as Mongo.Collection<Pick<ISubscription, 'rid' | 'u' | 'roles'>>;
const useRoomRolesManagement = (rid) => {
    const getRoomRoles = (0, ui_contexts_1.useMethod)('getRoomRoles');
    (0, react_1.useEffect)(() => {
        getRoomRoles(rid).then((results) => {
            Array.from(results).forEach((_a) => {
                var { _id } = _a, data = __rest(_a, ["_id"]);
                const { rid, u: { _id: uid }, } = data;
                client_1.RoomRoles.upsert({ rid, 'u._id': uid }, { $set: data });
            });
        });
    }, [getRoomRoles, rid]);
    (0, react_1.useEffect)(() => {
        const rolesObserve = client_1.RoomRoles.find({ rid }).observe({
            added: (role) => {
                var _a;
                if (!((_a = role.u) === null || _a === void 0 ? void 0 : _a._id)) {
                    return;
                }
                client_1.Messages.update({ rid, 'u._id': role.u._id }, { $addToSet: { roles: role._id } }, { multi: true });
            },
            changed: (role) => {
                var _a;
                if (!((_a = role.u) === null || _a === void 0 ? void 0 : _a._id)) {
                    return;
                }
                client_1.Messages.update({ rid, 'u._id': role.u._id }, { $inc: { rerender: 1 } }, { multi: true });
            },
            removed: (role) => {
                var _a;
                if (!((_a = role.u) === null || _a === void 0 ? void 0 : _a._id)) {
                    return;
                }
                client_1.Messages.update({ rid, 'u._id': role.u._id }, { $pull: { roles: role._id } }, { multi: true });
            },
        });
        return () => {
            rolesObserve.stop();
        };
    }, [getRoomRoles, rid]);
    const subscribeToNotifyLoggedIn = (0, ui_contexts_1.useStream)('notify-logged');
    (0, react_1.useEffect)(() => subscribeToNotifyLoggedIn('roles-change', (_a) => {
        var _b;
        var { type } = _a, role = __rest(_a, ["type"]);
        if (!role.scope) {
            return;
        }
        if (!((_b = role.u) === null || _b === void 0 ? void 0 : _b._id)) {
            return;
        }
        switch (type) {
            case 'added':
                client_1.RoomRoles.upsert({ 'rid': role.scope, 'u._id': role.u._id }, { $setOnInsert: { u: role.u }, $addToSet: { roles: role._id } });
                break;
            case 'removed':
                client_1.RoomRoles.update({ 'rid': role.scope, 'u._id': role.u._id }, { $pull: { roles: role._id } });
                break;
        }
    }), [subscribeToNotifyLoggedIn]);
    (0, react_1.useEffect)(() => subscribeToNotifyLoggedIn('Users:NameChanged', ({ _id: uid, name }) => {
        client_1.RoomRoles.update({
            'u._id': uid,
        }, {
            $set: {
                'u.name': name,
            },
        }, {
            multi: true,
        });
    }), [subscribeToNotifyLoggedIn]);
};
exports.useRoomRolesManagement = useRoomRolesManagement;
