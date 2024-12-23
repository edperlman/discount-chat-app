"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageExtender = void 0;
const require_ts_1 = require("../../../lib/require.ts");
const { RocketChatAssociationModel } = (0, require_ts_1.require)('@rocket.chat/apps-engine/definition/metadata/RocketChatAssociations.js');
class MessageExtender {
    constructor(msg) {
        this.msg = msg;
        this.kind = RocketChatAssociationModel.MESSAGE;
        if (!Array.isArray(msg.attachments)) {
            this.msg.attachments = [];
        }
    }
    addCustomField(key, value) {
        if (!this.msg.customFields) {
            this.msg.customFields = {};
        }
        if (this.msg.customFields[key]) {
            throw new Error(`The message already contains a custom field by the key: ${key}`);
        }
        if (key.includes('.')) {
            throw new Error(`The given key contains a period, which is not allowed. Key: ${key}`);
        }
        this.msg.customFields[key] = value;
        return this;
    }
    addAttachment(attachment) {
        this.ensureAttachment();
        this.msg.attachments.push(attachment);
        return this;
    }
    addAttachments(attachments) {
        this.ensureAttachment();
        this.msg.attachments = this.msg.attachments.concat(attachments);
        return this;
    }
    getMessage() {
        return structuredClone(this.msg);
    }
    ensureAttachment() {
        if (!Array.isArray(this.msg.attachments)) {
            this.msg.attachments = [];
        }
    }
}
exports.MessageExtender = MessageExtender;
