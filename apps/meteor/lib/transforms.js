"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAsyncTransformChain = void 0;
const createAsyncTransformChain = (...transforms) => {
    let chain = transforms;
    const call = (x) => chain.reduce((x, transform) => x.then(transform), Promise.resolve(x));
    const use = (transform) => {
        chain.push(transform);
        return () => {
            chain = chain.filter((t) => t !== transform);
        };
    };
    return Object.assign(call, { use });
};
exports.createAsyncTransformChain = createAsyncTransformChain;
