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
exports.getMongoInfo = getMongoInfo;
const mongo_1 = require("meteor/mongo");
const watchers_module_1 = require("../../../../server/modules/watchers/watchers.module");
function getOplogInfo() {
    const { mongo } = mongo_1.MongoInternals.defaultRemoteCollectionDriver();
    const oplogEnabled = (0, watchers_module_1.isWatcherRunning)();
    return { oplogEnabled, mongo };
}
function fallbackMongoInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        let mongoVersion;
        let mongoStorageEngine;
        const { oplogEnabled, mongo } = getOplogInfo();
        try {
            const { version } = yield mongo.db.command({ buildinfo: 1 });
            mongoVersion = version;
            mongoStorageEngine = 'unknown';
        }
        catch (e) {
            console.error('=== Error getting MongoDB info ===');
            console.error(e === null || e === void 0 ? void 0 : e.toString());
            console.error('----------------------------------');
            console.error("Without mongodb version we can't ensure you are running a compatible version.");
            console.error('If you are running your mongodb with auth enabled and an user different from admin');
            console.error('you may need to grant permissions for this user to check cluster data.');
            console.error('You can do it via mongo shell running the following command replacing');
            console.error("the string YOUR_USER by the correct user's name:");
            console.error('');
            console.error('   db.runCommand({ grantRolesToUser: "YOUR_USER" , roles: [{role: "clusterMonitor", db: "admin"}]})');
            console.error('');
            console.error('==================================');
        }
        return { oplogEnabled, mongoVersion, mongoStorageEngine, mongo };
    });
}
function getMongoInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        let mongoVersion;
        let mongoStorageEngine;
        const { oplogEnabled, mongo } = getOplogInfo();
        try {
            const { version, storageEngine } = yield mongo.db.command({ serverStatus: 1 });
            mongoVersion = version;
            mongoStorageEngine = storageEngine.name;
        }
        catch (e) {
            return fallbackMongoInfo();
        }
        return { oplogEnabled, mongoVersion, mongoStorageEngine, mongo };
    });
}
