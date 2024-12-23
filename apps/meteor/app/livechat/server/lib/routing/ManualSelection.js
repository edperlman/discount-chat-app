"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RoutingManager_1 = require("../RoutingManager");
/* Manual Selection Queuing Method:
 *
 * An incoming livechat is created as an Inquiry
 * which is picked up from an agent.
 * An Inquiry is visible to all agents
 *
 * A room is still created with the initial message, but it is occupied by
 * only the client until paired with an agent
 */
class ManualSelection {
    constructor() {
        this.config = {
            previewRoom: true,
            showConnecting: true,
            showQueue: true,
            showQueueLink: false,
            returnQueue: true,
            enableTriggerAction: false,
            autoAssignAgent: false,
        };
    }
    getNextAgent(_department, _excludeAgent) {
        return Promise.resolve(undefined);
    }
}
RoutingManager_1.RoutingManager.registerMethod('Manual_Selection', ManualSelection);
