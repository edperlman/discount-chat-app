"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamMemberRaw = void 0;
const BaseRaw_1 = require("./BaseRaw");
class TeamMemberRaw extends BaseRaw_1.BaseRaw {
    constructor(db, trash) {
        super(db, 'team_member', trash);
    }
    modelIndexes() {
        return [
            {
                key: { teamId: 1 },
            },
            {
                key: { teamId: 1, userId: 1 },
                unique: true,
            },
        ];
    }
    findByUserId(userId, options) {
        return options ? this.col.find({ userId }, options) : this.col.find({ userId }, options);
    }
    findOneByUserIdAndTeamId(userId, teamId, options) {
        return options ? this.col.findOne({ userId, teamId }, options) : this.col.findOne({ userId, teamId }, options);
    }
    findByTeamId(teamId, options) {
        return options ? this.col.find({ teamId }, options) : this.col.find({ teamId }, options);
    }
    countByTeamId(teamId) {
        return this.countDocuments({ teamId });
    }
    findByTeamIds(teamIds, options) {
        return options ? this.col.find({ teamId: { $in: teamIds } }, options) : this.col.find({ teamId: { $in: teamIds } }, options);
    }
    findByTeamIdAndRole(teamId, role, options) {
        return options ? this.col.find({ teamId, roles: role }, options) : this.col.find({ teamId, roles: role });
    }
    countByTeamIdAndRole(teamId, role) {
        return this.countDocuments({ teamId, roles: role });
    }
    findByUserIdAndTeamIds(userId, teamIds, options = {}) {
        const query = {
            userId,
            teamId: {
                $in: teamIds,
            },
        };
        return this.col.find(query, options);
    }
    findPaginatedMembersInfoByTeamId(teamId, limit, skip, query) {
        return this.findPaginated(Object.assign(Object.assign({}, query), { teamId }), {
            limit,
            skip,
            projection: {
                userId: 1,
                roles: 1,
                createdBy: 1,
                createdAt: 1,
            },
        });
    }
    updateOneByUserIdAndTeamId(userId, teamId, update) {
        return this.updateOne({ userId, teamId }, { $set: update });
    }
    createOneByTeamIdAndUserId(teamId, userId, createdBy) {
        return this.insertOne({
            teamId,
            userId,
            createdAt: new Date(),
            createdBy,
            _updatedAt: new Date(),
        });
    }
    updateRolesByTeamIdAndUserId(teamId, userId, roles) {
        return this.updateOne({
            teamId,
            userId,
        }, {
            $addToSet: {
                roles: { $each: roles },
            },
        });
    }
    removeRolesByTeamIdAndUserId(teamId, userId, roles) {
        return this.updateOne({
            teamId,
            userId,
        }, {
            $pull: {
                roles: { $in: roles },
            },
        });
    }
    deleteByUserIdAndTeamId(userId, teamId) {
        return this.col.deleteOne({
            teamId,
            userId,
        });
    }
    deleteByTeamId(teamId) {
        return this.col.deleteMany({
            teamId,
        });
    }
}
exports.TeamMemberRaw = TeamMemberRaw;
