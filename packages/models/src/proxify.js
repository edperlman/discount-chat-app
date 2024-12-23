"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerModel = registerModel;
exports.proxify = proxify;
const lazyModels = new Map();
const models = new Map();
function handler(namespace) {
    return {
        get: (_target, nameProp) => {
            if (!models.has(namespace) && lazyModels.has(namespace)) {
                const getModel = lazyModels.get(namespace);
                if (getModel) {
                    models.set(namespace, getModel());
                }
            }
            const model = models.get(namespace);
            if (!model) {
                throw new Error(`Model ${namespace} not found`);
            }
            const prop = model[nameProp];
            if (typeof prop === 'function') {
                return prop.bind(model);
            }
            return prop;
        },
        set() {
            if (process.env.NODE_ENV !== 'production') {
                throw new Error('Models accessed via proxify are read-only, use the model instance directly to modify it.');
            }
            /* istanbul ignore next */
            return true;
        },
    };
}
function registerModel(name, instance, overwriteExisting = true) {
    if (!overwriteExisting && (lazyModels.has(name) || models.has(name))) {
        return;
    }
    if (typeof instance === 'function') {
        lazyModels.set(name, instance);
    }
    else {
        models.set(name, instance);
    }
}
function proxify(namespace) {
    return new Proxy({}, handler(namespace));
}
