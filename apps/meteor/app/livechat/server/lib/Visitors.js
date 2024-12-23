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
exports.Visitors = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const logger_1 = require("@rocket.chat/logger");
const models_1 = require("@rocket.chat/models");
const Helper_1 = require("./Helper");
const server_1 = require("../../../settings/server");
const logger = new logger_1.Logger('Livechat - Visitor');
exports.Visitors = {
    isValidObject(obj) {
        return typeof obj === 'object' && obj !== null;
    },
    registerGuest(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, token, name, phone, email, department, username, connectionData, status = core_typings_1.UserStatus.ONLINE, }) {
            check(token, String);
            check(id, Match.Maybe(String));
            logger.debug(`New incoming conversation: id: ${id} | token: ${token}`);
            const visitorDataToUpdate = Object.assign(Object.assign({ token,
                status }, ((phone === null || phone === void 0 ? void 0 : phone.number) && { phone: [{ phoneNumber: phone.number }] })), (name && { name }));
            if (email) {
                const visitorEmail = email.trim().toLowerCase();
                (0, Helper_1.validateEmail)(visitorEmail);
                visitorDataToUpdate.visitorEmails = [{ address: visitorEmail }];
            }
            const livechatVisitor = yield models_1.LivechatVisitors.getVisitorByToken(token, { projection: { _id: 1 } });
            if (department && (livechatVisitor === null || livechatVisitor === void 0 ? void 0 : livechatVisitor.department) !== department) {
                logger.debug(`Attempt to find a department with id/name ${department}`);
                const dep = yield models_1.LivechatDepartment.findOneByIdOrName(department, { projection: { _id: 1 } });
                if (!dep) {
                    logger.debug(`Invalid department provided: ${department}`);
                    throw new Meteor.Error('error-invalid-department', 'The provided department is invalid');
                }
                logger.debug(`Assigning visitor ${token} to department ${dep._id}`);
                visitorDataToUpdate.department = dep._id;
            }
            visitorDataToUpdate.token = (livechatVisitor === null || livechatVisitor === void 0 ? void 0 : livechatVisitor.token) || token;
            let existingUser = null;
            if (livechatVisitor) {
                logger.debug('Found matching user by token');
                visitorDataToUpdate._id = livechatVisitor._id;
            }
            else if ((phone === null || phone === void 0 ? void 0 : phone.number) && (existingUser = yield models_1.LivechatVisitors.findOneVisitorByPhone(phone.number))) {
                logger.debug('Found matching user by phone number');
                visitorDataToUpdate._id = existingUser._id;
                // Don't change token when matching by phone number, use current visitor token
                visitorDataToUpdate.token = existingUser.token;
            }
            else if (email && (existingUser = yield models_1.LivechatVisitors.findOneGuestByEmailAddress(email))) {
                logger.debug('Found matching user by email');
                visitorDataToUpdate._id = existingUser._id;
            }
            else if (!livechatVisitor) {
                logger.debug(`No matches found. Attempting to create new user with token ${token}`);
                visitorDataToUpdate._id = id || undefined;
                visitorDataToUpdate.username = username || (yield models_1.LivechatVisitors.getNextVisitorUsername());
                visitorDataToUpdate.status = status;
                visitorDataToUpdate.ts = new Date();
                if (server_1.settings.get('Livechat_Allow_collect_and_store_HTTP_header_informations') && this.isValidObject(connectionData)) {
                    logger.debug(`Saving connection data for visitor ${token}`);
                    const { httpHeaders, clientAddress } = connectionData;
                    if (this.isValidObject(httpHeaders)) {
                        visitorDataToUpdate.userAgent = httpHeaders['user-agent'];
                        visitorDataToUpdate.ip = httpHeaders['x-real-ip'] || httpHeaders['x-forwarded-for'] || clientAddress;
                        visitorDataToUpdate.host = httpHeaders === null || httpHeaders === void 0 ? void 0 : httpHeaders.host;
                    }
                }
            }
            const upsertedLivechatVisitor = yield models_1.LivechatVisitors.updateOneByIdOrToken(visitorDataToUpdate, {
                upsert: true,
                returnDocument: 'after',
            });
            if (!upsertedLivechatVisitor.value) {
                logger.debug(`No visitor found after upsert`);
                return null;
            }
            return upsertedLivechatVisitor.value;
        });
    },
};
