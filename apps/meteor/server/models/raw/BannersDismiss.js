"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannersDismissRaw = void 0;
const BaseRaw_1 = require("./BaseRaw");
class BannersDismissRaw extends BaseRaw_1.BaseRaw {
    constructor(db, trash) {
        super(db, 'banner_dismiss', trash);
    }
    modelIndexes() {
        return [{ key: { userId: 1, bannerId: 1 } }];
    }
    findByUserIdAndBannerId(userId, bannerIds, options) {
        const query = {
            userId,
            bannerId: { $in: bannerIds },
        };
        return options ? this.col.find(query, options) : this.col.find(query);
    }
}
exports.BannersDismissRaw = BannersDismissRaw;
