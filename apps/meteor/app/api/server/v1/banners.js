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
const rest_typings_1 = require("@rocket.chat/rest-typings");
const api_1 = require("../api");
/**
 * @deprecated
 * @openapi
 *  /api/v1/banners.getNew:
 *    get:
 *      description: Gets the banners to be shown to the authenticated user
 *      deprecated: true
 *      security:
 *        $ref: '#/security/authenticated'
 *      parameters:
 *        - name: platform
 *          in: query
 *          description: The platform rendering the banner
 *          required: true
 *          schema:
 *            type: string
 *            enum: [web, mobile]
 *          example: web
 *        - name: bid
 *          in: query
 *          description: The id of a single banner
 *          required: false
 *          schema:
 *            type: string
 *          example: ByehQjC44FwMeiLbX
 *      responses:
 *        200:
 *          description: The banners matching the criteria
 *          content:
 *            application/json:
 *              schema:
 *                allOf:
 *                  - $ref: '#/components/schemas/ApiSuccessV1'
 *                  - type: object
 *                    properties:
 *                      banners:
 *                        type: array
 *                        items:
 *                           $ref: '#/components/schemas/IBanner'
 *        default:
 *          description: Unexpected error
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ApiFailureV1'
 */
api_1.API.v1.addRoute('banners.getNew', { authRequired: true, validateParams: rest_typings_1.isBannersGetNewProps, deprecation: { version: '8.0.0', alternatives: ['banners/:id', 'banners'] } }, {
    // deprecated
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { platform, bid: bannerId } = this.queryParams;
            const banners = yield core_services_1.Banner.getBannersForUser(this.userId, platform, bannerId !== null && bannerId !== void 0 ? bannerId : undefined);
            return api_1.API.v1.success({ banners });
        });
    },
});
/**
 * @openapi
 *  /api/v1/banners/{id}:
 *    get:
 *      description: Gets the banner to be shown to the authenticated user
 *      security:
 *        $ref: '#/security/authenticated'
 *      parameters:
 *        - name: platform
 *          in: query
 *          description: The platform rendering the banner
 *          required: true
 *          schema:
 *            type: string
 *            enum: [web, mobile]
 *          example: web
 *        - name: id
 *          in: path
 *          description: The id of the banner
 *          required: true
 *          schema:
 *            type: string
 *          example: ByehQjC44FwMeiLbX
 *      responses:
 *        200:
 *          description: |
 *            A collection with a single banner matching the criteria; an empty
 *            collection otherwise
 *          content:
 *            application/json:
 *              schema:
 *                allOf:
 *                  - $ref: '#/components/schemas/ApiSuccessV1'
 *                  - type: object
 *                    properties:
 *                      banners:
 *                        type: array
 *                        items:
 *                          $ref: '#/components/schemas/IBanner'
 *        default:
 *          description: Unexpected error
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ApiFailureV1'
 */
api_1.API.v1.addRoute('banners/:id', { authRequired: true, validateParams: rest_typings_1.isBannersProps }, {
    // TODO: move to users/:id/banners
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { platform } = this.queryParams;
            const { id } = this.urlParams;
            const banners = yield core_services_1.Banner.getBannersForUser(this.userId, platform, id);
            return api_1.API.v1.success({ banners });
        });
    },
});
/**
 * @openapi
 *  /api/v1/banners:
 *    get:
 *      description: Gets the banners to be shown to the authenticated user
 *      security:
 *        $ref: '#/security/authenticated'
 *      parameters:
 *        - name: platform
 *          in: query
 *          description: The platform rendering the banner
 *          required: true
 *          schema:
 *            type: string
 *            enum: [web, mobile]
 *          example: web
 *      responses:
 *        200:
 *          description: The banners matching the criteria
 *          content:
 *            application/json:
 *              schema:
 *                allOf:
 *                  - $ref: '#/components/schemas/ApiSuccessV1'
 *                  - type: object
 *                    properties:
 *                      banners:
 *                        type: array
 *                        items:
 *                          $ref: '#/components/schemas/IBanner'
 *        default:
 *          description: Unexpected error
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ApiFailureV1'
 */
api_1.API.v1.addRoute('banners', { authRequired: true, validateParams: rest_typings_1.isBannersProps }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { platform } = this.queryParams;
            const banners = yield core_services_1.Banner.getBannersForUser(this.userId, platform);
            return api_1.API.v1.success({ banners });
        });
    },
});
/**
 * @openapi
 *  /api/v1/banners.dismiss:
 *    post:
 *      description: Dismisses a banner
 *      security:
 *        $ref: '#/security/authenticated'
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                bannerId:
 *                  type: string
 *            example: |
 *              {
 *                 "bannerId": "ByehQjC44FwMeiLbX"
 *              }
 *      responses:
 *        200:
 *          description: The banners matching the criteria
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ApiSuccessV1'
 *        default:
 *          description: Unexpected error
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ApiFailureV1'
 */
api_1.API.v1.addRoute('banners.dismiss', { authRequired: true, validateParams: rest_typings_1.isBannersDismissProps }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { bannerId } = this.bodyParams;
            yield core_services_1.Banner.dismiss(this.userId, bannerId);
            return api_1.API.v1.success();
        });
    },
});
