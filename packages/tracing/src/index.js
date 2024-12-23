"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startTracing = void 0;
exports.isTracingEnabled = isTracingEnabled;
exports.tracerSpan = tracerSpan;
exports.tracerActiveSpan = tracerActiveSpan;
exports.injectCurrentContext = injectCurrentContext;
const api_1 = require("@opentelemetry/api");
const exporter_trace_otlp_grpc_1 = require("@opentelemetry/exporter-trace-otlp-grpc");
const sdk_node_1 = require("@opentelemetry/sdk-node");
const sdk_trace_base_1 = require("@opentelemetry/sdk-trace-base");
const traceDatabaseCalls_1 = require("./traceDatabaseCalls");
let tracer;
function isTracingEnabled() {
    return ['yes', 'true'].includes(String(process.env.TRACING_ENABLED).toLowerCase());
}
const startTracing = ({ service, db }) => {
    if (!isTracingEnabled()) {
        return;
    }
    const exporter = new exporter_trace_otlp_grpc_1.OTLPTraceExporter();
    const sdk = new sdk_node_1.NodeSDK({
        traceExporter: exporter,
        instrumentations: [],
        serviceName: service,
        spanProcessors: [new sdk_trace_base_1.BatchSpanProcessor(exporter)],
    });
    sdk.start();
    tracer = api_1.trace.getTracer(service);
    (0, traceDatabaseCalls_1.initDatabaseTracing)(tracer, db);
};
exports.startTracing = startTracing;
function tracerSpan(name, options, fn, optl) {
    if (!isTracingEnabled()) {
        return fn();
    }
    if (!tracer) {
        throw new Error(`Tracing is enabled but not started. You should call 'startTracing()' to fix this.`);
    }
    const computeResult = (span) => {
        try {
            const result = fn(span);
            if (result instanceof Promise) {
                result
                    .catch((err) => {
                    span.recordException(err);
                    span.setStatus({
                        code: api_1.SpanStatusCode.ERROR,
                        message: err.message,
                    });
                })
                    .finally(() => span.end());
                return result;
            }
            span.end();
            return result;
        }
        catch (err) {
            span.recordException(err);
            span.setStatus({
                code: api_1.SpanStatusCode.ERROR,
                message: err.message,
            });
            span.end();
            throw err;
        }
    };
    if (optl) {
        const activeContext = api_1.propagation.extract(api_1.context.active(), optl);
        return tracer.startActiveSpan(name, options, activeContext, computeResult);
    }
    return tracer.startActiveSpan(name, options, computeResult);
}
function tracerActiveSpan(name, options, fn, optl) {
    const currentSpan = api_1.trace.getSpan(api_1.context.active());
    if (process.env.LOG_UNTRACED_METHODS) {
        console.log(`No active span for ${name}`, new Error().stack);
    }
    return currentSpan ? tracerSpan(name, options, fn, optl) : fn();
}
function injectCurrentContext() {
    const output = {};
    api_1.propagation.inject(api_1.context.active(), output);
    return output;
}
