"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const storeQueryFunction_1 = require("./storeQueryFunction");
const data_1 = require("../../../tests/mocks/data");
const marketplace_1 = require("../../../tests/mocks/data/marketplace");
describe(`when an app installed from the Marketplace, but has since been unpublished`, () => {
    it(`should still be present in the installed app data provided`, () => {
        var _a;
        const marketplaceMockQuery = {
            data: [(0, data_1.createFakeApp)({ id: 'marketplace-1' }), (0, marketplace_1.createFakeAppInstalledMarketplace)({ id: 'marketplace-2' })],
            isFetched: true,
        };
        const instanceMockQuery = {
            data: [
                (_a = marketplaceMockQuery.data) === null || _a === void 0 ? void 0 : _a[1],
                (0, marketplace_1.createFakeAppInstalledMarketplace)({ id: 'marketplace-3' }), // This app has been installed via Marketplace but has been unpublished since
                (0, marketplace_1.createFakeAppPrivate)({ id: 'private-1' }),
            ],
            isFetched: true,
        };
        const [marketplaceList, installedList, privateList] = (0, storeQueryFunction_1.storeQueryFunction)(marketplaceMockQuery, instanceMockQuery);
        expect(marketplaceList.find((app) => app.id === 'marketplace-1')).toBeTruthy();
        expect(marketplaceList.find((app) => app.id === 'marketplace-2')).toBeTruthy();
        expect(marketplaceList.find((app) => app.id === 'marketplace-3')).toBeUndefined();
        expect(marketplaceList).toHaveLength(2);
        expect(installedList.find((app) => app.id === 'marketplace-1')).toBeUndefined();
        expect(installedList.find((app) => app.id === 'marketplace-2')).toBeTruthy();
        expect(installedList.find((app) => app.id === 'marketplace-3')).toBeTruthy();
        expect(installedList).toHaveLength(2);
        expect(privateList.find((app) => app.id === 'private-1')).toBeTruthy();
        expect(privateList).toHaveLength(1);
    });
});
