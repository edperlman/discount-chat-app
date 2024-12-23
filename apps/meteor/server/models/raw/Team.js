"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRaw = void 0;
const BaseRaw_1 = require("./BaseRaw");
class TeamRaw extends BaseRaw_1.BaseRaw {
    constructor(db, trash) {
        super(db, 'team', trash);
    }
    modelIndexes() {
        return [{ key: { name: 1 }, unique: true }];
    }
    findByNames(names, options) {
        if (options === undefined) {
            return this.col.find({ name: { $in: names } });
        }
        return this.col.find({ name: { $in: names } }, options);
    }
    findByIds(ids, options, query) {
        if (options === undefined) {
            return this.find(Object.assign(Object.assign({}, query), { _id: { $in: ids } }));
        }
        return this.find(Object.assign(Object.assign({}, query), { _id: { $in: ids } }), options);
    }
    findByIdsPaginated(ids, options, query) {
        if (options === undefined) {
            return this.findPaginated(Object.assign(Object.assign({}, query), { _id: { $in: ids } }));
        }
        return this.findPaginated(Object.assign(Object.assign({}, query), { _id: { $in: ids } }), options);
    }
    findByIdsAndType(ids, type, options) {
        if (options === undefined) {
            return this.col.find({ _id: { $in: ids }, type });
        }
        return this.col.find({ _id: { $in: ids }, type }, options);
    }
    findByType(type, options) {
        if (options === undefined) {
            return this.col.find({ type }, options);
        }
        return this.col.find({ type }, options);
    }
    findByNameAndTeamIds(name, teamIds, options) {
        if (options === undefined) {
            return this.col.find({
                name,
                $or: [
                    {
                        type: 0,
                    },
                    {
                        _id: {
                            $in: teamIds,
                        },
                    },
                ],
            });
        }
        return this.col.find({
            name,
            $or: [
                {
                    type: 0,
                },
                {
                    _id: {
                        $in: teamIds,
                    },
                },
            ],
        }, options);
    }
    findOneByName(name, options) {
        if (options === undefined) {
            return this.col.findOne({ name });
        }
        return this.col.findOne({ name }, options);
    }
    findOneByMainRoomId(roomId, options) {
        return options ? this.col.findOne({ roomId }, options) : this.col.findOne({ roomId });
    }
    updateMainRoomForTeam(id, roomId) {
        return this.updateOne({
            _id: id,
        }, {
            $set: {
                roomId,
            },
        });
    }
    deleteOneById(id) {
        return this.col.deleteOne({
            _id: id,
        });
    }
    deleteOneByName(name) {
        return this.col.deleteOne({ name });
    }
    updateNameAndType(teamId, nameAndType) {
        const query = {
            _id: teamId,
        };
        const update = {
            $set: {},
        };
        if (nameAndType.name) {
            Object.assign(update.$set, { name: nameAndType.name });
        }
        if (typeof nameAndType.type !== 'undefined') {
            Object.assign(update.$set, { type: nameAndType.type });
        }
        return this.updateOne(query, update);
    }
}
exports.TeamRaw = TeamRaw;
