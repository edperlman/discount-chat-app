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
exports.emit = exports.StreamPresence = void 0;
const emitter_1 = require("@rocket.chat/emitter");
const e = new emitter_1.Emitter();
const clients = new WeakMap();
class UserPresence {
    constructor(publication, streamer) {
        this.off = (uid) => {
            e.off(uid, this.run);
            this.listeners.delete(uid);
        };
        this.run = (args) => {
            var _a;
            const payload = this.streamer.changedPayload(this.streamer.subscriptionName, args.uid, Object.assign(Object.assign({}, args), { eventName: args.uid })); // there is no good explanation to keep eventName, I just want to save one 'DDPCommon.parseDDP' on the client side, so I'm trying to fit the Meteor Streamer's payload
            if (payload)
                (_a = this.publication._session.socket) === null || _a === void 0 ? void 0 : _a.send(payload);
        };
        this.listeners = new Set();
        this.publication = publication;
        this.streamer = streamer;
    }
    listen(uid) {
        if (this.listeners.has(uid)) {
            return;
        }
        e.on(uid, this.run);
        this.listeners.add(uid);
    }
    stop() {
        this.listeners.forEach(this.off);
        clients.delete(this.publication.connection);
    }
    static getClient(publication, streamer) {
        const { connection } = publication;
        const stored = clients.get(connection);
        const client = stored || new UserPresence(publication, streamer);
        const main = Boolean(!stored);
        clients.set(connection, client);
        return [client, main];
    }
}
class StreamPresence {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    static getInstance(Streamer, name = 'user-presence') {
        return new class StreamPresence extends Streamer {
            _publish(publication_1, _eventName_1) {
                return __awaiter(this, arguments, void 0, function* (publication, _eventName, options = false) {
                    const { added, removed } = (typeof options !== 'boolean' ? options : {});
                    const [client, main] = UserPresence.getClient(publication, this);
                    added === null || added === void 0 ? void 0 : added.forEach((uid) => client.listen(uid));
                    removed === null || removed === void 0 ? void 0 : removed.forEach((uid) => client.off(uid));
                    if (!main) {
                        publication.stop();
                        return;
                    }
                    publication.ready();
                    publication.onStop(() => client.stop());
                });
            }
        }(name);
    }
}
exports.StreamPresence = StreamPresence;
const emit = (uid, args) => {
    e.emit(uid, { uid, args });
};
exports.emit = emit;
