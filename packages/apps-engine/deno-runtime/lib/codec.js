"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decoder = exports.encoder = void 0;
const node_buffer_1 = require("node:buffer");
const msgpack_1 = require("@msgpack/msgpack");
const require_ts_1 = require("./require.ts");
const { App } = (0, require_ts_1.require)('@rocket.chat/apps-engine/definition/App.js');
const extensionCodec = new msgpack_1.ExtensionCodec();
extensionCodec.register({
    type: 0,
    encode: (object) => {
        // We don't care about functions, but also don't want to throw an error
        if (typeof object === 'function' || object instanceof App) {
            return new Uint8Array(0);
        }
        return null;
    },
    decode: (_data) => undefined,
});
// Since Deno doesn't have Buffer by default, we need to use Uint8Array
extensionCodec.register({
    type: 1,
    encode: (object) => {
        if (object instanceof node_buffer_1.Buffer) {
            return new Uint8Array(object.buffer, object.byteOffset, object.byteLength);
        }
        return null;
    },
    // msgpack will reuse the Uint8Array instance, so WE NEED to copy it instead of simply creating a view
    decode: (data) => {
        return node_buffer_1.Buffer.from(data);
    },
});
exports.encoder = new msgpack_1.Encoder({ extensionCodec });
exports.decoder = new msgpack_1.Decoder({ extensionCodec });
