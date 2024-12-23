"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useQueuePositionChangeSubscription = exports.useAgentStatusChangeSubscription = exports.useAgentChangeSubscription = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const hooks_1 = require("preact/hooks");
const room_1 = require("../lib/room");
const useAgentChangeSubscription = (rid) => {
    const stream = (0, ui_contexts_1.useStream)('livechat-room');
    (0, hooks_1.useEffect)(() => {
        if (!rid) {
            return;
        }
        return stream(`${rid}`, (data) => {
            if (data.type === 'agentData') {
                (0, room_1.onAgentChange)(data.data);
            }
        });
    }, [rid, stream]);
};
exports.useAgentChangeSubscription = useAgentChangeSubscription;
const useAgentStatusChangeSubscription = (rid) => {
    const stream = (0, ui_contexts_1.useStream)('livechat-room');
    (0, hooks_1.useEffect)(() => {
        if (!rid) {
            return;
        }
        return stream(`${rid}`, (data) => {
            if (data.type === 'agentStatus') {
                (0, room_1.onAgentStatusChange)(data.status);
            }
        });
    }, [rid, stream]);
};
exports.useAgentStatusChangeSubscription = useAgentStatusChangeSubscription;
const useQueuePositionChangeSubscription = (rid) => {
    const stream = (0, ui_contexts_1.useStream)('livechat-room');
    (0, hooks_1.useEffect)(() => {
        if (!rid) {
            return;
        }
        return stream(`${rid}`, (data) => {
            if (data.type === 'queueData') {
                (0, room_1.onQueuePositionChange)(data.data);
            }
        });
    }, [rid, stream]);
};
exports.useQueuePositionChangeSubscription = useQueuePositionChangeSubscription;
