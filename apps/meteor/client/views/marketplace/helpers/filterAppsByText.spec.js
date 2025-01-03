"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const filterAppsByText_1 = require("./filterAppsByText");
describe('filterAppsByText', () => {
    it('should return true if the text is the name of an app', () => {
        const app = {
            name: 'name1',
        };
        const text = 'name1';
        const result = (0, filterAppsByText_1.filterAppsByText)(app.name, text);
        expect(result).toBe(true);
    });
    it('should return false if the text is not the name of an app', () => {
        const app = {
            name: 'name1',
        };
        const text = 'name2';
        const result = (0, filterAppsByText_1.filterAppsByText)(app.name, text);
        expect(result).toBe(false);
    });
});