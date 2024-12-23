"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_server_1 = require("./main.server");
it('which should generate the same sequence in all environments', () => {
    const random = main_server_1.Random.createWithSeeds(0);
    expect(random.id()).toBe('cp9hWvhg8GSvuZ9os');
    expect(random.id()).toBe('3f3k6Xo7rrHCifQhR');
    expect(random.id()).toBe('shxDnjWWmnKPEoLhM');
    expect(random.id()).toBe('6QTjB8C5SEqhmz4ni');
});
describe('format', () => {
    it('should output id in the right format', () => {
        expect(main_server_1.Random.id(17)).toHaveLength(17);
        expect(main_server_1.Random.id(29)).toHaveLength(29);
    });
    it('should output hexString in the right format', () => {
        const hexString = main_server_1.Random.hexString(9);
        expect(hexString).toHaveLength(9);
        expect(Number.parseInt(hexString, 16)).not.toBeNaN();
    });
    it('should output fraction in the right range', () => {
        const frac = main_server_1.Random.fraction();
        expect(frac).toBeLessThan(1.0);
        expect(frac).toBeGreaterThanOrEqual(0.0);
    });
    it('should output secret in the right format', () => {
        expect(main_server_1.Random.secret().length).toBe(43);
        expect(main_server_1.Random.secret(13).length).toBe(13);
    });
});
describe('Alea', () => {
    it('should be undefined', () => {
        expect(main_server_1.Random).not.toHaveProperty('alea');
    });
});
describe('createWithSeeds', () => {
    it('should throw if no seeds are provided', () => {
        expect(() => main_server_1.Random.createWithSeeds()).toThrow();
    });
});
