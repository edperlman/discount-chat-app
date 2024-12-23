"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const filterAppsByCategories_1 = require("./filterAppsByCategories");
describe('filterAppsByCategories', () => {
    it('should return true if the app is in the categories', () => {
        const app = {
            categories: ['category1', 'category2'],
        };
        const categories = ['category1'];
        const result = (0, filterAppsByCategories_1.filterAppsByCategories)(app, categories);
        expect(result).toBe(true);
    });
    it('should return false if the app is not in the categories', () => {
        const app = {
            categories: ['category1', 'category2'],
        };
        const categories = ['category3'];
        const result = (0, filterAppsByCategories_1.filterAppsByCategories)(app, categories);
        expect(result).toBe(false);
    });
});
