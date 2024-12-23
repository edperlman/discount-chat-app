"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldRetryTransaction = exports.client = exports.db = void 0;
const mongo_1 = require("meteor/mongo");
_a = mongo_1.MongoInternals.defaultRemoteCollectionDriver().mongo, exports.db = _a.db, exports.client = _a.client;
/**
 * In MongoDB, errors like UnknownTransactionCommitResult and TransientTransactionError occur primarily in the context of distributed transactions
 * and are often due to temporary network issues, server failures, or timeouts. Here’s what each error means and some common causes:
 *
 * 1. UnknownTransactionCommitResult: The client does not know if the transaction was committed successfully or not.
 *   This error can occur when there’s a network disruption between the client and the MongoDB server during the transaction commit,
 *   or when the primary node (which handles transaction commits) is unavailable, possibly due to a primary election or failover in a replica set.
 *
 * 2. TransientTransactionError: A temporary issue disrupts a transaction before it completes.
 *
 * Since these errors are transient, they may resolve on their own when retried after a short interval.
 */
const shouldRetryTransaction = (e) => {
    var _a, _b;
    return ((_a = e === null || e === void 0 ? void 0 : e.errorLabels) === null || _a === void 0 ? void 0 : _a.includes('UnknownTransactionCommitResult')) ||
        ((_b = e === null || e === void 0 ? void 0 : e.errorLabels) === null || _b === void 0 ? void 0 : _b.includes('TransientTransactionError'));
};
exports.shouldRetryTransaction = shouldRetryTransaction;
