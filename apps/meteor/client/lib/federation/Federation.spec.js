"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const Federation = __importStar(require("./Federation"));
const client_1 = require("../../../app/models/client");
const IRoomTypeConfig_1 = require("../../../definition/IRoomTypeConfig");
jest.mock('../../../app/models/client', () => ({
    RoomRoles: {
        findOne: jest.fn(),
    },
}));
afterEach(() => {
    client_1.RoomRoles.findOne.mockClear();
});
describe('#actionAllowed()', () => {
    const me = 'user-id';
    const them = 'other-user-id';
    it('should return false if the room is not federated', () => {
        expect(Federation.actionAllowed({ federated: false }, IRoomTypeConfig_1.RoomMemberActions.REMOVE_USER, 'user-id', { roles: ['owner'] })).toBe(false);
    });
    it('should return false if the room is a direct message', () => {
        expect(Federation.actionAllowed({ federated: true, t: 'd' }, IRoomTypeConfig_1.RoomMemberActions.REMOVE_USER, 'user-id', {
            roles: ['owner'],
        })).toBe(false);
    });
    it('should return false if the user is not subscribed to the room', () => {
        expect(Federation.actionAllowed({ federated: true }, IRoomTypeConfig_1.RoomMemberActions.REMOVE_USER, 'user-id', undefined)).toBe(false);
    });
    it('should return false if the user is trying to remove himself', () => {
        expect(Federation.actionAllowed({ federated: true }, IRoomTypeConfig_1.RoomMemberActions.REMOVE_USER, 'user-id', {
            u: { _id: 'user-id' },
            roles: ['owner'],
        })).toBe(false);
    });
    describe('Owners', () => {
        const myRole = ['owner'];
        describe('Seeing another owners', () => {
            const theirRole = ['owner'];
            it('should return true if the user want to remove himself as an owner', () => {
                client_1.RoomRoles.findOne.mockReturnValue({ roles: theirRole });
                expect(Federation.actionAllowed({ federated: true }, IRoomTypeConfig_1.RoomMemberActions.SET_AS_OWNER, me, {
                    u: { _id: me },
                    roles: myRole,
                })).toBe(true);
            });
            it('should return true if the user want to add himself as a moderator (Demoting himself to moderator)', () => {
                client_1.RoomRoles.findOne.mockReturnValue({ roles: theirRole });
                expect(Federation.actionAllowed({ federated: true }, IRoomTypeConfig_1.RoomMemberActions.SET_AS_MODERATOR, me, {
                    u: { _id: me },
                    roles: myRole,
                })).toBe(true);
            });
            it('should return false if the user want to remove another owners as an owner', () => {
                client_1.RoomRoles.findOne.mockReturnValue({ roles: theirRole });
                expect(Federation.actionAllowed({ federated: true }, IRoomTypeConfig_1.RoomMemberActions.SET_AS_OWNER, me, {
                    u: { _id: them },
                    roles: myRole,
                })).toBe(false);
            });
            it('should return false if the user want to remove another owners from the room', () => {
                client_1.RoomRoles.findOne.mockReturnValue({ roles: theirRole });
                expect(Federation.actionAllowed({ federated: true }, IRoomTypeConfig_1.RoomMemberActions.REMOVE_USER, me, {
                    u: { _id: them },
                    roles: myRole,
                })).toBe(false);
            });
        });
        describe('Seeing moderators', () => {
            const theirRole = ['moderator'];
            it('should return true if the user want to add/remove moderators as an owner', () => {
                client_1.RoomRoles.findOne.mockReturnValue({ roles: theirRole });
                expect(Federation.actionAllowed({ federated: true }, IRoomTypeConfig_1.RoomMemberActions.SET_AS_OWNER, me, {
                    u: { _id: them },
                    roles: myRole,
                })).toBe(true);
            });
            it('should return true if the user want to remove moderators as a moderator', () => {
                client_1.RoomRoles.findOne.mockReturnValue({ roles: theirRole });
                expect(Federation.actionAllowed({ federated: true }, IRoomTypeConfig_1.RoomMemberActions.SET_AS_MODERATOR, me, {
                    u: { _id: them },
                    roles: myRole,
                })).toBe(true);
            });
            it('should return true if the user want to remove moderators from the room', () => {
                client_1.RoomRoles.findOne.mockReturnValue({ roles: theirRole });
                expect(Federation.actionAllowed({ federated: true }, IRoomTypeConfig_1.RoomMemberActions.REMOVE_USER, me, {
                    u: { _id: them },
                    roles: myRole,
                })).toBe(true);
            });
        });
        describe('Seeing normal users', () => {
            it('should return true if the user want to add/remove normal users as an owner', () => {
                client_1.RoomRoles.findOne.mockReturnValue(undefined);
                expect(Federation.actionAllowed({ federated: true }, IRoomTypeConfig_1.RoomMemberActions.SET_AS_OWNER, me, {
                    u: { _id: them },
                    roles: myRole,
                })).toBe(true);
            });
            it('should return true if the user want to add/remove normal users as a moderator', () => {
                client_1.RoomRoles.findOne.mockReturnValue(undefined);
                expect(Federation.actionAllowed({ federated: true }, IRoomTypeConfig_1.RoomMemberActions.SET_AS_MODERATOR, me, {
                    u: { _id: them },
                    roles: myRole,
                })).toBe(true);
            });
            it('should return true if the user want to remove normal users from the room', () => {
                client_1.RoomRoles.findOne.mockReturnValue(undefined);
                expect(Federation.actionAllowed({ federated: true }, IRoomTypeConfig_1.RoomMemberActions.REMOVE_USER, me, {
                    u: { _id: them },
                    roles: myRole,
                })).toBe(true);
            });
        });
    });
    describe('Moderators', () => {
        const myRole = ['moderator'];
        describe('Seeing owners', () => {
            const theirRole = ['owner'];
            it('should return false if the user want to add/remove owners as a moderator', () => {
                client_1.RoomRoles.findOne.mockReturnValue({ roles: theirRole });
                expect(Federation.actionAllowed({ federated: true }, IRoomTypeConfig_1.RoomMemberActions.SET_AS_OWNER, me, {
                    u: { _id: me },
                    roles: myRole,
                })).toBe(false);
            });
            it('should return false if the user want to add/remove owners as a moderator', () => {
                client_1.RoomRoles.findOne.mockReturnValue({ roles: theirRole });
                expect(Federation.actionAllowed({ federated: true }, IRoomTypeConfig_1.RoomMemberActions.SET_AS_MODERATOR, me, {
                    u: { _id: me },
                    roles: myRole,
                })).toBe(false);
            });
            it('should return false if the user want to add/remove owners as a moderator', () => {
                client_1.RoomRoles.findOne.mockReturnValue({ roles: theirRole });
                expect(Federation.actionAllowed({ federated: true }, IRoomTypeConfig_1.RoomMemberActions.SET_AS_MODERATOR, me, {
                    u: { _id: me },
                    roles: myRole,
                })).toBe(false);
            });
            it('should return false if the user want to remove owners from the room', () => {
                client_1.RoomRoles.findOne.mockReturnValue({ roles: theirRole });
                expect(Federation.actionAllowed({ federated: true }, IRoomTypeConfig_1.RoomMemberActions.REMOVE_USER, me, {
                    u: { _id: me },
                    roles: myRole,
                })).toBe(false);
            });
        });
        describe('Seeing another moderators', () => {
            const theirRole = ['moderator'];
            it('should return false if the user want to add/remove moderator as an owner', () => {
                client_1.RoomRoles.findOne.mockReturnValue({ roles: theirRole });
                expect(Federation.actionAllowed({ federated: true }, IRoomTypeConfig_1.RoomMemberActions.SET_AS_OWNER, me, {
                    u: { _id: them },
                    roles: myRole,
                })).toBe(false);
            });
            it('should return true if the user want to remove himself as a moderator (Demoting himself)', () => {
                client_1.RoomRoles.findOne.mockReturnValue({ roles: theirRole });
                expect(Federation.actionAllowed({ federated: true }, IRoomTypeConfig_1.RoomMemberActions.SET_AS_MODERATOR, me, {
                    u: { _id: me },
                    roles: myRole,
                })).toBe(true);
            });
            it('should return false if the user want to promote himself as an owner', () => {
                client_1.RoomRoles.findOne.mockReturnValue({ roles: theirRole });
                expect(Federation.actionAllowed({ federated: true }, IRoomTypeConfig_1.RoomMemberActions.SET_AS_OWNER, me, {
                    u: { _id: me },
                    roles: myRole,
                })).toBe(false);
            });
            it('should return false if the user want to remove another moderator from their role', () => {
                client_1.RoomRoles.findOne.mockReturnValue({ roles: theirRole });
                expect(Federation.actionAllowed({ federated: true }, IRoomTypeConfig_1.RoomMemberActions.SET_AS_MODERATOR, me, {
                    u: { _id: them },
                    roles: myRole,
                })).toBe(false);
            });
            it('should return false if the user want to remove another moderator from the room', () => {
                client_1.RoomRoles.findOne.mockReturnValue({ roles: theirRole });
                expect(Federation.actionAllowed({ federated: true }, IRoomTypeConfig_1.RoomMemberActions.REMOVE_USER, me, {
                    u: { _id: them },
                    roles: myRole,
                })).toBe(false);
            });
        });
        describe('Seeing normal users', () => {
            it('should return false if the user want to add/remove normal users as an owner', () => {
                client_1.RoomRoles.findOne.mockReturnValue(undefined);
                expect(Federation.actionAllowed({ federated: true }, IRoomTypeConfig_1.RoomMemberActions.SET_AS_OWNER, me, {
                    u: { _id: them },
                    roles: myRole,
                })).toBe(false);
            });
            it('should return true if the user want to add/remove normal users as a moderator', () => {
                client_1.RoomRoles.findOne.mockReturnValue(undefined);
                expect(Federation.actionAllowed({ federated: true }, IRoomTypeConfig_1.RoomMemberActions.SET_AS_MODERATOR, me, {
                    u: { _id: them },
                    roles: myRole,
                })).toBe(true);
            });
            it('should return true if the user want to remove normal users from the room', () => {
                client_1.RoomRoles.findOne.mockReturnValue(undefined);
                expect(Federation.actionAllowed({ federated: true }, IRoomTypeConfig_1.RoomMemberActions.REMOVE_USER, me, {
                    u: { _id: them },
                    roles: myRole,
                })).toBe(true);
            });
        });
    });
    describe('Normal user', () => {
        describe('Seeing owners', () => {
            const theirRole = ['owner'];
            it('should return false if the user want to add/remove owners as a normal user', () => {
                client_1.RoomRoles.findOne.mockReturnValue({ roles: theirRole });
                expect(Federation.actionAllowed({ federated: true }, IRoomTypeConfig_1.RoomMemberActions.SET_AS_OWNER, me, {
                    u: { _id: them },
                })).toBe(false);
            });
            it('should return false if the user want to add/remove moderators as a normal user', () => {
                client_1.RoomRoles.findOne.mockReturnValue({ roles: theirRole });
                expect(Federation.actionAllowed({ federated: true }, IRoomTypeConfig_1.RoomMemberActions.SET_AS_MODERATOR, me, {
                    u: { _id: them },
                })).toBe(false);
            });
            it('should return false if the user want to remove owners from the room', () => {
                client_1.RoomRoles.findOne.mockReturnValue({ roles: theirRole });
                expect(Federation.actionAllowed({ federated: true }, IRoomTypeConfig_1.RoomMemberActions.REMOVE_USER, me, {
                    u: { _id: them },
                })).toBe(false);
            });
        });
        describe('Seeing moderators', () => {
            const theirRole = ['owner'];
            it('should return false if the user want to add/remove owner as a normal user', () => {
                client_1.RoomRoles.findOne.mockReturnValue({ roles: theirRole });
                expect(Federation.actionAllowed({ federated: true }, IRoomTypeConfig_1.RoomMemberActions.SET_AS_OWNER, me, {
                    u: { _id: them },
                })).toBe(false);
            });
            it('should return false if the user want to remove a moderator from their role', () => {
                client_1.RoomRoles.findOne.mockReturnValue({ roles: theirRole });
                expect(Federation.actionAllowed({ federated: true }, IRoomTypeConfig_1.RoomMemberActions.SET_AS_MODERATOR, me, {
                    u: { _id: them },
                })).toBe(false);
            });
            it('should return false if the user want to remove a moderator from the room', () => {
                client_1.RoomRoles.findOne.mockReturnValue({ roles: theirRole });
                expect(Federation.actionAllowed({ federated: true }, IRoomTypeConfig_1.RoomMemberActions.REMOVE_USER, me, {
                    u: { _id: them },
                })).toBe(false);
            });
        });
        describe('Seeing another normal users', () => {
            it('should return false if the user want to add/remove owner as a normal user', () => {
                client_1.RoomRoles.findOne.mockReturnValue(undefined);
                expect(Federation.actionAllowed({ federated: true }, IRoomTypeConfig_1.RoomMemberActions.SET_AS_OWNER, me, {
                    u: { _id: them },
                })).toBe(false);
            });
            it('should return false if the user want to add/remove moderator as a normal user', () => {
                client_1.RoomRoles.findOne.mockReturnValue(undefined);
                expect(Federation.actionAllowed({ federated: true }, IRoomTypeConfig_1.RoomMemberActions.SET_AS_OWNER, me, {
                    u: { _id: them },
                })).toBe(false);
            });
            it('should return false if the user want to remove normal users from the room', () => {
                client_1.RoomRoles.findOne.mockReturnValue(undefined);
                expect(Federation.actionAllowed({ federated: true }, IRoomTypeConfig_1.RoomMemberActions.REMOVE_USER, me, {
                    u: { _id: them },
                })).toBe(false);
            });
            it.each([[IRoomTypeConfig_1.RoomMemberActions.SET_AS_MODERATOR], [IRoomTypeConfig_1.RoomMemberActions.SET_AS_OWNER], [IRoomTypeConfig_1.RoomMemberActions.REMOVE_USER]])('should return false if the user want to %s for himself', (action) => {
                client_1.RoomRoles.findOne.mockReturnValue(undefined);
                expect(Federation.actionAllowed({ federated: true }, action, me, {
                    u: { _id: me },
                })).toBe(false);
            });
        });
    });
});
describe('#isEditableByTheUser()', () => {
    it('should return false if the user is null', () => {
        expect(Federation.isEditableByTheUser(undefined, { u: { _id: 'id' } }, {})).toBe(false);
    });
    it('should return false if the room is null', () => {
        expect(Federation.isEditableByTheUser({}, undefined, {})).toBe(false);
    });
    it('should return false if the subscription is null', () => {
        expect(Federation.isEditableByTheUser({}, {}, undefined)).toBe(false);
    });
    it('should return false if the current room is NOT a federated one', () => {
        expect(Federation.isEditableByTheUser({ _id: 'differentId' }, { u: { _id: 'id' } }, {})).toBe(false);
    });
    it('should return false if the current user is NOT the room owner nor moderator', () => {
        expect(Federation.isEditableByTheUser({ _id: 'differentId' }, { federated: true, u: { _id: 'id' } }, {})).toBe(false);
    });
    it('should return true if the current user is a room owner', () => {
        expect(Federation.isEditableByTheUser({ _id: 'differentId' }, { federated: true, u: { _id: 'id' } }, { roles: ['owner'] })).toBe(true);
    });
    it('should return true if the current user is a room moderator', () => {
        expect(Federation.isEditableByTheUser({ _id: 'differentId' }, { federated: true, u: { _id: 'id' } }, { roles: ['moderator'] })).toBe(true);
    });
});
describe('#canCreateInviteLinks()', () => {
    it('should return false if the user is null', () => {
        expect(Federation.canCreateInviteLinks(undefined, { u: { _id: 'id' } }, {})).toBe(false);
    });
    it('should return false if the room is null', () => {
        expect(Federation.canCreateInviteLinks({}, undefined, {})).toBe(false);
    });
    it('should return false if the subscription is null', () => {
        expect(Federation.canCreateInviteLinks({}, {}, undefined)).toBe(false);
    });
    it('should return false if the current room is NOT a federated one', () => {
        expect(Federation.canCreateInviteLinks({ _id: 'differentId' }, { u: { _id: 'id' } }, {})).toBe(false);
    });
    it('should return false if the current room is federated one but NOT a public one', () => {
        expect(Federation.canCreateInviteLinks({ _id: 'differentId' }, { federated: true, u: { _id: 'id' } }, {})).toBe(false);
    });
    it('should return false if the current room is federated one, a public one but the user is NOT an owner nor moderator', () => {
        expect(Federation.canCreateInviteLinks({ _id: 'differentId' }, { federated: true, t: 'c', u: { _id: 'id' } }, {})).toBe(false);
    });
    it('should return false if the current room is federated one, a public one but the user is NOT an owner nor moderator', () => {
        expect(Federation.canCreateInviteLinks({ _id: 'differentId' }, { federated: true, t: 'c', u: { _id: 'id' } }, {})).toBe(false);
    });
    it('should return true if the current room is federated one, a public one but the user is an owner', () => {
        expect(Federation.canCreateInviteLinks({ _id: 'differentId' }, { federated: true, t: 'c', u: { _id: 'id' } }, { roles: ['owner'] })).toBe(true);
    });
    it('should return true if the current room is federated one, a public one but the user is an moderator', () => {
        expect(Federation.canCreateInviteLinks({ _id: 'differentId' }, { federated: true, t: 'c', u: { _id: 'id' } }, { roles: ['moderator'] })).toBe(true);
    });
});
describe('#isRoomSettingAllowed()', () => {
    it('should return false if the room is NOT federated', () => {
        expect(Federation.isRoomSettingAllowed({ t: 'c' }, IRoomTypeConfig_1.RoomSettingsEnum.NAME)).toBe(false);
    });
    it('should return false if the room is a DM one', () => {
        expect(Federation.isRoomSettingAllowed({ t: 'd', federated: true }, IRoomTypeConfig_1.RoomSettingsEnum.NAME)).toBe(false);
    });
    const allowedSettingsChanges = [IRoomTypeConfig_1.RoomSettingsEnum.NAME, IRoomTypeConfig_1.RoomSettingsEnum.TOPIC];
    Object.values(IRoomTypeConfig_1.RoomSettingsEnum)
        .filter((setting) => !allowedSettingsChanges.includes(setting))
        .forEach((setting) => {
        it('should return false if the setting change is NOT allowed within the federation context for regular channels', () => {
            expect(Federation.isRoomSettingAllowed({ t: 'c', federated: true }, setting)).toBe(false);
        });
    });
    allowedSettingsChanges.forEach((setting) => {
        it('should return true if the setting change is allowed within the federation context for regular channels', () => {
            expect(Federation.isRoomSettingAllowed({ t: 'c', federated: true }, setting)).toBe(true);
        });
    });
});
