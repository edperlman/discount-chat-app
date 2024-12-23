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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const proxyquire_1 = __importDefault(require("proxyquire"));
const sinon_1 = __importDefault(require("sinon"));
const { executeSlashCommand } = proxyquire_1.default
    .noCallThru()
    .load('../../../../../../../../server/local-services/federation/infrastructure/rocket-chat/slash-commands/action', {
    '@rocket.chat/models': {
        Users: {
            findOneById: (invitee) => __awaiter(void 0, void 0, void 0, function* () {
                if (invitee.includes('normalUser')) {
                    return { username: 'username' };
                }
            }),
        },
    },
});
describe('FederationEE - Infrastructure - RocketChat - Server Slash command', () => {
    const command = sinon_1.default.stub();
    describe('#executeSlashCommand()', () => {
        const validCommands = {
            dm: (currentUserId, roomId, invitees) => __awaiter(void 0, void 0, void 0, function* () { return command(currentUserId, roomId, invitees); }),
        };
        const currentUserId = 'userId';
        it('should return undefined if the provided command is different of "federation"', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(yield executeSlashCommand('invalid-command', '', {}, validCommands)).to.be.equal(undefined);
        }));
        it('should return undefined if the command is valid but there is no string params', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(yield executeSlashCommand('federation', '', {}, validCommands)).to.be.equal(undefined);
        }));
        it('should return undefined if there is no currentUserId', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(yield executeSlashCommand('federation', 'params', {}, validCommands)).to.be.equal(undefined);
        }));
        it('should return undefined if the provided command is invalid/inexistent', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(yield executeSlashCommand('federation', 'params', {}, validCommands)).to.be.equal(undefined);
        }));
        it('should throw an error if the provided invitee is invalid (without any ":")', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield executeSlashCommand('federation', 'dm @user.server.com', {}, validCommands, currentUserId);
            }
            catch (e) {
                (0, chai_1.expect)(e.message).to.be.equal('At least one user must be external');
            }
        }));
        it('should throw an error if the inviter does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield executeSlashCommand('federation', 'dm @user:server.com', {}, validCommands, currentUserId);
            }
            catch (e) {
                (0, chai_1.expect)(e.message).to.be.equal('At least one user must be external');
            }
        }));
        it('should throw an error if there is no external users', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield executeSlashCommand('federation', 'dm @user1 @user2', {}, validCommands, currentUserId);
            }
            catch (e) {
                (0, chai_1.expect)(e.message).to.be.equal('At least one user must be external');
            }
        }));
        it('should throw an error if the LOCAL inviter is trying to invite another LOCAL user', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield executeSlashCommand('federation', 'dm @normalUser:server.com', {}, validCommands, currentUserId);
            }
            catch (e) {
                (0, chai_1.expect)(e.message).to.be.equal('At least one user must be external');
            }
        }));
        it('should call the command function without any error', () => __awaiter(void 0, void 0, void 0, function* () {
            yield executeSlashCommand('federation', 'dm @external:server.com', { rid: 'roomId' }, validCommands, currentUserId);
            (0, chai_1.expect)(command.calledWith(currentUserId, 'roomId', ['@external:server.com'])).to.be.true;
        }));
    });
});
