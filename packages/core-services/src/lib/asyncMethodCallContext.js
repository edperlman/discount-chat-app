"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.traceInstanceMethods = traceInstanceMethods;
const tracing_1 = require("@rocket.chat/tracing");
const getArguments = (args) => {
    return args.map((arg) => {
        if (typeof arg === 'object' && arg != null && 'session' in arg) {
            return '[mongo options with session]';
        }
        return arg;
    });
};
function traceInstanceMethods(instance, ignoreMethods = []) {
    const className = instance.constructor.name;
    return new Proxy(instance, {
        get(target, prop) {
            if (typeof target[prop] === 'function' && !ignoreMethods.includes(prop)) {
                return new Proxy(target[prop], {
                    apply: (target, thisArg, argumentsList) => {
                        if (['doNotMixInclusionAndExclusionFields', 'ensureDefaultFields'].includes(prop)) {
                            return Reflect.apply(target, thisArg, argumentsList);
                        }
                        return (0, tracing_1.tracerActiveSpan)(`model ${className}.${prop}`, {
                            attributes: {
                                model: className,
                                method: prop,
                                parameters: getArguments(argumentsList),
                            },
                        }, () => {
                            return Reflect.apply(target, thisArg, argumentsList);
                        });
                    },
                });
            }
            return Reflect.get(target, prop);
        },
    });
}
