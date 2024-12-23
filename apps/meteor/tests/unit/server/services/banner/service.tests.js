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
const models_1 = require("@rocket.chat/models");
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const proxyquire_1 = __importDefault(require("proxyquire"));
const sinon_1 = __importDefault(require("sinon"));
const BaseRaw_1 = require("../../../../../server/models/raw/BaseRaw");
const { BannerService } = proxyquire_1.default.noCallThru().load('../../../../../server/services/banner/service', {});
class BannerModel extends BaseRaw_1.BaseRaw {
    findActiveByRoleOrId(_roles, _platform, _bannerId, _options) {
        return {};
    }
}
class BannerDismissModel extends BaseRaw_1.BaseRaw {
    findByUserIdAndBannerId() {
        return {};
    }
}
class UserModel extends BaseRaw_1.BaseRaw {
    findOneById() {
        return Promise.resolve({});
    }
}
function findCursorFactory(items) {
    return {
        toArray: () => Promise.resolve(items),
    };
}
const bannersModel = new BannerModel({ collection: () => ({}) }, 'banner');
const bannerDismissModel = new BannerDismissModel({ collection: () => ({}) }, 'banner_dismiss');
const userModel = new UserModel({ collection: () => ({}) }, 'user');
(0, mocha_1.describe)('Banners service', () => {
    (0, mocha_1.before)(() => {
        (0, models_1.registerModel)('IBannersModel', bannersModel);
        (0, models_1.registerModel)('IBannersDismissModel', bannerDismissModel);
        (0, models_1.registerModel)('IUsersModel', userModel);
    });
    (0, mocha_1.afterEach)(() => sinon_1.default.restore());
    (0, mocha_1.it)('should be defined', () => {
        const service = new BannerService();
        (0, chai_1.expect)(service).to.be.an('object');
    });
    (0, mocha_1.describe)('getBannersForUser', () => {
        const FAKE_BANNER = {
            _id: 'fake-id',
            view: {
                appId: 'fake-app-id',
                viewId: 'fake-view-id',
            },
        };
        const A_SECOND_FAKE_BANNER = {
            _id: 'fake-id-2',
            surface: 'modal',
            view: {},
        };
        (0, mocha_1.it)('should return the banners a user has access to', () => __awaiter(void 0, void 0, void 0, function* () {
            const service = new BannerService();
            const findActiveByRoleOrIdMock = sinon_1.default.replace(bannersModel, 'findActiveByRoleOrId', sinon_1.default.fake.returns(findCursorFactory([FAKE_BANNER])));
            const findByUserIdAndBannerIdMock = sinon_1.default.replace(bannerDismissModel, 'findByUserIdAndBannerId', sinon_1.default.fake.returns(findCursorFactory([])));
            sinon_1.default.replace(userModel, 'findOneById', sinon_1.default.fake.returns(Promise.resolve({})));
            const banners = yield service.getBannersForUser('a-fake-id', 'web');
            (0, chai_1.expect)(findActiveByRoleOrIdMock.callCount).to.be.equal(1);
            (0, chai_1.expect)(findByUserIdAndBannerIdMock.callCount).to.be.equal(1);
            (0, chai_1.expect)(banners).to.be.an('array');
            (0, chai_1.expect)(banners).to.have.lengthOf(1);
            (0, chai_1.expect)(banners[0].view.viewId).to.be.equal(FAKE_BANNER.view.viewId);
            (0, chai_1.expect)(banners[0].surface).to.be.equal('banner');
        }));
        (0, mocha_1.it)('should return all the banners that were not dismissed', () => __awaiter(void 0, void 0, void 0, function* () {
            const service = new BannerService();
            const findActiveByRoleOrIdMock = sinon_1.default.replace(bannersModel, 'findActiveByRoleOrId', sinon_1.default.fake.returns(findCursorFactory([FAKE_BANNER])));
            const findByUserIdAndBannerIdMock = sinon_1.default.replace(bannerDismissModel, 'findByUserIdAndBannerId', sinon_1.default.fake.returns(findCursorFactory([{ bannerId: FAKE_BANNER._id }])));
            sinon_1.default.replace(userModel, 'findOneById', sinon_1.default.fake.returns(Promise.resolve({})));
            const banners = yield service.getBannersForUser('a-fake-id', 'web');
            (0, chai_1.expect)(findActiveByRoleOrIdMock.callCount).to.be.equal(1);
            (0, chai_1.expect)(findByUserIdAndBannerIdMock.callCount).to.be.equal(1);
            (0, chai_1.expect)(banners).to.be.an('array');
            (0, chai_1.expect)(banners).to.have.lengthOf(0);
        }));
        (0, mocha_1.it)('should use the _id as viewId if not set', () => __awaiter(void 0, void 0, void 0, function* () {
            const service = new BannerService();
            const findActiveByRoleOrIdMock = sinon_1.default.replace(bannersModel, 'findActiveByRoleOrId', sinon_1.default.fake.returns(findCursorFactory([A_SECOND_FAKE_BANNER])));
            const findByUserIdAndBannerIdMock = sinon_1.default.replace(bannerDismissModel, 'findByUserIdAndBannerId', sinon_1.default.fake.returns(findCursorFactory([])));
            sinon_1.default.replace(userModel, 'findOneById', sinon_1.default.fake.returns(Promise.resolve({})));
            const banners = yield service.getBannersForUser('a-fake-id', 'web');
            (0, chai_1.expect)(findActiveByRoleOrIdMock.callCount).to.be.equal(1);
            (0, chai_1.expect)(findByUserIdAndBannerIdMock.callCount).to.be.equal(1);
            (0, chai_1.expect)(banners).to.be.an('array');
            (0, chai_1.expect)(banners).to.have.lengthOf(1);
            (0, chai_1.expect)(banners[0].view.viewId).to.be.equal(A_SECOND_FAKE_BANNER._id);
            (0, chai_1.expect)(banners[0].surface).to.be.equal('modal');
        }));
    });
});
