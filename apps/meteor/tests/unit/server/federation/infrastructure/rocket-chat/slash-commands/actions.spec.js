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
const { normalizeExternalInviteeId, executeSlashCommand } = proxyquire_1.default
    .noCallThru()
    .load('../../../../../../../server/services/federation/infrastructure/rocket-chat/slash-commands/action', {
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
describe('Federation - Infrastructure - RocketChat - Server Slash command', () => {
    const command = sinon_1.default.stub();
    describe('#normalizeExternalInviteeId()', () => {
        it('should add a "@" in front of the string, removing all "@" in the original string if any', () => {
            (0, chai_1.expect)(normalizeExternalInviteeId('@exter@nal@:server-name.com')).to.be.equal('@external:server-name.com');
        });
    });
    describe('#executeSlashCommand()', () => {
        const validCommands = {
            dm: (currentUserId, roomId, invitee) => __awaiter(void 0, void 0, void 0, function* () { return command(currentUserId, roomId, invitee); }),
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
                (0, chai_1.expect)(e.message).to.be.equal('Invalid userId format for federation command.');
            }
        }));
        it('should throw an error if the inviter does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield executeSlashCommand('federation', 'dm @user:server.com', {}, validCommands, currentUserId);
            }
            catch (e) {
                (0, chai_1.expect)(e.message).to.be.equal('Invalid userId format for federation command.');
            }
        }));
        it('should throw an error if the LOCAL inviter is trying to invite another LOCAL user', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield executeSlashCommand('federation', 'dm @normalUser:server.com', {}, validCommands, currentUserId);
            }
            catch (e) {
                (0, chai_1.expect)(e.message).to.be.equal('Invalid userId format for federation command.');
            }
        }));
        it('should call the command function without any error', () => __awaiter(void 0, void 0, void 0, function* () {
            yield executeSlashCommand('federation', 'dm @external:server.com', { rid: 'roomId' }, validCommands, currentUserId);
            (0, chai_1.expect)(command.calledWith(currentUserId, 'roomId', '@external:server.com')).to.be.true;
        }));
    });
});
