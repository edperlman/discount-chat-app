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
exports.Mobex = void 0;
const base64_1 = require("@rocket.chat/base64");
const server_fetch_1 = require("@rocket.chat/server-fetch");
const server_1 = require("../../../../app/settings/server");
const system_1 = require("../../../lib/logger/system");
const isMobexData = (data) => {
    if (typeof data !== 'object' || data === null) {
        return false;
    }
    const { from, to, content } = data;
    return typeof from === 'string' && typeof to === 'string' && typeof content === 'string';
};
class Mobex {
    constructor() {
        this.address = server_1.settings.get('SMS_Mobex_gateway_address');
        this.restAddress = server_1.settings.get('SMS_Mobex_restful_address');
        this.username = server_1.settings.get('SMS_Mobex_username');
        this.password = server_1.settings.get('SMS_Mobex_password');
        this.from = server_1.settings.get('SMS_Mobex_from_number');
    }
    parse(data) {
        let numMedia = 0;
        if (!isMobexData(data)) {
            throw new Error('Invalid data');
        }
        const returnData = {
            from: data.from,
            to: data.to,
            body: data.content,
        };
        if (data.NumMedia) {
            numMedia = parseInt(data.NumMedia, 10);
        }
        if (isNaN(numMedia)) {
            system_1.SystemLogger.error(`Error parsing NumMedia ${data.NumMedia}`);
            return returnData;
        }
        returnData.media = [];
        for (let mediaIndex = 0; mediaIndex < numMedia; mediaIndex++) {
            const media = {
                url: '',
                contentType: '',
            };
            const mediaUrl = data[`MediaUrl${mediaIndex}`];
            const contentType = data[`MediaContentType${mediaIndex}`];
            media.url = mediaUrl;
            media.contentType = contentType;
            returnData.media.push(media);
        }
        return returnData;
    }
    // @ts-expect-error -- typings :) for this method are wrong
    send(fromNumber, toNumber, message, extraData) {
        return __awaiter(this, void 0, void 0, function* () {
            let currentFrom = this.from;
            let currentUsername = this.username;
            let currentAddress = this.address;
            let currentPassword = this.password;
            const { username, password, address } = extraData;
            if (fromNumber) {
                currentFrom = fromNumber;
            }
            if (username && password) {
                currentUsername = username;
                currentPassword = password;
            }
            if (address) {
                currentAddress = address;
            }
            const strippedTo = toNumber.replace(/\D/g, '');
            const result = {
                isSuccess: false,
                resultMsg: 'An unknown error happened',
            };
            try {
                const response = yield (0, server_fetch_1.serverFetch)(`${currentAddress}/send`, {
                    params: {
                        username: currentUsername,
                        password: currentPassword,
                        to: strippedTo,
                        from: currentFrom,
                        content: message,
                    },
                });
                if (response.ok) {
                    result.resultMsg = yield response.text();
                    result.isSuccess = true;
                }
                else {
                    result.resultMsg = `Could not able to send SMS. Code:  ${response.status}`;
                }
            }
            catch (err) {
                result.resultMsg = `Error while sending SMS with Mobex. Detail: ${err}`;
                system_1.SystemLogger.error({ msg: 'Error while sending SMS with Mobex', err });
            }
            return result;
        });
    }
    sendBatch(fromNumber, toNumbersArr, message) {
        return __awaiter(this, void 0, void 0, function* () {
            let currentFrom = this.from;
            if (fromNumber) {
                currentFrom = fromNumber;
            }
            const result = {
                isSuccess: false,
                resultMsg: 'An unknown error happened',
                response: null,
            };
            const userPass = `${this.username}:${this.password}`;
            const authToken = base64_1.Base64.encode(userPass);
            try {
                const response = yield (0, server_fetch_1.serverFetch)(`${this.restAddress}/secure/sendbatch`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Basic ${authToken}`,
                    },
                    body: {
                        messages: [
                            {
                                to: toNumbersArr,
                                from: currentFrom,
                                content: message,
                            },
                        ],
                    },
                });
                result.isSuccess = response.ok;
                result.resultMsg = 'Success';
                result.response = yield response.text();
            }
            catch (err) {
                result.resultMsg = `Error while sending SMS with Mobex. Detail: ${err}`;
                system_1.SystemLogger.error({ msg: 'Error while sending SMS with Mobex', err });
            }
            return result;
        });
    }
    response() {
        return {
            headers: {
                'Content-Type': 'text/xml',
            },
            body: 'ACK/Jasmin',
        };
    }
    validateRequest(_request) {
        return true;
    }
    error(error) {
        let message = '';
        if (error.reason) {
            message = `<Message>${error.reason}</Message>`;
        }
        return {
            headers: {
                'Content-Type': 'text/xml',
            },
            body: `<Response>${message}</Response>`,
        };
    }
}
exports.Mobex = Mobex;
