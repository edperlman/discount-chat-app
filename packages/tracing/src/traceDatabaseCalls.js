"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDatabaseTracing = void 0;
const api_1 = require("@opentelemetry/api");
const initDatabaseTracing = (tracer, client) => {
    const DurationStart = new Map();
    client.on('commandStarted', (event) => {
        const collection = event.command[event.commandName];
        const currentSpan = api_1.trace.getSpan(api_1.context.active());
        if (currentSpan) {
            const span = tracer.startSpan(`mongodb ${collection}.${event.commandName}`, {
                attributes: {
                    'db.connection_string': event.address,
                    'db.mongodb.collection': collection,
                    'db.name': event.databaseName,
                    'db.operation': event.commandName,
                    'db.statement': JSON.stringify(event.command, null, 2),
                    'db.system': 'mongodb',
                    // net.peer.name
                    // net.peer.port
                },
            });
            DurationStart.set(event.requestId, { event, span });
        }
    });
    client.on('commandSucceeded', (event) => {
        if (!DurationStart.has(event.requestId)) {
            return;
        }
        const { span } = DurationStart.get(event.requestId);
        DurationStart.delete(event.requestId);
        span.end();
    });
    client.on('commandFailed', (event) => {
        if (!DurationStart.has(event.requestId)) {
            return;
        }
        const { span } = DurationStart.get(event.requestId);
        DurationStart.delete(event.requestId);
        span.recordException(event.failure);
        span.setStatus({
            code: api_1.SpanStatusCode.ERROR,
            message: event.failure.message,
        });
        span.end();
    });
};
exports.initDatabaseTracing = initDatabaseTracing;
