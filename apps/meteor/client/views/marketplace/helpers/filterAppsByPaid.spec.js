"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const filterAppsByPaid_1 = require("./filterAppsByPaid");
describe('filterAppsByPaid', () => {
    it('should return true if both app purchase type is subscription and app price exists and is not 0', () => {
        const purchaseType = 'subscription';
        const app = {
            purchaseType,
            price: 5,
        };
        const result = (0, filterAppsByPaid_1.filterAppsByPaid)(app);
        expect(result).toBe(true);
    });
    it('should return true if app purchase type is subscription', () => {
        const purchaseType = 'subscription';
        const app = {
            purchaseType,
            price: 0,
        };
        const result = (0, filterAppsByPaid_1.filterAppsByPaid)(app);
        expect(result).toBe(true);
    });
    it('should return true if app price exists and is not 0', () => {
        const purchaseType = 'buy';
        const app = {
            purchaseType,
            price: 5,
        };
        const result = (0, filterAppsByPaid_1.filterAppsByPaid)(app);
        expect(result).toBe(true);
    });
    it('should return false if both app price does not exist or is 0 and app purchase type is not subscription', () => {
        const purchaseType = 'buy';
        const app = {
            purchaseType,
            price: 0,
        };
        const result = (0, filterAppsByPaid_1.filterAppsByPaid)(app);
        expect(result).toBe(false);
    });
});
