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
exports.ImportDataRaw = void 0;
const BaseRaw_1 = require("./BaseRaw");
class ImportDataRaw extends BaseRaw_1.BaseRaw {
    constructor(db, trash) {
        super(db, 'import_data', trash);
    }
    modelIndexes() {
        return [{ key: { dataType: 1 } }];
    }
    getAllUsers() {
        return this.find({ dataType: 'user' });
    }
    getAllMessages() {
        return this.find({ dataType: 'message' });
    }
    getAllChannels() {
        return this.find({ dataType: 'channel' });
    }
    getAllUsersForSelection() {
        return this.find({
            dataType: 'user',
        }, {
            projection: {
                'data.importIds': 1,
                'data.username': 1,
                'data.emails': 1,
                'data.deleted': 1,
                'data.type': 1,
            },
        }).toArray();
    }
    getAllChannelsForSelection() {
        return this.find({
            'dataType': 'channel',
            'data.t': {
                $ne: 'd',
            },
        }, {
            projection: {
                'data.importIds': 1,
                'data.name': 1,
                'data.archived': 1,
                'data.t': 1,
            },
        }).toArray();
    }
    getAllContactsForSelection() {
        return this.find({
            dataType: 'contact',
        }, {
            projection: {
                'data.importIds': 1,
                'data.name': 1,
                'data.phones': 1,
                'data.emails': 1,
            },
        }).toArray();
    }
    checkIfDirectMessagesExists() {
        return __awaiter(this, void 0, void 0, function* () {
            return ((yield this.col.countDocuments({
                'dataType': 'channel',
                'data.t': 'd',
            })) > 0);
        });
    }
    countMessages() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.col.countDocuments({ dataType: 'message' });
        });
    }
    findChannelImportIdByNameOrImportId(channelIdentifier) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const channel = yield this.findOne({
                dataType: 'channel',
                $or: [
                    {
                        'data.name': channelIdentifier,
                    },
                    {
                        'data.importIds': channelIdentifier,
                    },
                ],
            }, {
                projection: {
                    'data.importIds': 1,
                },
            });
            return (_b = (_a = channel === null || channel === void 0 ? void 0 : channel.data) === null || _a === void 0 ? void 0 : _a.importIds) === null || _b === void 0 ? void 0 : _b.shift();
        });
    }
}
exports.ImportDataRaw = ImportDataRaw;
