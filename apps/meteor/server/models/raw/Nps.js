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
exports.NpsRaw = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const BaseRaw_1 = require("./BaseRaw");
class NpsRaw extends BaseRaw_1.BaseRaw {
    constructor(db, trash) {
        super(db, 'nps', trash);
    }
    modelIndexes() {
        return [{ key: { status: 1, expireAt: 1 } }];
    }
    // get expired surveys still in progress
    getOpenExpiredAndStartSending() {
        return __awaiter(this, void 0, void 0, function* () {
            const today = new Date();
            const query = {
                status: core_typings_1.NPSStatus.OPEN,
                expireAt: { $lte: today },
            };
            const update = {
                $set: {
                    status: core_typings_1.NPSStatus.SENDING,
                },
            };
            const { value } = yield this.findOneAndUpdate(query, update, { sort: { expireAt: 1 } });
            return value;
        });
    }
    // get expired surveys already sending results
    getOpenExpiredAlreadySending() {
        return __awaiter(this, void 0, void 0, function* () {
            const today = new Date();
            const query = {
                status: core_typings_1.NPSStatus.SENDING,
                expireAt: { $lte: today },
            };
            return this.col.findOne(query);
        });
    }
    updateStatusById(_id, status) {
        const update = {
            $set: {
                status,
            },
        };
        return this.col.updateOne({ _id }, update);
    }
    save({ _id, startAt, expireAt, createdBy, status, }) {
        return this.col.updateOne({
            _id,
        }, {
            $set: {
                startAt,
                _updatedAt: new Date(),
            },
            $setOnInsert: {
                expireAt,
                createdBy,
                createdAt: new Date(),
                status,
            },
        }, {
            upsert: true,
        });
    }
    closeAllByStatus(status) {
        const query = {
            status,
        };
        const update = {
            $set: {
                status: core_typings_1.NPSStatus.CLOSED,
            },
        };
        return this.col.updateMany(query, update);
    }
}
exports.NpsRaw = NpsRaw;
