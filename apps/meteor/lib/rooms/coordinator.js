"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomCoordinator = void 0;
class RoomCoordinator {
    constructor() {
        this.roomTypes = {};
    }
    validateRoomConfig(roomConfig) {
        const { identifier } = roomConfig;
        if (typeof identifier !== 'string' || identifier.length === 0) {
            throw new Error('The identifier must be a string.');
        }
    }
    addRoomType(roomConfig, directives) {
        this.validateRoomConfig(roomConfig);
        if (this.roomTypes[roomConfig.identifier]) {
            return;
        }
        this.roomTypes[roomConfig.identifier] = { config: roomConfig, directives };
    }
    getRoomTypeConfig(identifier) {
        if (!this.roomTypes[identifier]) {
            throw new Error(`Room type with identifier ${identifier} does not exist.`);
        }
        return this.roomTypes[identifier].config;
    }
    getRouteLink(roomType, subData) {
        const config = this.getRoomTypeConfig(roomType);
        if (!(config === null || config === void 0 ? void 0 : config.route)) {
            return false;
        }
        const routeData = this.getRouteData(roomType, subData);
        if (!routeData) {
            return false;
        }
        if (!config.route.path) {
            console.warn(`The route for the room type ${roomType} does not have a path`);
            return false;
        }
        const pathDef = config.route.path;
        const fields = routeData;
        const regExp = /(:[\w\(\)\\\+\*\.\?]+)+/g;
        let path = pathDef.replace(regExp, (key) => {
            const firstRegexpChar = key.indexOf('(');
            // get the content behind : and (\\d+/)
            key = key.substring(1, firstRegexpChar > 0 ? firstRegexpChar : undefined);
            // remove +?*
            key = key.replace(/[\+\*\?]+/g, '');
            return fields[key] || '';
        });
        path = path.replace(/\/\/+/g, '/'); // Replace multiple slashes with single slash
        // remove trailing slash
        // but keep the root slash if it's the only one
        path = path.match(/^\/{1}$/) ? path : path.replace(/\/$/, '');
        return path;
    }
    getRouteData(roomType, subData) {
        var _a;
        if (!subData.rid && subData._id) {
            console.warn('Deprecated: RoomCoordinator.getRouteData received a room object');
            subData.rid = subData._id;
        }
        const config = this.getRoomTypeConfig(roomType);
        if (!config) {
            return false;
        }
        let routeData = {};
        if ((_a = config.route) === null || _a === void 0 ? void 0 : _a.link) {
            routeData = config.route.link(subData);
        }
        else if (subData === null || subData === void 0 ? void 0 : subData.name) {
            routeData = {
                rid: subData.rid,
                name: subData.name,
            };
        }
        return routeData;
    }
}
exports.RoomCoordinator = RoomCoordinator;
