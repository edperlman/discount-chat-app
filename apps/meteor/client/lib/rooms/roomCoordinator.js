"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomCoordinator = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const core_typings_1 = require("@rocket.chat/core-typings");
const meteor_1 = require("meteor/meteor");
const react_1 = __importDefault(require("react"));
const client_1 = require("../../../app/authorization/client");
const client_2 = require("../../../app/models/client");
const client_3 = require("../../../app/settings/client");
const coordinator_1 = require("../../../lib/rooms/coordinator");
const RouterProvider_1 = require("../../providers/RouterProvider");
const RoomRoute_1 = __importDefault(require("../../views/room/RoomRoute"));
const MainLayout_1 = __importDefault(require("../../views/root/MainLayout"));
const appLayout_1 = require("../appLayout");
class RoomCoordinatorClient extends coordinator_1.RoomCoordinator {
    add(roomConfig, directives) {
        this.addRoomType(roomConfig, Object.assign(Object.assign({ allowRoomSettingChange(_room, _setting) {
                return true;
            },
            allowMemberAction(_room, _action, _showingUserId, _userSubscription) {
                return false;
            },
            roomName(_room) {
                return '';
            },
            isGroupChat(_room) {
                return false;
            },
            getUiText(_context) {
                return '';
            },
            condition() {
                return true;
            },
            getAvatarPath(_room) {
                return '';
            },
            findRoom(_identifier) {
                return undefined;
            },
            showJoinLink(_roomId) {
                return false;
            },
            isLivechatRoom() {
                return false;
            },
            canSendMessage(rid) {
                return client_2.Subscriptions.find({ rid }).count() > 0;
            } }, directives), { config: roomConfig }));
    }
    getRoomDirectives(roomType) {
        return this.roomTypes[roomType].directives;
    }
    openRouteLink(roomType, subData, queryParams, options = {}) {
        var _a;
        const config = this.getRoomTypeConfig(roomType);
        if (!(config === null || config === void 0 ? void 0 : config.route)) {
            return;
        }
        let routeData = {};
        if (config.route.link) {
            routeData = config.route.link(subData);
        }
        else if (subData === null || subData === void 0 ? void 0 : subData.name) {
            routeData = {
                name: subData.name,
            };
        }
        else {
            return;
        }
        RouterProvider_1.router.navigate({
            pattern: (_a = config.route.path) !== null && _a !== void 0 ? _a : '/home',
            params: routeData,
            search: queryParams,
        }, options);
    }
    isLivechatRoom(roomType) {
        return Boolean(this.getRoomDirectives(roomType).isLivechatRoom());
    }
    getRoomName(roomType, roomData) {
        var _a;
        return (_a = this.getRoomDirectives(roomType).roomName(roomData)) !== null && _a !== void 0 ? _a : '';
    }
    readOnly(rid, user) {
        const fields = Object.assign({ ro: 1, t: 1 }, (user && { muted: 1, unmuted: 1 }));
        const room = client_2.Rooms.findOne({ _id: rid }, { fields });
        if (!room) {
            return false;
        }
        const directives = this.getRoomDirectives(room.t);
        if (directives === null || directives === void 0 ? void 0 : directives.readOnly) {
            return directives.readOnly(rid, user);
        }
        if (!(user === null || user === void 0 ? void 0 : user.username)) {
            return Boolean(room.ro);
        }
        if (!room) {
            return false;
        }
        if (Array.isArray(room.muted) && room.muted.indexOf(user.username) !== -1) {
            return true;
        }
        if (room.ro) {
            if (Array.isArray(room.unmuted) && room.unmuted.indexOf(user.username) !== -1) {
                return false;
            }
            if ((0, client_1.hasPermission)('post-readonly', room._id)) {
                return false;
            }
            return true;
        }
        return false;
    }
    // #ToDo: Move this out of the RoomCoordinator
    archived(rid) {
        const room = client_2.Rooms.findOne({ _id: rid }, { fields: { archived: 1 } });
        return Boolean(room === null || room === void 0 ? void 0 : room.archived);
    }
    verifyCanSendMessage(rid) {
        const room = client_2.Rooms.findOne({ _id: rid }, { fields: { t: 1, federated: 1 } });
        if (!(room === null || room === void 0 ? void 0 : room.t)) {
            return false;
        }
        if (!this.getRoomDirectives(room.t).canSendMessage(rid)) {
            return false;
        }
        if ((0, core_typings_1.isRoomFederated)(room)) {
            return client_3.settings.get('Federation_Matrix_enabled');
        }
        return true;
    }
    validateRoute(route) {
        const { name, path, link } = route;
        if (typeof name !== 'string' || name.length === 0) {
            throw new Error('The route name must be a string.');
        }
        if (path !== undefined && (typeof path !== 'string' || path.length === 0)) {
            throw new Error('The route path must be a string.');
        }
        if (!['undefined', 'function'].includes(typeof link)) {
            throw new Error('The route link must be a function.');
        }
    }
    validateRoomConfig(roomConfig) {
        super.validateRoomConfig(roomConfig);
        const { route, label } = roomConfig;
        if (route !== undefined) {
            this.validateRoute(route);
        }
        if (label !== undefined && (typeof label !== 'string' || label.length === 0)) {
            throw new Error('The label must be a string.');
        }
    }
    addRoomType(roomConfig, directives) {
        var _a;
        super.addRoomType(roomConfig, directives);
        if (((_a = roomConfig.route) === null || _a === void 0 ? void 0 : _a.path) && roomConfig.route.name && directives.extractOpenRoomParams) {
            const { route: { name, path }, } = roomConfig;
            const { extractOpenRoomParams } = directives;
            RouterProvider_1.router.defineRoutes([
                {
                    path,
                    id: name,
                    element: appLayout_1.appLayout.wrap((0, jsx_runtime_1.jsx)(MainLayout_1.default, { children: (0, jsx_runtime_1.jsx)(RoomRoute_1.default, { extractOpenRoomParams: extractOpenRoomParams }) })),
                },
            ]);
        }
    }
    getURL(roomType, subData) {
        const config = this.getRoomTypeConfig(roomType);
        if (!(config === null || config === void 0 ? void 0 : config.route)) {
            return false;
        }
        const routeData = this.getRouteData(roomType, subData);
        if (!routeData) {
            return false;
        }
        return meteor_1.Meteor.absoluteUrl(RouterProvider_1.router.buildRoutePath({
            name: config.route.name,
            params: routeData,
        }));
    }
    isRouteNameKnown(routeName) {
        return Boolean(this.getRouteNameIdentifier(routeName));
    }
    getRouteNameIdentifier(routeName) {
        if (!routeName) {
            return;
        }
        return Object.keys(this.roomTypes).find((key) => { var _a; return ((_a = this.roomTypes[key].config.route) === null || _a === void 0 ? void 0 : _a.name) === routeName; });
    }
}
exports.roomCoordinator = new RoomCoordinatorClient();
