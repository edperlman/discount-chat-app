"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const proxify_1 = require("./proxify");
describe('non lazy proxify', () => {
    it('should keep this inside functions', () => {
        const collectionMocked = (0, proxify_1.proxify)('collection');
        const collection = {
            method() {
                return this;
            },
        };
        (0, proxify_1.registerModel)('collection', collection);
        expect(collectionMocked.method()).toBe(collection);
    });
    it('should throw an error if the model is not found', () => {
        const collectionMocked = (0, proxify_1.proxify)('collection-not-found');
        expect(() => collectionMocked.method()).toThrowError('Model collection-not-found not found');
    });
    it('should return a proxified property', () => {
        const collectionMocked = (0, proxify_1.proxify)('collection-prop');
        const collection = {
            prop: 'value',
        };
        (0, proxify_1.registerModel)('collection-prop', collection);
        expect(collectionMocked.prop).toBe('value');
    });
    it('should throw an error if trying to set a property from the proxified object', () => {
        const collectionMocked = (0, proxify_1.proxify)('collection-prop');
        const collection = {
            prop: 'value',
        };
        (0, proxify_1.registerModel)('collection-prop', collection);
        expect(() => {
            collectionMocked.prop = 'new value';
        }).toThrowError('Models accessed via proxify are read-only, use the model instance directly to modify it.');
    });
});
describe('lazy proxify', () => {
    it('should keep this inside functions', () => {
        const collectionMocked = (0, proxify_1.proxify)('collection-lazy');
        const collection = {
            method() {
                return this;
            },
        };
        (0, proxify_1.registerModel)('collection-lazy', () => collection);
        expect(collectionMocked.method()).toBe(collection);
    });
    it('should throw an error if the model is not found', () => {
        const collectionMocked = (0, proxify_1.proxify)('collection-not-found');
        expect(() => collectionMocked.method()).toThrowError('Model collection-not-found not found');
    });
    it('should return a proxified property', () => {
        const collectionMocked = (0, proxify_1.proxify)('collection-prop');
        const collection = {
            prop: 'value',
        };
        (0, proxify_1.registerModel)('collection-prop', () => collection);
        expect(collectionMocked.prop).toBe('value');
    });
    it('should throw an error if trying to set a property from the proxified object', () => {
        const collectionMocked = (0, proxify_1.proxify)('collection-prop');
        const collection = {
            prop: 'value',
        };
        (0, proxify_1.registerModel)('collection-prop', () => collection);
        expect(() => {
            collectionMocked.prop = 'new value';
        }).toThrowError('Models accessed via proxify are read-only, use the model instance directly to modify it.');
    });
});
