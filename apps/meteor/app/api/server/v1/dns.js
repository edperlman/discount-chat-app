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
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const resolveDNS_1 = require("../../../federation/server/functions/resolveDNS");
const api_1 = require("../api");
/**
 * @openapi
 *  /api/v1/dns.resolve.srv:
 * 	  get:
 *      description: Resolves DNS service records (SRV records) for a hostname
 *      security:
 *        $ref: '#/security/authenticated'
 *      parameters:
 *        - name: url
 *          in: query
 *          description: The hostname
 *          required: true
 *          schema:
 *            type: string
 *          example: open.rocket.chat
 *      responses:
 *        200:
 *          description: The resolved records
 *          content:
 *            application/json:
 *              schema:
 *                allOf:
 *                  - $ref: '#/components/schemas/ApiSuccessV1'
 *                  - type: object
 *                    properties:
 *                      resolved:
 *                        type: object
 *                        properties:
 *                          target:
 *                            type: string
 *                          priority:
 *                            type: number
 *                          weight:
 *                            type: number
 *                          port:
 *                            type: number
 *        default:
 *          description: Unexpected error
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ApiFailureV1'
 */
api_1.API.v1.addRoute('dns.resolve.srv', { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(this.queryParams, check_1.Match.ObjectIncluding({
                url: String,
            }));
            const { url } = this.queryParams;
            if (!url) {
                throw new meteor_1.Meteor.Error('error-missing-param', 'The required "url" param is missing.');
            }
            const resolved = yield (0, resolveDNS_1.resolveSRV)(url);
            return api_1.API.v1.success({ resolved });
        });
    },
});
/**
 * @openapi
 *  /api/v1/dns.resolve.txt:
 * 	  get:
 *      description: Resolves DNS text records (TXT records) for a hostname
 *      security:
 *        $ref: '#/security/authenticated'
 *      parameters:
 *        - name: url
 *          in: query
 *          description: The hostname
 *          required: true
 *          schema:
 *            type: string
 *          example: open.rocket.chat
 *      responses:
 *        200:
 *          description: The resolved records
 *          content:
 *            application/json:
 *              schema:
 *                allOf:
 *                  - $ref: '#/components/schemas/ApiSuccessV1'
 *                  - type: object
 *                    properties:
 *                      resolved:
 *                        type: string
 *        default:
 *          description: Unexpected error
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ApiFailureV1'
 */
api_1.API.v1.addRoute('dns.resolve.txt', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(this.queryParams, check_1.Match.ObjectIncluding({
                url: String,
            }));
            const { url } = this.queryParams;
            if (!url) {
                throw new meteor_1.Meteor.Error('error-missing-param', 'The required "url" param is missing.');
            }
            const resolved = yield (0, resolveDNS_1.resolveTXT)(url);
            return api_1.API.v1.success({ resolved });
        });
    },
});
