"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertChangeStreamPayload = convertChangeStreamPayload;
function convertChangeStreamPayload(event) {
    switch (event.operationType) {
        case 'insert':
            return {
                action: 'insert',
                clientAction: 'inserted',
                id: event.documentKey._id,
                data: event.fullDocument,
            };
        case 'update':
            const diff = Object.assign(Object.assign({}, event.updateDescription.updatedFields), (event.updateDescription.removedFields || []).reduce((unset, removedField) => {
                return Object.assign(Object.assign({}, unset), { [removedField]: undefined });
            }, {}));
            const unset = (event.updateDescription.removedFields || []).reduce((unset, removedField) => {
                return Object.assign(Object.assign({}, unset), { [removedField]: 1 });
            }, {});
            return {
                action: 'update',
                clientAction: 'updated',
                id: event.documentKey._id,
                data: event.fullDocument,
                diff,
                unset,
            };
        case 'delete':
            return {
                action: 'remove',
                clientAction: 'removed',
                id: event.documentKey._id,
            };
    }
}
