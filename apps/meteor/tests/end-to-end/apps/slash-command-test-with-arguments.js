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
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const api_data_1 = require("../../data/api-data");
const helper_1 = require("../../data/apps/helper");
const constants_1 = require("../../e2e/config/constants");
(constants_1.IS_EE ? mocha_1.describe : mocha_1.describe.skip)('Apps - Slash Command "test-with-arguments"', () => {
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, helper_1.cleanupApps)();
        yield (0, helper_1.installTestApp)();
    }));
    (0, mocha_1.after)(() => (0, helper_1.cleanupApps)());
    (0, mocha_1.describe)('[Slash command "test-with-arguments"]', () => {
        const params = 'argument';
        (0, mocha_1.it)('should execute the slash command successfully', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('commands.run'))
                .send({
                roomId: 'GENERAL',
                command: 'test-with-arguments',
                params,
            })
                .set(api_data_1.credentials)
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', true);
            })
                .end(done);
        });
        (0, mocha_1.it)('should have sent the message correctly', (done) => {
            const searchText = `Slashcommand \'test-with-arguments\' successfully executed with arguments: "${params}"`;
            void api_data_1.request
                .get((0, api_data_1.api)('chat.search'))
                .query({
                roomId: 'GENERAL',
                searchText,
            })
                .set(api_data_1.credentials)
                .expect(200)
                .expect((res) => {
                const message = res.body.messages.find((message) => message.msg === searchText);
                (0, chai_1.expect)(message).to.not.be.equal(undefined);
            })
                .end(done);
        });
    });
});
