"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeRandomGenerator = void 0;
const crypto_1 = __importDefault(require("crypto"));
const AleaRandomGenerator_1 = require("./AleaRandomGenerator");
const RandomGenerator_1 = require("./RandomGenerator");
const createAleaGenerator_1 = require("./createAleaGenerator");
class NodeRandomGenerator extends RandomGenerator_1.RandomGenerator {
    constructor() {
        super(...arguments);
        this.insecure = (0, createAleaGenerator_1.createAleaGeneratorWithGeneratedSeed)();
    }
    /**
     * @name Random.fraction
     * @summary Return a number between 0 and 1, like `Math.random`.
     * @locus Anywhere
     */
    fraction() {
        const numerator = Number.parseInt(this.hexString(8), 16);
        return numerator * 2.3283064365386963e-10; // 2^-3;
    }
    /**
     * @name Random.hexString
     * @summary Return a random string of `n` hexadecimal digits.
     * @locus Anywhere
     * @param digits Length of the string
     */
    hexString(digits) {
        const numBytes = Math.ceil(digits / 2);
        let bytes;
        // Try to get cryptographically strong randomness. Fall back to
        // non-cryptographically strong if not available.
        try {
            bytes = crypto_1.default.randomBytes(numBytes);
        }
        catch (e) {
            // XXX should re-throw any error except insufficient entropy
            bytes = crypto_1.default.pseudoRandomBytes(numBytes);
        }
        const result = bytes.toString('hex');
        // If the number of digits is odd, we'll have generated an extra 4 bits
        // of randomness, so we need to trim the last digit.
        return result.substring(0, digits);
    }
    /**
     * @name Random.between Returns a random integer between min and max, inclusive.
     * @param min Minimum value (inclusive)
     * @param max Maximum value (inclusive)
     * @returns A random integer between min and max, inclusive.
     */
    between(min, max) {
        return Math.floor(this.fraction() * (max - min + 1)) + min;
    }
    safelyCreateWithSeeds(...seeds) {
        return new AleaRandomGenerator_1.AleaRandomGenerator({ seeds });
    }
}
exports.NodeRandomGenerator = NodeRandomGenerator;
