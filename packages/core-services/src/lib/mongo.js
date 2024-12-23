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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConnection = void 0;
exports.getTrashCollection = getTrashCollection;
const tracing_1 = require("@rocket.chat/tracing");
const mongodb_1 = require("mongodb");
const { MONGO_URL = 'mongodb://localhost:27017/rocketchat' } = process.env;
const name = (_a = /^mongodb:\/\/.*?(?::[0-9]+)?\/([^?]*)/.exec(MONGO_URL)) === null || _a === void 0 ? void 0 : _a[1];
function connectDb(options) {
    const client = new mongodb_1.MongoClient(MONGO_URL, Object.assign(Object.assign({}, options), { monitorCommands: (0, tracing_1.isTracingEnabled)() }));
    return client.connect().catch((error) => {
        // exits the process in case of any error
        console.error(error);
        process.exit(1);
    });
}
let db;
exports.getConnection = (() => {
    let client;
    return (options) => __awaiter(void 0, void 0, void 0, function* () {
        if (db) {
            return { db, client };
        }
        if (client == null) {
            client = yield connectDb(options);
            db = client.db(name);
        }
        // if getConnection was called multiple times before it was connected, wait for the connection
        return { client, db: client.db(name) };
    });
})();
function getTrashCollection() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!db) {
            const { db: clientDb } = yield (0, exports.getConnection)();
            db = clientDb;
        }
        return db.collection('rocketchat__trash');
    });
}
