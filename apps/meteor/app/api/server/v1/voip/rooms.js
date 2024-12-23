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
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const random_1 = require("@rocket.chat/random");
const rest_typings_1 = require("@rocket.chat/rest-typings");
const typedJSONParse_1 = require("../../../../../lib/typedJSONParse");
const hasPermission_1 = require("../../../../authorization/server/functions/hasPermission");
const api_1 = require("../../api");
const getPaginationItems_1 = require("../../helpers/getPaginationItems");
const parseDateParams = (date) => {
    return date && typeof date === 'string' ? (0, typedJSONParse_1.typedJsonParse)(date) : {};
};
const validateDateParams = (property, date = {}) => {
    if ((date === null || date === void 0 ? void 0 : date.start) && isNaN(Date.parse(date.start))) {
        throw new Error(`The "${property}.start" query parameter must be a valid date.`);
    }
    if ((date === null || date === void 0 ? void 0 : date.end) && isNaN(Date.parse(date.end))) {
        throw new Error(`The "${property}.end" query parameter must be a valid date.`);
    }
    return date;
};
const parseAndValidate = (property, date) => {
    return validateDateParams(property, parseDateParams(date));
};
/**
 * @openapi
 *  /voip/server/api/v1/voip/room
 *    get:
 *      description: Creates a new room if rid is not passed, else gets an existing room
 * 		based on rid and token . This configures the rate limit. An average call volume in a contact
 * 		center is 600 calls a day
 * 		considering 8 hour shift. Which comes to 1.25 calls per minute.
 * 		we will keep the safe limit which is 5 calls a minute.
 *      security:
 *      parameters:
 *        - name: token
 *          in: query
 *          description: The visitor token
 *          required: true
 *          schema:
 *            type: string
 *          example: ByehQjC44FwMeiLbX
 *        - name: rid
 *          in: query
 *          description: The room id
 *          required: false
 *          schema:
 *            type: string
 *          example: ByehQjC44FwMeiLbX
 *        - name: agentId
 *          in: query
 *          description: Agent Id
 *          required: false
 *          schema:
 *            type: string
 *          example: ByehQjC44FwMeiLbX
 *      responses:
 *        200:
 *          description: Room object and flag indicating whether a new room is created.
 *          content:
 *            application/json:
 *              schema:
 *                allOf:
 *                  - $ref: '#/components/schemas/ApiSuccessV1'
 *                  - type: object
 *                    properties:
 *                      room:
 *                        type: object
 *                        items:
 *                          $ref: '#/components/schemas/IRoom'
 *                      newRoom:
 *                        type: boolean
 *        default:
 *          description: Unexpected error
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ApiFailureV1'
 */
const isRoomSearchProps = (props) => {
    return 'rid' in props && 'token' in props;
};
const isRoomCreationProps = (props) => {
    return 'agentId' in props && 'direction' in props;
};
api_1.API.v1.addRoute('voip/room', {
    authRequired: true,
    rateLimiterOptions: { numRequestsAllowed: 5, intervalTimeInMS: 60000 },
    permissionsRequired: ['inbound-voip-calls'],
    validateParams: rest_typings_1.isVoipRoomProps,
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { token } = this.queryParams;
            let agentId = undefined;
            let direction = 'inbound';
            let rid = undefined;
            if (isRoomCreationProps(this.queryParams)) {
                agentId = this.queryParams.agentId;
                direction = this.queryParams.direction;
            }
            if (isRoomSearchProps(this.queryParams)) {
                rid = this.queryParams.rid;
            }
            const guest = yield models_1.LivechatVisitors.getVisitorByToken(token, {});
            if (!guest) {
                return api_1.API.v1.failure('invalid-token');
            }
            if (!rid) {
                const room = yield models_1.VoipRoom.findOneOpenByVisitorToken(token, { projection: api_1.API.v1.defaultFieldsToExclude });
                if (room) {
                    return api_1.API.v1.success({ room, newRoom: false });
                }
                if (!agentId) {
                    return api_1.API.v1.failure('agent-not-found');
                }
                const agentObj = yield models_1.Users.findOneAgentById(agentId, {
                    projection: { username: 1 },
                });
                if (!(agentObj === null || agentObj === void 0 ? void 0 : agentObj.username)) {
                    return api_1.API.v1.failure('agent-not-found');
                }
                const { username, _id } = agentObj;
                const agent = { agentId: _id, username };
                const rid = random_1.Random.id();
                return api_1.API.v1.success(yield core_services_1.LivechatVoip.getNewRoom(guest, agent, rid, direction, {
                    projection: api_1.API.v1.defaultFieldsToExclude,
                }));
            }
            const room = yield models_1.VoipRoom.findOneByIdAndVisitorToken(rid, token, { projection: api_1.API.v1.defaultFieldsToExclude });
            if (!room) {
                return api_1.API.v1.failure('invalid-room');
            }
            return api_1.API.v1.success({ room, newRoom: false });
        });
    },
});
api_1.API.v1.addRoute('voip/rooms', { authRequired: true, validateParams: rest_typings_1.isVoipRoomsProps }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort, fields } = yield this.parseJsonQuery();
            const { agents, open, tags, queue, visitorId, direction, roomName } = this.queryParams;
            const { createdAt: createdAtParam, closedAt: closedAtParam } = this.queryParams;
            // Reusing same L room permissions for simplicity
            const hasAdminAccess = yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'view-livechat-rooms');
            const hasAgentAccess = (yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'view-l-room')) && (agents === null || agents === void 0 ? void 0 : agents.includes(this.userId)) && (agents === null || agents === void 0 ? void 0 : agents.length) === 1;
            if (!hasAdminAccess && !hasAgentAccess) {
                return api_1.API.v1.unauthorized();
            }
            const createdAt = parseAndValidate('createdAt', createdAtParam);
            const closedAt = parseAndValidate('closedAt', closedAtParam);
            return api_1.API.v1.success(yield core_services_1.LivechatVoip.findVoipRooms({
                agents,
                open: open === 'true',
                tags,
                queue,
                visitorId,
                createdAt,
                closedAt,
                direction,
                roomName,
                options: { sort, offset, count, fields },
            }));
        });
    },
});
/**
 * @openapi
 *  /voip/server/api/v1/voip/room.close
 *    post:
 *      description: Closes an open room
 * 		based on rid and token. Setting rate limit for this too
 * 		Because room creation happens 5/minute, rate limit for this api
 * 		is also set to 5/minute.
 *      security:
 *		requestBody:
 *      required: true
 *      content:
 *			application/json:
 *          schema:
 *          	type: object
 *			  	properties:
 *					rid:
 *                 		type: string
 *					token:
 *						type: string
 *      responses:
 *        200:
 *          description: rid of closed room and a comment for closing room
 *          content:
 *            application/json:
 *              schema:
 *                allOf:
 *                  - $ref: '#/components/schemas/ApiSuccessV1'
 *                  - type: object
 *                    properties:
 *                      rid:
 *                        	type: string
 *                      comment:
 *                      	type: string
 *        default:
 *          description: Unexpected error
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ApiFailureV1'
 */
api_1.API.v1.addRoute('voip/room.close', { authRequired: true, validateParams: rest_typings_1.isVoipRoomCloseProps, permissionsRequired: ['inbound-voip-calls'] }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { rid, token, options } = this.bodyParams;
            const visitor = yield models_1.LivechatVisitors.getVisitorByToken(token, {});
            if (!visitor) {
                return api_1.API.v1.failure('invalid-token');
            }
            const room = yield core_services_1.LivechatVoip.findRoom(token, rid);
            if (!room) {
                return api_1.API.v1.failure('invalid-room');
            }
            if (!room.open) {
                return api_1.API.v1.failure('room-closed');
            }
            const closeResult = yield core_services_1.LivechatVoip.closeRoom(visitor, room, this.user, 'voip-call-wrapup', options);
            if (!closeResult) {
                return api_1.API.v1.failure();
            }
            return api_1.API.v1.success({ rid });
        });
    },
});
