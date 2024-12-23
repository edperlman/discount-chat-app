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
exports.AccountImpl = void 0;
const emitter_1 = require("@rocket.chat/emitter");
class AccountImpl extends emitter_1.Emitter {
    constructor(client) {
        super();
        this.client = client;
        client.onCollection('users', (data) => {
            if (data.collection !== 'users') {
                return;
            }
            if (!('fields' in data) || !(data.fields && 'username' in data.fields)) {
                return;
            }
            this.user = Object.assign(Object.assign({}, this.user), { id: data.id, username: data.fields.username });
            this.emit('user', this.user);
        });
    }
    saveCredentials(id, token, tokenExpires) {
        this.user = Object.assign(Object.assign({}, this.user), { token, tokenExpires: new Date(tokenExpires), id });
        this.uid = id;
        this.emit('uid', this.uid);
        this.emit('user', this.user);
    }
    loginWithPassword(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, token: resultToken, tokenExpires: { $date }, } = yield this.client.callAsyncWithOptions('login', {
                wait: true,
            }, {
                user: { username },
                password: { digest: password, algorithm: 'sha-256' },
            });
            this.saveCredentials(id, resultToken, $date);
        });
    }
    loginWithToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.client.callAsyncWithOptions('login', {
                wait: true,
            }, {
                resume: token,
            });
            const { id, token: resultToken, tokenExpires: { $date }, } = result;
            this.saveCredentials(id, resultToken, $date);
            return result;
        });
    }
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.callAsyncWithOptions('logout', {
                wait: true,
            });
            this.uid = undefined;
            this.user = undefined;
            this.emit('uid', this.uid);
        });
    }
}
exports.AccountImpl = AccountImpl;
