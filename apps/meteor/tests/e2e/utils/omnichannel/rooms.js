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
exports.createConversation = exports.sendMessageToRoom = exports.createVisitor = exports.createRoom = exports.closeRoom = exports.updateRoom = void 0;
const faker_1 = require("@faker-js/faker");
const data_1 = require("../../../mocks/data");
const updateRoom = (api_1, _a) => __awaiter(void 0, [api_1, _a], void 0, function* (api, { roomId, visitorId, tags }) {
    if (!roomId) {
        throw Error('Unable to update room info, missing room id');
    }
    if (!visitorId) {
        throw Error('Unable to update room info, missing visitor id');
    }
    const response = yield api.post('/livechat/room.saveInfo', {
        guestData: { _id: visitorId },
        roomData: { _id: roomId, tags },
    });
    if (response.status() !== 200) {
        throw Error(`Unable to update room info [http status: ${response.status()}]`);
    }
    return response;
});
exports.updateRoom = updateRoom;
const closeRoom = (api_1, _a) => __awaiter(void 0, [api_1, _a], void 0, function* (api, { roomId, visitorToken }) { return api.post('/livechat/room.close', { rid: roomId, token: visitorToken }); });
exports.closeRoom = closeRoom;
const createRoom = (api_1, _a) => __awaiter(void 0, [api_1, _a], void 0, function* (api, { visitorToken, agentId }) {
    const response = yield api.get('/livechat/room', {
        token: visitorToken,
        agentId,
    });
    if (response.status() !== 200) {
        throw Error(`Unable to create room [http status: ${response.status()}]`, { cause: yield response.json() });
    }
    const { room } = yield response.json();
    return {
        response,
        data: room,
        delete() {
            return __awaiter(this, void 0, void 0, function* () {
                yield (0, exports.closeRoom)(api, { roomId: room._id, visitorToken });
                return api.post('/method.call/livechat:removeRoom', {
                    message: JSON.stringify({
                        msg: 'method',
                        id: '16',
                        method: 'livechat:removeRoom',
                        params: [room._id],
                    }),
                });
            });
        },
    };
});
exports.createRoom = createRoom;
const createVisitor = (api_1, _a) => __awaiter(void 0, [api_1, _a], void 0, function* (api, { name, token, departmentId }) {
    const fakeVisitor = (0, data_1.createFakeVisitor)();
    const response = yield api.post('/livechat/visitor', {
        visitor: Object.assign({ name: name || fakeVisitor.name, email: fakeVisitor.email, token }, (departmentId && { department: departmentId })),
    });
    if (response.status() !== 200) {
        throw Error(`Unable to create visitor [http status: ${response.status()}]`);
    }
    const { visitor } = yield response.json();
    return {
        response,
        data: visitor,
        delete: () => __awaiter(void 0, void 0, void 0, function* () { return api.delete(`/livechat/visitor/${token}`); }),
    };
});
exports.createVisitor = createVisitor;
const sendMessageToRoom = (api_1, _a) => __awaiter(void 0, [api_1, _a], void 0, function* (api, { visitorToken, roomId, message }) {
    const response = yield api.post(`/livechat/message`, {
        token: visitorToken,
        rid: roomId,
        msg: message || faker_1.faker.lorem.sentence(),
    });
    if (response.status() !== 200) {
        throw Error(`Unable to send message to room [http status: ${response.status()}]`);
    }
    return response;
});
exports.sendMessageToRoom = sendMessageToRoom;
const createConversation = (api_1, ...args_1) => __awaiter(void 0, [api_1, ...args_1], void 0, function* (api, { visitorName, visitorToken, agentId, departmentId } = {}) {
    const token = visitorToken || faker_1.faker.string.uuid();
    const { data: visitor, delete: deleteVisitor } = yield (0, exports.createVisitor)(api, { token, name: visitorName, departmentId });
    const { data: room, delete: deleteRoom } = yield (0, exports.createRoom)(api, { visitorToken: token, agentId });
    yield (0, exports.sendMessageToRoom)(api, { visitorToken: token, roomId: room._id });
    return {
        data: {
            room,
            visitor,
        },
        delete: () => __awaiter(void 0, void 0, void 0, function* () {
            yield deleteRoom();
            yield deleteVisitor();
        }),
    };
});
exports.createConversation = createConversation;
