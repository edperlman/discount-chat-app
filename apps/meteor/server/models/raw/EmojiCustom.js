"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmojiCustomRaw = void 0;
const BaseRaw_1 = require("./BaseRaw");
class EmojiCustomRaw extends BaseRaw_1.BaseRaw {
    constructor(db, trash) {
        super(db, 'custom_emoji', trash);
    }
    modelIndexes() {
        return [{ key: { name: 1 } }, { key: { aliases: 1 } }, { key: { extension: 1 } }];
    }
    // find
    findByNameOrAlias(emojiName, options) {
        let name = emojiName;
        if (typeof emojiName === 'string') {
            name = emojiName.replace(/:/g, '');
        }
        const query = {
            $or: [{ name }, { aliases: name }],
        };
        return this.find(query, options);
    }
    findByNameOrAliasExceptID(name, except, options) {
        const query = {
            _id: { $nin: [except] },
            $or: [{ name }, { aliases: name }],
        };
        return this.find(query, options);
    }
    // update
    setName(_id, name) {
        const update = {
            $set: {
                name,
            },
        };
        return this.updateOne({ _id }, update);
    }
    setAliases(_id, aliases) {
        const update = {
            $set: {
                aliases,
            },
        };
        return this.updateOne({ _id }, update);
    }
    setExtension(_id, extension) {
        const update = {
            $set: {
                extension,
            },
        };
        return this.updateOne({ _id }, update);
    }
    setETagByName(name, etag) {
        const update = {
            $set: {
                etag,
            },
        };
        return this.updateOne({ name }, update);
    }
    // INSERT
    create(data) {
        return this.insertOne(data);
    }
    countByNameOrAlias(name) {
        const query = {
            $or: [{ name }, { aliases: name }],
        };
        return this.countDocuments(query);
    }
}
exports.EmojiCustomRaw = EmojiCustomRaw;
