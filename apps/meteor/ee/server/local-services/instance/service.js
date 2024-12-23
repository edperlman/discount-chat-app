"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstanceService = void 0;
const os_1 = __importDefault(require("os"));
const core_services_1 = require("@rocket.chat/core-services");
const instance_status_1 = require("@rocket.chat/instance-status");
const models_1 = require("@rocket.chat/models");
const ejson_1 = __importDefault(require("ejson"));
const moleculer_1 = require("moleculer");
const getLogger_1 = require("./getLogger");
const getTransporter_1 = require("./getTransporter");
const streamer_module_1 = require("../../../../server/modules/streamer/streamer.module");
const hostIP = process.env.INSTANCE_IP ? String(process.env.INSTANCE_IP).trim() : 'localhost';
const { Base } = moleculer_1.Serializers;
class EJSONSerializer extends Base {
    serialize(obj) {
        return Buffer.from(ejson_1.default.stringify(obj));
    }
    deserialize(buf) {
        return ejson_1.default.parse(buf.toString());
    }
}
class InstanceService extends core_services_1.ServiceClassInternal {
    constructor() {
        super();
        this.name = 'instance';
        this.broadcastStarted = false;
        this.isTransporterTCP = true;
        this.troubleshootDisableInstanceBroadcast = false;
        const tx = (0, getTransporter_1.getTransporter)({ transporter: process.env.TRANSPORTER, port: process.env.TCP_PORT, extra: process.env.TRANSPORTER_EXTRA });
        if (typeof tx === 'string') {
            this.transporter = new moleculer_1.Transporters.NATS({ url: tx });
            this.isTransporterTCP = false;
        }
        else {
            this.transporter = new moleculer_1.Transporters.TCP(tx);
        }
        if (this.isTransporterTCP) {
            this.onEvent('watch.instanceStatus', (_a) => __awaiter(this, [_a], void 0, function* ({ clientAction, data }) {
                var _b, _c, _d;
                if (clientAction === 'removed') {
                    ((_b = this.broker.transit) === null || _b === void 0 ? void 0 : _b.tx).nodes.disconnected(data === null || data === void 0 ? void 0 : data._id, false);
                    ((_c = this.broker.transit) === null || _c === void 0 ? void 0 : _c.tx).nodes.nodes.delete(data === null || data === void 0 ? void 0 : data._id);
                    return;
                }
                if (clientAction === 'inserted' && ((_d = data === null || data === void 0 ? void 0 : data.extraInformation) === null || _d === void 0 ? void 0 : _d.tcpPort)) {
                    this.connectNode(data);
                }
            }));
        }
        this.onEvent('license.module', (_a) => __awaiter(this, [_a], void 0, function* ({ module, valid }) {
            if (module === 'scalability' && valid) {
                yield this.startBroadcast();
            }
        }));
        this.onEvent('watch.settings', (_a) => __awaiter(this, [_a], void 0, function* ({ clientAction, setting }) {
            if (clientAction === 'removed') {
                return;
            }
            const { _id, value } = setting;
            if (_id !== 'Troubleshoot_Disable_Instance_Broadcast') {
                return;
            }
            if (typeof value !== 'boolean') {
                return;
            }
            if (this.troubleshootDisableInstanceBroadcast === value) {
                return;
            }
            this.troubleshootDisableInstanceBroadcast = value;
        }));
    }
    created() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            this.broker = new moleculer_1.ServiceBroker(Object.assign({ nodeID: instance_status_1.InstanceStatus.id(), transporter: this.transporter, serializer: new EJSONSerializer() }, (0, getLogger_1.getLogger)(process.env)));
            if ((_c = (_b = (_a = this.broker.transit) === null || _a === void 0 ? void 0 : _a.tx) === null || _b === void 0 ? void 0 : _b.nodes) === null || _c === void 0 ? void 0 : _c.localNode) {
                ((_d = this.broker.transit) === null || _d === void 0 ? void 0 : _d.tx).nodes.localNode.ipList = [hostIP];
            }
            this.broker.createService({
                name: 'matrix',
                events: {
                    broadcast(ctx) {
                        const { eventName, streamName, args } = ctx.params;
                        const { nodeID } = ctx;
                        const fromLocalNode = nodeID === instance_status_1.InstanceStatus.id();
                        if (fromLocalNode) {
                            return;
                        }
                        const instance = streamer_module_1.StreamerCentral.instances[streamName];
                        if (!instance) {
                            // return 'stream-not-exists';
                            return;
                        }
                        if (instance.serverOnly) {
                            instance.__emit(eventName, ...args);
                        }
                        else {
                            // @ts-expect-error not sure why it thinks _emit needs an extra argument
                            streamer_module_1.StreamerCentral.instances[streamName]._emit(eventName, args);
                        }
                    },
                },
            });
        });
    }
    started() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            yield this.broker.start();
            const instance = {
                host: hostIP,
                port: String(process.env.PORT).trim(),
                tcpPort: (_d = (_c = (_b = (_a = this.broker.transit) === null || _a === void 0 ? void 0 : _a.tx) === null || _b === void 0 ? void 0 : _b.nodes) === null || _c === void 0 ? void 0 : _c.localNode) === null || _d === void 0 ? void 0 : _d.port,
                os: {
                    type: os_1.default.type(),
                    platform: os_1.default.platform(),
                    arch: os_1.default.arch(),
                    release: os_1.default.release(),
                    uptime: os_1.default.uptime(),
                    loadavg: os_1.default.loadavg(),
                    totalmem: os_1.default.totalmem(),
                    freemem: os_1.default.freemem(),
                    cpus: os_1.default.cpus().length,
                },
                nodeVersion: process.version,
            };
            yield instance_status_1.InstanceStatus.registerInstance('rocket.chat', instance);
            try {
                const hasLicense = yield core_services_1.License.hasModule('scalability');
                if (!hasLicense) {
                    return;
                }
                yield this.startBroadcast();
            }
            catch (error) {
                console.error('Instance service did not start correctly', error);
            }
        });
    }
    startBroadcast() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.broadcastStarted) {
                return;
            }
            this.broadcastStarted = true;
            streamer_module_1.StreamerCentral.on('broadcast', this.sendBroadcast.bind(this));
            if (this.isTransporterTCP) {
                yield models_1.InstanceStatus.find({
                    'extraInformation.tcpPort': {
                        $exists: true,
                    },
                }, {
                    sort: {
                        _createdAt: -1,
                    },
                }).forEach(this.connectNode.bind(this));
            }
        });
    }
    connectNode(record) {
        var _a, _b;
        if (record._id === instance_status_1.InstanceStatus.id()) {
            return;
        }
        const { host, tcpPort } = record.extraInformation;
        ((_b = (_a = this.broker) === null || _a === void 0 ? void 0 : _a.transit) === null || _b === void 0 ? void 0 : _b.tx).addOfflineNode(record._id, host, tcpPort);
    }
    sendBroadcast(streamName, eventName, args) {
        if (this.troubleshootDisableInstanceBroadcast) {
            return;
        }
        void this.broker.broadcast('broadcast', { streamName, eventName, args });
    }
    getInstances() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.broker.call('$node.list', { onlyAvailable: true });
        });
    }
}
exports.InstanceService = InstanceService;
