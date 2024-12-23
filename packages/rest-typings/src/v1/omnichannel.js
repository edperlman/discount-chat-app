"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLivechatAnalyticsDepartmentsTotalServiceTimeProps = exports.isLivechatAnalyticsDepartmentsAverageChatDurationTimeProps = exports.isLivechatAnalyticsDepartmentsAverageServiceTimeProps = exports.isLivechatAnalyticsDepartmentsAmountOfChatsProps = exports.isLivechatAnalyticsAgentsAvailableForServiceHistoryProps = exports.isLivechatAnalyticsAgentsTotalServiceTimeProps = exports.isPOSTLivechatAgentStatusProps = exports.isGETOmnichannelContactSearchProps = exports.isLivechatAnalyticsAgentsAverageServiceTimeProps = exports.isGETOmnichannelContactProps = exports.isGETOmnichannelContactsChannelsProps = exports.isGETOmnichannelContactHistoryProps = exports.isGETOmnichannelContactsSearchProps = exports.isGETOmnichannelContactsProps = exports.ContactVisitorAssociationSchema = exports.isPOSTUpdateOmnichannelContactsProps = exports.isPOSTOmnichannelContactsProps = exports.isPOSTOmnichannelContactProps = exports.isCreateOrUpdateLivechatSlaProps = exports.isLivechatPrioritiesProps = exports.isLivechatUsersAgentProps = exports.isLivechatRidMessagesProps = exports.isLivechatRoomsProps = exports.isLivechatCustomFieldsProps = exports.isCannedResponsesProps = exports.isLivechatQueueProps = exports.isLivechatUsersManagerPOSTProps = exports.isLivechatUsersManagerGETProps = exports.isLivechatDepartmentsByUnitIdProps = exports.isLivechatDepartmentsByUnitProps = exports.isLivechatDepartmentsAvailableByUnitIdProps = exports.isPOSTLivechatDepartmentProps = exports.isGETLivechatDepartmentProps = exports.isLivechatTagsListProps = exports.isLivechatMonitorsListProps = exports.isLiveChatRoomSaveInfoProps = exports.isLiveChatRoomForwardProps = exports.isLiveChatRoomJoinProps = exports.isLivechatVisitorStatusProps = exports.isLivechatVisitorCallStatusProps = exports.isLivechatVisitorTokenRoomProps = exports.isLivechatVisitorTokenDeleteProps = exports.isLivechatVisitorTokenGetProps = exports.isLivechatDepartmentDepartmentIdAgentsPOSTProps = exports.isLivechatDepartmentDepartmentIdAgentsGETProps = exports.isLivechatDepartmentAutocompleteProps = exports.isLivechatDepartmentIdProps = exports.isLivechatRoomResumeOnHoldProps = exports.isLivechatRoomOnHoldProps = exports.isLivechatVisitorsInfoProps = void 0;
exports.isPOSTLivechatTranscriptRequestParams = exports.isPOSTomnichannelIntegrations = exports.isPUTLivechatPriority = exports.isGETDashboardsAgentStatusParams = exports.isGETDashboardTotalizerParams = exports.isGETLivechatInquiriesGetOneParams = exports.isGETLivechatInquiriesQueuedForUserParams = exports.isPOSTLivechatInquiriesTakeParams = exports.isGETLivechatInquiriesListParams = exports.isPOSTLivechatPriorityParams = exports.isDELETELivechatPriorityParams = exports.isGETLivechatPrioritiesParams = exports.isGETLivechatQueueParams = exports.isPOSTLivechatRoomPriorityParams = exports.isGETLivechatRoomsParams = exports.isGETLivechatTriggersParams = exports.isGETBusinessHourParams = exports.isGETLivechatAgentsAgentIdDepartmentsParams = exports.isGETLivechatVisitorsSearch = exports.isGETLivechatVisitorsAutocompleteParams = exports.isGETLivechatVisitorsSearchChatsRoomRoomIdVisitorVisitorIdParams = exports.isGETLivechatVisitorsChatHistoryRoomRoomIdVisitorVisitorIdParams = exports.isGETLivechatVisitorsPagesVisitedRoomIdParams = exports.isPOSTLivechatUsersTypeProps = exports.isDELETECannedResponsesProps = exports.isPOSTCannedResponsesProps = exports.isPOSTLivechatRoomSurveyParams = exports.isPOSTLivechatRoomTransferParams = exports.isPOSTLivechatRoomCloseByUserParams = exports.isPOSTLivechatRoomCloseParams = exports.isGETLivechatRoomParams = exports.isGETLivechatMessagesParams = exports.isGETLivechatMessagesHistoryRidParams = exports.isDELETELivechatMessageIdParams = exports.isPUTLivechatMessageIdParams = exports.isGETLivechatMessageIdParams = exports.isPOSTLivechatMessageParams = exports.isPOSTLivechatPageVisitedParams = exports.isPOSTLivechatOfflineMessageParams = exports.isPOSTLivechatTranscriptParams = exports.isPUTWebRTCCallId = exports.isGETWebRTCCall = exports.isPOSTLivechatCustomFieldsParams = exports.isPOSTLivechatCustomFieldParams = exports.isGETLivechatConfigParams = exports.isGETAgentNextToken = exports.isLivechatAnalyticsDepartmentsPercentageAbandonedChatsProps = exports.isLivechatAnalyticsDepartmentsTotalAbandonedChatsProps = exports.isLivechatAnalyticsDepartmentsTotalTransferredChatsProps = exports.isLivechatAnalyticsDepartmentsAverageWaitingTimeProps = void 0;
exports.isLivechatTriggerWebhookCallParams = exports.isLivechatTriggerWebhookTestParams = exports.isLivechatAnalyticsOverviewProps = exports.isLivechatAnalyticsAgentOverviewProps = exports.isGETDashboardConversationsByType = exports.isPOSTLivechatAppearanceParams = exports.isPOSTLivechatTriggersParams = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const Ajv_1 = require("./Ajv");
const LivechatVisitorsInfoSchema = {
    type: 'object',
    properties: {
        visitorId: {
            type: 'string',
        },
    },
    required: ['visitorId'],
    additionalProperties: false,
};
exports.isLivechatVisitorsInfoProps = Ajv_1.ajv.compile(LivechatVisitorsInfoSchema);
const LivechatRoomOnHoldSchema = {
    type: 'object',
    properties: {
        roomId: {
            type: 'string',
        },
    },
    required: ['roomId'],
    additionalProperties: false,
};
exports.isLivechatRoomOnHoldProps = Ajv_1.ajv.compile(LivechatRoomOnHoldSchema);
const LivechatRoomResumeOnHoldSchema = {
    type: 'object',
    properties: {
        roomId: {
            type: 'string',
        },
    },
    required: ['roomId'],
    additionalProperties: false,
};
exports.isLivechatRoomResumeOnHoldProps = Ajv_1.ajv.compile(LivechatRoomResumeOnHoldSchema);
const LivechatDepartmentIdSchema = {
    type: 'object',
    properties: {
        onlyMyDepartments: {
            type: 'string',
            nullable: true,
        },
        includeAgents: {
            type: 'string',
            nullable: true,
        },
    },
    additionalProperties: false,
};
exports.isLivechatDepartmentIdProps = Ajv_1.ajv.compile(LivechatDepartmentIdSchema);
const LivechatDepartmentAutocompleteSchema = {
    type: 'object',
    properties: {
        selector: {
            type: 'string',
        },
        onlyMyDepartments: {
            type: 'string',
        },
        showArchived: {
            type: 'string',
            nullable: true,
        },
    },
    required: ['selector', 'onlyMyDepartments'],
    additionalProperties: false,
};
exports.isLivechatDepartmentAutocompleteProps = Ajv_1.ajv.compile(LivechatDepartmentAutocompleteSchema);
const LivechatDepartmentDepartmentIdAgentsGETSchema = {
    type: 'object',
    properties: {
        sort: {
            type: 'string',
        },
    },
    required: ['sort'],
    additionalProperties: false,
};
exports.isLivechatDepartmentDepartmentIdAgentsGETProps = Ajv_1.ajv.compile(LivechatDepartmentDepartmentIdAgentsGETSchema);
const LivechatDepartmentDepartmentIdAgentsPOSTSchema = {
    type: 'object',
    properties: {
        upsert: {
            type: 'array',
            items: {
                type: 'string',
            },
        },
        remove: {
            type: 'array',
            items: {
                type: 'string',
            },
        },
    },
    required: ['upsert', 'remove'],
    additionalProperties: false,
};
exports.isLivechatDepartmentDepartmentIdAgentsPOSTProps = Ajv_1.ajv.compile(LivechatDepartmentDepartmentIdAgentsPOSTSchema);
const LivechatVisitorTokenGetSchema = {
    type: 'object',
    properties: {
        token: {
            type: 'string',
        },
    },
    required: ['token'],
    additionalProperties: false,
};
exports.isLivechatVisitorTokenGetProps = Ajv_1.ajv.compile(LivechatVisitorTokenGetSchema);
const LivechatVisitorTokenDeleteSchema = {
    type: 'object',
    properties: {
        token: {
            type: 'string',
        },
    },
    required: ['token'],
    additionalProperties: false,
};
exports.isLivechatVisitorTokenDeleteProps = Ajv_1.ajv.compile(LivechatVisitorTokenDeleteSchema);
const LivechatVisitorTokenRoomSchema = {
    type: 'object',
    properties: {
        token: {
            type: 'string',
        },
    },
    required: ['token'],
    additionalProperties: false,
};
exports.isLivechatVisitorTokenRoomProps = Ajv_1.ajv.compile(LivechatVisitorTokenRoomSchema);
const LivechatVisitorCallStatusSchema = {
    type: 'object',
    properties: {
        token: {
            type: 'string',
        },
        callStatus: {
            type: 'string',
        },
        rid: {
            type: 'string',
        },
        callId: {
            type: 'string',
        },
    },
    required: ['token', 'callStatus', 'rid', 'callId'],
    additionalProperties: false,
};
exports.isLivechatVisitorCallStatusProps = Ajv_1.ajv.compile(LivechatVisitorCallStatusSchema);
const LivechatVisitorStatusSchema = {
    type: 'object',
    properties: {
        token: {
            type: 'string',
        },
        status: {
            type: 'string',
        },
    },
    required: ['token', 'status'],
    additionalProperties: false,
};
exports.isLivechatVisitorStatusProps = Ajv_1.ajv.compile(LivechatVisitorStatusSchema);
const LiveChatRoomJoinSchema = {
    type: 'object',
    properties: {
        roomId: {
            type: 'string',
        },
    },
    required: ['roomId'],
    additionalProperties: false,
};
exports.isLiveChatRoomJoinProps = Ajv_1.ajv.compile(LiveChatRoomJoinSchema);
const LiveChatRoomForwardSchema = {
    type: 'object',
    properties: {
        roomId: {
            type: 'string',
        },
        userId: {
            type: 'string',
            nullable: true,
        },
        departmentId: {
            type: 'string',
            nullable: true,
        },
        comment: {
            type: 'string',
            nullable: true,
        },
        clientAction: {
            type: 'boolean',
            nullable: true,
        },
    },
    required: ['roomId'],
    additionalProperties: false,
};
exports.isLiveChatRoomForwardProps = Ajv_1.ajv.compile(LiveChatRoomForwardSchema);
const LiveChatRoomSaveInfoSchema = {
    type: 'object',
    properties: {
        guestData: {
            type: 'object',
            properties: {
                _id: {
                    type: 'string',
                },
                name: {
                    type: 'string',
                    nullable: true,
                },
                email: {
                    type: 'string',
                    nullable: true,
                },
                phone: {
                    type: 'string',
                    nullable: true,
                },
                livechatData: {
                    type: 'object',
                    patternProperties: {
                        '.*': {
                            type: 'string',
                        },
                    },
                    nullable: true,
                },
            },
            required: ['_id'],
            additionalProperties: false,
        },
        roomData: {
            type: 'object',
            properties: {
                _id: {
                    type: 'string',
                },
                topic: {
                    type: 'string',
                    nullable: true,
                },
                tags: {
                    type: 'array',
                    items: {
                        type: 'string',
                    },
                    nullable: true,
                },
                livechatData: {
                    type: 'object',
                    nullable: true,
                },
                priorityId: {
                    type: 'string',
                    nullable: true,
                },
                slaId: {
                    type: 'string',
                    nullable: true,
                },
            },
            required: ['_id'],
            additionalProperties: false,
        },
    },
    required: ['guestData', 'roomData'],
    additionalProperties: false,
};
exports.isLiveChatRoomSaveInfoProps = Ajv_1.ajv.compile(LiveChatRoomSaveInfoSchema);
const LivechatMonitorsListSchema = {
    type: 'object',
    properties: {
        text: {
            type: 'string',
        },
        count: {
            type: 'number',
            nullable: true,
        },
        offset: {
            type: 'number',
            nullable: true,
        },
        sort: {
            type: 'string',
            nullable: true,
        },
        query: {
            type: 'string',
            nullable: true,
        },
    },
    required: ['text'],
    additionalProperties: false,
};
exports.isLivechatMonitorsListProps = Ajv_1.ajv.compile(LivechatMonitorsListSchema);
const LivechatTagsListSchema = {
    type: 'object',
    properties: {
        text: {
            type: 'string',
        },
        department: {
            type: 'string',
            nullable: true,
        },
        viewAll: {
            type: 'string',
            nullable: true,
            enum: ['true', 'false'],
        },
        count: {
            type: 'number',
            nullable: true,
        },
        offset: {
            type: 'number',
            nullable: true,
        },
        sort: {
            type: 'string',
            nullable: true,
        },
        query: {
            type: 'string',
            nullable: true,
        },
    },
    required: ['text'],
    additionalProperties: false,
};
exports.isLivechatTagsListProps = Ajv_1.ajv.compile(LivechatTagsListSchema);
const LivechatDepartmentSchema = {
    type: 'object',
    properties: {
        text: {
            type: 'string',
            nullable: true,
        },
        onlyMyDepartments: {
            type: 'string',
            enum: ['true', 'false'],
            nullable: true,
        },
        enabled: {
            type: 'string',
            nullable: true,
        },
        excludeDepartmentId: {
            type: 'string',
            nullable: true,
        },
        showArchived: {
            type: 'string',
            nullable: true,
        },
        count: {
            type: 'number',
            nullable: true,
        },
        offset: {
            type: 'number',
            nullable: true,
        },
        sort: {
            type: 'string',
            nullable: true,
        },
        query: {
            type: 'string',
            nullable: true,
        },
    },
    additionalProperties: false,
};
exports.isGETLivechatDepartmentProps = Ajv_1.ajv.compile(LivechatDepartmentSchema);
const POSTLivechatDepartmentSchema = {
    type: 'object',
    properties: {
        department: {
            type: 'object',
            properties: {
                enabled: {
                    type: 'boolean',
                },
                name: {
                    type: 'string',
                },
                description: {
                    type: 'string',
                    nullable: true,
                },
                showOnRegistration: {
                    type: 'boolean',
                },
                showOnOfflineForm: {
                    type: 'boolean',
                },
                requestTagsBeforeClosingChat: {
                    type: 'boolean',
                    nullable: true,
                },
                chatClosingTags: {
                    type: 'array',
                    items: {
                        type: 'string',
                    },
                    nullable: true,
                },
                fallbackForwardDepartment: {
                    type: 'string',
                    nullable: true,
                },
                email: {
                    type: 'string',
                },
            },
            required: ['name', 'email', 'enabled', 'showOnRegistration', 'showOnOfflineForm'],
            additionalProperties: true,
        },
        agents: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    agentId: {
                        type: 'string',
                    },
                    count: {
                        type: 'number',
                        nullable: true,
                    },
                    order: {
                        type: 'number',
                        nullable: true,
                    },
                },
                required: ['agentId'],
                additionalProperties: false,
            },
            nullable: true,
        },
        departmentUnit: {
            type: 'object',
            properties: {
                _id: {
                    type: 'string',
                },
            },
            additionalProperties: false,
        },
    },
    required: ['department'],
    additionalProperties: false,
};
exports.isPOSTLivechatDepartmentProps = Ajv_1.ajv.compile(POSTLivechatDepartmentSchema);
const LivechatDepartmentsAvailableByUnitIdSchema = {
    type: 'object',
    properties: {
        text: {
            type: 'string',
        },
        onlyMyDepartments: {
            type: 'string',
            enum: ['true', 'false'],
            nullable: true,
        },
        count: {
            type: 'number',
            nullable: true,
        },
        offset: {
            type: 'number',
            nullable: true,
        },
        sort: {
            type: 'string',
            nullable: true,
        },
        query: {
            type: 'string',
            nullable: true,
        },
    },
    required: ['text'],
    additionalProperties: false,
};
exports.isLivechatDepartmentsAvailableByUnitIdProps = Ajv_1.ajv.compile(LivechatDepartmentsAvailableByUnitIdSchema);
const LivechatDepartmentsByUnitSchema = {
    type: 'object',
    properties: {
        text: {
            type: 'string',
        },
        count: {
            type: 'number',
            nullable: true,
        },
        offset: {
            type: 'number',
            nullable: true,
        },
        sort: {
            type: 'string',
            nullable: true,
        },
        query: {
            type: 'string',
            nullable: true,
        },
    },
    required: ['text'],
    additionalProperties: false,
};
exports.isLivechatDepartmentsByUnitProps = Ajv_1.ajv.compile(LivechatDepartmentsByUnitSchema);
const LivechatDepartmentsByUnitIdSchema = {
    type: 'object',
    properties: {
        text: {
            type: 'string',
        },
        count: {
            type: 'number',
            nullable: true,
        },
        offset: {
            type: 'number',
            nullable: true,
        },
        sort: {
            type: 'string',
            nullable: true,
        },
        query: {
            type: 'string',
            nullable: true,
        },
    },
    required: ['text'],
    additionalProperties: false,
};
exports.isLivechatDepartmentsByUnitIdProps = Ajv_1.ajv.compile(LivechatDepartmentsByUnitIdSchema);
const LivechatUsersManagerGETSchema = {
    type: 'object',
    properties: {
        text: {
            type: 'string',
            nullable: true,
        },
        onlyAvailable: {
            type: 'boolean',
            nullable: true,
        },
        excludeId: {
            type: 'string',
            nullable: true,
        },
        showIdleAgents: {
            type: 'boolean',
            nullable: true,
        },
        count: {
            type: 'number',
            nullable: true,
        },
        offset: {
            type: 'number',
            nullable: true,
        },
        sort: {
            type: 'string',
            nullable: true,
        },
        query: {
            type: 'string',
            nullable: true,
        },
        fields: {
            type: 'string',
            nullable: true,
        },
    },
    required: [],
    additionalProperties: false,
};
exports.isLivechatUsersManagerGETProps = Ajv_1.ajv.compile(LivechatUsersManagerGETSchema);
const LivechatUsersManagerPOSTSchema = {
    type: 'object',
    properties: {
        username: {
            type: 'string',
        },
        count: {
            type: 'number',
            nullable: true,
        },
        offset: {
            type: 'number',
            nullable: true,
        },
        sort: {
            type: 'string',
            nullable: true,
        },
        query: {
            type: 'string',
            nullable: true,
        },
    },
    required: ['username'],
    additionalProperties: false,
};
exports.isLivechatUsersManagerPOSTProps = Ajv_1.ajv.compile(LivechatUsersManagerPOSTSchema);
const LivechatQueuePropsSchema = {
    type: 'object',
    properties: {
        agentId: {
            type: 'string',
            nullable: true,
        },
        includeOfflineAgents: {
            type: 'string',
            nullable: true,
        },
        departmentId: {
            type: 'string',
            nullable: true,
        },
        count: {
            type: 'number',
        },
        offset: {
            type: 'number',
        },
        sort: {
            type: 'string',
        },
    },
    required: ['count', 'offset', 'sort'],
    additionalProperties: false,
};
exports.isLivechatQueueProps = Ajv_1.ajv.compile(LivechatQueuePropsSchema);
const CannedResponsesPropsSchema = {
    type: 'object',
    properties: {
        scope: {
            type: 'string',
            nullable: true,
        },
        departmentId: {
            type: 'string',
            nullable: true,
        },
        shortcut: {
            type: 'string',
            nullable: true,
        },
        tags: {
            type: 'array',
            items: {
                type: 'string',
            },
            nullable: true,
        },
        createdBy: {
            type: 'string',
            nullable: true,
        },
        text: {
            type: 'string',
            nullable: true,
        },
        count: {
            type: 'number',
            nullable: true,
        },
        offset: {
            type: 'number',
            nullable: true,
        },
        sort: {
            type: 'string',
            nullable: true,
        },
    },
    additionalProperties: false,
};
exports.isCannedResponsesProps = Ajv_1.ajv.compile(CannedResponsesPropsSchema);
const LivechatCustomFieldsSchema = {
    type: 'object',
    properties: {
        text: {
            type: 'string',
            nullable: true,
        },
        count: {
            type: 'number',
            nullable: true,
        },
        offset: {
            type: 'number',
            nullable: true,
        },
        sort: {
            type: 'string',
            nullable: true,
        },
        query: {
            type: 'string',
            nullable: true,
        },
    },
    additionalProperties: false,
};
exports.isLivechatCustomFieldsProps = Ajv_1.ajv.compile(LivechatCustomFieldsSchema);
const LivechatRoomsSchema = {
    type: 'object',
    properties: {
        guest: {
            type: 'string',
        },
        fname: {
            type: 'string',
        },
        servedBy: {
            type: 'array',
            items: {
                type: 'string',
            },
        },
        status: {
            type: 'string',
        },
        department: {
            type: 'string',
        },
        from: {
            type: 'string',
        },
        to: {
            type: 'string',
        },
        customFields: {
            type: 'object',
            nullable: true,
        },
        current: {
            type: 'number',
        },
        itemsPerPage: {
            type: 'number',
        },
        tags: {
            type: 'array',
            items: {
                type: 'string',
            },
        },
    },
    required: ['guest', 'fname', 'servedBy', 'status', 'department', 'from', 'to', 'current', 'itemsPerPage'],
    additionalProperties: false,
};
exports.isLivechatRoomsProps = Ajv_1.ajv.compile(LivechatRoomsSchema);
const LivechatRidMessagesSchema = {
    type: 'object',
    properties: {
        count: {
            type: 'number',
            nullable: true,
        },
        offset: {
            type: 'number',
            nullable: true,
        },
        sort: {
            type: 'string',
            nullable: true,
        },
        searchTerm: {
            type: 'string',
            nullable: true,
        },
    },
    required: [],
    additionalProperties: false,
};
exports.isLivechatRidMessagesProps = Ajv_1.ajv.compile(LivechatRidMessagesSchema);
const LivechatUsersAgentSchema = {
    type: 'object',
    properties: {
        text: {
            type: 'string',
            nullable: true,
        },
        count: {
            type: 'number',
            nullable: true,
        },
        offset: {
            type: 'number',
            nullable: true,
        },
        sort: {
            type: 'string',
            nullable: true,
        },
        query: {
            type: 'string',
            nullable: true,
        },
    },
    required: [],
    additionalProperties: false,
};
exports.isLivechatUsersAgentProps = Ajv_1.ajv.compile(LivechatUsersAgentSchema);
const LivechatPrioritiesPropsSchema = {
    type: 'object',
    properties: {
        text: {
            type: 'string',
            nullable: true,
        },
        count: {
            type: 'number',
            nullable: true,
        },
        offset: {
            type: 'number',
            nullable: true,
        },
        sort: {
            type: 'string',
            nullable: true,
        },
        query: {
            type: 'string',
            nullable: true,
        },
        fields: {
            type: 'string',
            nullable: true,
        },
    },
    required: [],
    additionalProperties: false,
};
exports.isLivechatPrioritiesProps = Ajv_1.ajv.compile(LivechatPrioritiesPropsSchema);
const CreateOrUpdateLivechatSlaPropsSchema = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
        },
        description: {
            type: 'string',
            nullable: true,
        },
        dueTimeInMinutes: {
            type: 'number',
        },
    },
    required: ['name', 'dueTimeInMinutes'],
    additionalProperties: false,
};
exports.isCreateOrUpdateLivechatSlaProps = Ajv_1.ajv.compile(CreateOrUpdateLivechatSlaPropsSchema);
const POSTOmnichannelContactSchema = {
    type: 'object',
    properties: {
        _id: {
            type: 'string',
            nullable: true,
        },
        token: {
            type: 'string',
        },
        name: {
            type: 'string',
        },
        username: {
            type: 'string',
        },
        email: {
            type: 'string',
            nullable: true,
        },
        phone: {
            type: 'string',
            nullable: true,
        },
        customFields: {
            type: 'object',
            nullable: true,
        },
        contactManager: {
            type: 'object',
            nullable: true,
            properties: {
                username: {
                    type: 'string',
                },
            },
        },
    },
    required: ['token', 'name', 'username'],
    additionalProperties: false,
};
exports.isPOSTOmnichannelContactProps = Ajv_1.ajv.compile(POSTOmnichannelContactSchema);
const POSTOmnichannelContactsSchema = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
        },
        emails: {
            type: 'array',
            items: {
                type: 'string',
            },
            uniqueItems: true,
        },
        phones: {
            type: 'array',
            items: {
                type: 'string',
            },
            uniqueItems: true,
        },
        customFields: {
            type: 'object',
            nullable: true,
        },
        contactManager: {
            type: 'string',
            nullable: true,
        },
    },
    required: ['name', 'emails', 'phones'],
    additionalProperties: false,
};
exports.isPOSTOmnichannelContactsProps = Ajv_1.ajv.compile(POSTOmnichannelContactsSchema);
const POSTUpdateOmnichannelContactsSchema = {
    type: 'object',
    properties: {
        contactId: {
            type: 'string',
        },
        name: {
            type: 'string',
        },
        emails: {
            type: 'array',
            items: {
                type: 'string',
            },
            uniqueItems: true,
            nullable: true,
        },
        phones: {
            type: 'array',
            items: {
                type: 'string',
            },
            uniqueItems: true,
            nullable: true,
        },
        customFields: {
            type: 'object',
            nullable: true,
        },
        contactManager: {
            type: 'string',
            nullable: true,
        },
        wipeConflicts: {
            type: 'boolean',
            nullable: true,
        },
    },
    required: ['contactId'],
    additionalProperties: false,
};
exports.isPOSTUpdateOmnichannelContactsProps = Ajv_1.ajv.compile(POSTUpdateOmnichannelContactsSchema);
exports.ContactVisitorAssociationSchema = {
    type: 'object',
    properties: {
        visitorId: {
            type: 'string',
        },
        source: {
            type: 'object',
            properties: {
                type: {
                    type: 'string',
                },
                id: {
                    type: 'string',
                },
            },
            required: ['type'],
        },
    },
    nullable: false,
    required: ['visitorId', 'source'],
};
const GETOmnichannelContactsSchema = {
    oneOf: [
        {
            type: 'object',
            properties: {
                contactId: {
                    type: 'string',
                    nullable: false,
                    isNotEmpty: true,
                },
            },
            required: ['contactId'],
            additionalProperties: false,
        },
        {
            type: 'object',
            properties: {
                visitor: exports.ContactVisitorAssociationSchema,
            },
            required: ['visitor'],
            additionalProperties: false,
        },
    ],
};
exports.isGETOmnichannelContactsProps = Ajv_1.ajv.compile(GETOmnichannelContactsSchema);
const GETOmnichannelContactsSearchSchema = {
    type: 'object',
    properties: {
        count: {
            type: 'number',
        },
        offset: {
            type: 'number',
        },
        sort: {
            type: 'string',
        },
        searchText: {
            type: 'string',
        },
        unknown: {
            type: 'boolean',
        },
    },
    required: [],
    additionalProperties: false,
};
exports.isGETOmnichannelContactsSearchProps = Ajv_1.ajv.compile(GETOmnichannelContactsSearchSchema);
const GETOmnichannelContactHistorySchema = {
    type: 'object',
    properties: {
        contactId: {
            type: 'string',
        },
        source: {
            type: 'string',
        },
        count: {
            type: 'number',
        },
        offset: {
            type: 'number',
        },
        sort: {
            type: 'string',
        },
    },
    required: ['contactId'],
    additionalProperties: false,
};
exports.isGETOmnichannelContactHistoryProps = Ajv_1.ajv.compile(GETOmnichannelContactHistorySchema);
const GETOmnichannelContactsChannelsSchema = {
    type: 'object',
    properties: {
        contactId: {
            type: 'string',
        },
    },
    required: ['contactId'],
    additionalProperties: false,
};
exports.isGETOmnichannelContactsChannelsProps = Ajv_1.ajv.compile(GETOmnichannelContactsChannelsSchema);
const GETOmnichannelContactSchema = {
    type: 'object',
    properties: {
        contactId: {
            type: 'string',
        },
    },
    required: ['contactId'],
    additionalProperties: false,
};
exports.isGETOmnichannelContactProps = Ajv_1.ajv.compile(GETOmnichannelContactSchema);
const LivechatAnalyticsAgentsAverageServiceTimeSchema = {
    type: 'object',
    properties: {
        start: {
            type: 'string',
        },
        end: {
            type: 'string',
        },
    },
    required: ['start', 'end'],
    additionalProperties: false,
};
exports.isLivechatAnalyticsAgentsAverageServiceTimeProps = Ajv_1.ajv.compile(LivechatAnalyticsAgentsAverageServiceTimeSchema);
const GETOmnichannelContactSearchSchema = {
    anyOf: [
        {
            type: 'object',
            properties: {
                email: {
                    type: 'string',
                },
            },
            required: ['email'],
            additionalProperties: false,
        },
        {
            type: 'object',
            properties: {
                phone: {
                    type: 'string',
                },
            },
            required: ['phone'],
            additionalProperties: false,
        },
    ],
};
exports.isGETOmnichannelContactSearchProps = Ajv_1.ajv.compile(GETOmnichannelContactSearchSchema);
const POSTLivechatAgentStatusPropsSchema = {
    type: 'object',
    properties: {
        status: {
            type: 'string',
            enum: Object.values(core_typings_1.ILivechatAgentStatus),
            nullable: true,
        },
        agentId: {
            type: 'string',
            nullable: true,
        },
    },
    additionalProperties: false,
};
exports.isPOSTLivechatAgentStatusProps = Ajv_1.ajv.compile(POSTLivechatAgentStatusPropsSchema);
const LivechatAnalyticsAgentsTotalServiceTimeSchema = {
    type: 'object',
    properties: {
        start: {
            type: 'string',
        },
        end: {
            type: 'string',
        },
    },
    required: ['start', 'end'],
    additionalProperties: false,
};
exports.isLivechatAnalyticsAgentsTotalServiceTimeProps = Ajv_1.ajv.compile(LivechatAnalyticsAgentsTotalServiceTimeSchema);
const LivechatAnalyticsAgentsAvailableForServiceHistorySchema = {
    type: 'object',
    properties: {
        start: {
            type: 'string',
        },
        end: {
            type: 'string',
        },
        fullReport: {
            type: 'string',
            nullable: true,
        },
    },
    required: ['start', 'end'],
    additionalProperties: false,
};
exports.isLivechatAnalyticsAgentsAvailableForServiceHistoryProps = Ajv_1.ajv.compile(LivechatAnalyticsAgentsAvailableForServiceHistorySchema);
const LivechatAnalyticsDepartmentsAmountOfChatsSchema = {
    type: 'object',
    properties: {
        start: {
            type: 'string',
        },
        end: {
            type: 'string',
        },
        answered: {
            type: 'string',
            nullable: true,
        },
        departmentId: {
            type: 'string',
            nullable: true,
        },
    },
    required: ['start', 'end'],
    additionalProperties: false,
};
exports.isLivechatAnalyticsDepartmentsAmountOfChatsProps = Ajv_1.ajv.compile(LivechatAnalyticsDepartmentsAmountOfChatsSchema);
const LivechatAnalyticsDepartmentsAverageServiceTimeSchema = {
    type: 'object',
    properties: {
        start: {
            type: 'string',
        },
        end: {
            type: 'string',
        },
        departmentId: {
            type: 'string',
            nullable: true,
        },
    },
    required: ['start', 'end'],
    additionalProperties: false,
};
exports.isLivechatAnalyticsDepartmentsAverageServiceTimeProps = Ajv_1.ajv.compile(LivechatAnalyticsDepartmentsAverageServiceTimeSchema);
const LivechatAnalyticsDepartmentsAverageChatDurationTimeSchema = {
    type: 'object',
    properties: {
        start: {
            type: 'string',
        },
        end: {
            type: 'string',
        },
        departmentId: {
            type: 'string',
            nullable: true,
        },
    },
    required: ['start', 'end'],
    additionalProperties: false,
};
exports.isLivechatAnalyticsDepartmentsAverageChatDurationTimeProps = Ajv_1.ajv.compile(LivechatAnalyticsDepartmentsAverageChatDurationTimeSchema);
const LivechatAnalyticsDepartmentsTotalServiceTimeSchema = {
    type: 'object',
    properties: {
        start: {
            type: 'string',
        },
        end: {
            type: 'string',
        },
        departmentId: {
            type: 'string',
            nullable: true,
        },
    },
    required: ['start', 'end'],
    additionalProperties: false,
};
exports.isLivechatAnalyticsDepartmentsTotalServiceTimeProps = Ajv_1.ajv.compile(LivechatAnalyticsDepartmentsTotalServiceTimeSchema);
const LivechatAnalyticsDepartmentsAverageWaitingTimeSchema = {
    type: 'object',
    properties: {
        start: {
            type: 'string',
        },
        end: {
            type: 'string',
        },
        departmentId: {
            type: 'string',
            nullable: true,
        },
    },
    required: ['start', 'end'],
    additionalProperties: false,
};
exports.isLivechatAnalyticsDepartmentsAverageWaitingTimeProps = Ajv_1.ajv.compile(LivechatAnalyticsDepartmentsAverageWaitingTimeSchema);
const LivechatAnalyticsDepartmentsTotalTransferredChatsSchema = {
    type: 'object',
    properties: {
        start: {
            type: 'string',
        },
        end: {
            type: 'string',
        },
        departmentId: {
            type: 'string',
            nullable: true,
        },
    },
    required: ['start', 'end'],
    additionalProperties: false,
};
exports.isLivechatAnalyticsDepartmentsTotalTransferredChatsProps = Ajv_1.ajv.compile(LivechatAnalyticsDepartmentsTotalTransferredChatsSchema);
const LivechatAnalyticsDepartmentsTotalAbandonedChatsSchema = {
    type: 'object',
    properties: {
        start: {
            type: 'string',
        },
        end: {
            type: 'string',
        },
        departmentId: {
            type: 'string',
            nullable: true,
        },
    },
    required: ['start', 'end'],
    additionalProperties: false,
};
exports.isLivechatAnalyticsDepartmentsTotalAbandonedChatsProps = Ajv_1.ajv.compile(LivechatAnalyticsDepartmentsTotalAbandonedChatsSchema);
const LivechatAnalyticsDepartmentsPercentageAbandonedChatsSchema = {
    type: 'object',
    properties: {
        start: {
            type: 'string',
        },
        end: {
            type: 'string',
        },
        departmentId: {
            type: 'string',
            nullable: true,
        },
    },
    required: ['start', 'end'],
    additionalProperties: false,
};
exports.isLivechatAnalyticsDepartmentsPercentageAbandonedChatsProps = Ajv_1.ajv.compile(LivechatAnalyticsDepartmentsPercentageAbandonedChatsSchema);
const GETAgentNextTokenSchema = {
    type: 'object',
    properties: {
        department: {
            type: 'string',
            nullable: true,
        },
    },
    additionalProperties: false,
};
exports.isGETAgentNextToken = Ajv_1.ajv.compile(GETAgentNextTokenSchema);
const GETLivechatConfigParamsSchema = {
    type: 'object',
    properties: {
        token: {
            type: 'string',
            nullable: true,
        },
        department: {
            type: 'string',
            nullable: true,
        },
        businessUnit: {
            type: 'string',
            nullable: true,
        },
    },
    additionalProperties: false,
};
exports.isGETLivechatConfigParams = Ajv_1.ajv.compile(GETLivechatConfigParamsSchema);
const POSTLivechatCustomFieldParamsSchema = {
    type: 'object',
    properties: {
        token: {
            type: 'string',
        },
        key: {
            type: 'string',
        },
        value: {
            type: 'string',
        },
        overwrite: {
            type: 'boolean',
        },
    },
    required: ['token', 'key', 'value', 'overwrite'],
    additionalProperties: false,
};
exports.isPOSTLivechatCustomFieldParams = Ajv_1.ajv.compile(POSTLivechatCustomFieldParamsSchema);
const POSTLivechatCustomFieldsParamsSchema = {
    type: 'object',
    properties: {
        token: {
            type: 'string',
        },
        customFields: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    key: {
                        type: 'string',
                    },
                    value: {
                        type: 'string',
                    },
                    overwrite: {
                        type: 'boolean',
                    },
                },
                required: ['key', 'value', 'overwrite'],
                additionalProperties: false,
            },
        },
    },
    required: ['token', 'customFields'],
    additionalProperties: false,
};
exports.isPOSTLivechatCustomFieldsParams = Ajv_1.ajv.compile(POSTLivechatCustomFieldsParamsSchema);
const GETWebRTCCallSchema = {
    type: 'object',
    properties: {
        rid: {
            type: 'string',
        },
    },
    required: ['rid'],
    additionalProperties: false,
};
exports.isGETWebRTCCall = Ajv_1.ajv.compile(GETWebRTCCallSchema);
const PUTWebRTCCallIdSchema = {
    type: 'object',
    properties: {
        rid: {
            type: 'string',
        },
        status: {
            type: 'string',
        },
    },
    required: ['rid', 'status'],
    additionalProperties: false,
};
exports.isPUTWebRTCCallId = Ajv_1.ajv.compile(PUTWebRTCCallIdSchema);
const POSTLivechatTranscriptParamsSchema = {
    type: 'object',
    properties: {
        rid: {
            type: 'string',
        },
        token: {
            type: 'string',
        },
        email: {
            type: 'string',
        },
    },
    required: ['rid', 'token', 'email'],
    additionalProperties: false,
};
exports.isPOSTLivechatTranscriptParams = Ajv_1.ajv.compile(POSTLivechatTranscriptParamsSchema);
const POSTLivechatOfflineMessageParamsSchema = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
        },
        email: {
            type: 'string',
        },
        message: {
            type: 'string',
        },
        department: {
            type: 'string',
            nullable: true,
        },
        host: {
            type: 'string',
            nullable: true,
        },
    },
    required: ['name', 'email', 'message'],
    additionalProperties: false,
};
exports.isPOSTLivechatOfflineMessageParams = Ajv_1.ajv.compile(POSTLivechatOfflineMessageParamsSchema);
const POSTLivechatPageVisitedParamsSchema = {
    type: 'object',
    properties: {
        token: {
            type: 'string',
        },
        rid: {
            type: 'string',
            nullable: true,
        },
        pageInfo: {
            type: 'object',
            properties: {
                title: {
                    type: 'string',
                },
                change: {
                    type: 'string',
                },
                location: {
                    type: 'object',
                    properties: {
                        href: {
                            type: 'string',
                        },
                    },
                    required: ['href'],
                    additionalProperties: false,
                },
            },
            required: ['title', 'change', 'location'],
            additionalProperties: false,
        },
    },
    required: ['token', 'pageInfo'],
    additionalProperties: false,
};
exports.isPOSTLivechatPageVisitedParams = Ajv_1.ajv.compile(POSTLivechatPageVisitedParamsSchema);
const POSTLivechatMessageParamsSchema = {
    type: 'object',
    properties: {
        token: {
            type: 'string',
        },
        rid: {
            type: 'string',
        },
        msg: {
            type: 'string',
        },
        _id: {
            type: 'string',
            nullable: true,
        },
        agent: {
            type: 'object',
            properties: {
                agentId: {
                    type: 'string',
                },
                username: {
                    type: 'string',
                },
            },
            required: ['agentId', 'username'],
            additionalProperties: false,
        },
    },
    required: ['token', 'rid', 'msg'],
    additionalProperties: false,
};
exports.isPOSTLivechatMessageParams = Ajv_1.ajv.compile(POSTLivechatMessageParamsSchema);
const GETLivechatMessageIdParamsSchema = {
    type: 'object',
    properties: {
        token: {
            type: 'string',
        },
        rid: {
            type: 'string',
        },
    },
    required: ['token', 'rid'],
    additionalProperties: false,
};
exports.isGETLivechatMessageIdParams = Ajv_1.ajv.compile(GETLivechatMessageIdParamsSchema);
const PUTLivechatMessageIdParamsSchema = {
    type: 'object',
    properties: {
        token: {
            type: 'string',
        },
        rid: {
            type: 'string',
        },
        msg: {
            type: 'string',
        },
    },
    required: ['token', 'rid', 'msg'],
    additionalProperties: false,
};
exports.isPUTLivechatMessageIdParams = Ajv_1.ajv.compile(PUTLivechatMessageIdParamsSchema);
const DELETELivechatMessageIdParamsSchema = {
    type: 'object',
    properties: {
        token: {
            type: 'string',
        },
        rid: {
            type: 'string',
        },
        count: {
            type: 'number',
            nullable: true,
        },
        offset: {
            type: 'number',
            nullable: true,
        },
        sort: {
            type: 'string',
            nullable: true,
        },
    },
    required: ['token', 'rid'],
    additionalProperties: false,
};
exports.isDELETELivechatMessageIdParams = Ajv_1.ajv.compile(DELETELivechatMessageIdParamsSchema);
const GETLivechatMessagesHistoryRidParamsSchema = {
    type: 'object',
    properties: {
        searchText: {
            type: 'string',
            nullable: true,
        },
        token: {
            type: 'string',
        },
        count: {
            type: 'number',
            nullable: true,
        },
        offset: {
            type: 'number',
            nullable: true,
        },
        sort: {
            type: 'string',
            nullable: true,
        },
        ls: {
            type: 'string',
            nullable: true,
        },
        end: {
            type: 'string',
            nullable: true,
        },
        limit: {
            type: 'number',
            nullable: true,
        },
    },
    required: ['token'],
    additionalProperties: false,
};
exports.isGETLivechatMessagesHistoryRidParams = Ajv_1.ajv.compile(GETLivechatMessagesHistoryRidParamsSchema);
const GETLivechatMessagesParamsSchema = {
    type: 'object',
    properties: {
        visitor: {
            type: 'object',
            properties: {
                token: {
                    type: 'string',
                },
            },
            required: ['token'],
            additionalProperties: false,
        },
        messages: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    msg: {
                        type: 'string',
                    },
                },
                required: ['msg'],
                additionalProperties: false,
            },
            minItems: 1,
        },
    },
    required: ['visitor', 'messages'],
    additionalProperties: false,
};
exports.isGETLivechatMessagesParams = Ajv_1.ajv.compile(GETLivechatMessagesParamsSchema);
const GETLivechatRoomParamsSchema = {
    type: 'object',
    properties: {
        token: {
            type: 'string',
        },
        rid: {
            type: 'string',
            nullable: true,
        },
        agentId: {
            type: 'string',
            nullable: true,
        },
    },
    required: ['token'],
    additionalProperties: true,
};
exports.isGETLivechatRoomParams = Ajv_1.ajv.compile(GETLivechatRoomParamsSchema);
const POSTLivechatRoomCloseParamsSchema = {
    type: 'object',
    properties: {
        token: {
            type: 'string',
        },
        rid: {
            type: 'string',
        },
    },
    required: ['token', 'rid'],
    additionalProperties: false,
};
exports.isPOSTLivechatRoomCloseParams = Ajv_1.ajv.compile(POSTLivechatRoomCloseParamsSchema);
const POSTLivechatRoomCloseByUserParamsSchema = {
    type: 'object',
    properties: {
        rid: {
            type: 'string',
        },
        comment: {
            type: 'string',
            nullable: true,
        },
        tags: {
            type: 'array',
            items: {
                type: 'string',
            },
            nullable: true,
        },
        generateTranscriptPdf: {
            type: 'boolean',
            nullable: true,
        },
        transcriptEmail: {
            type: 'object',
            properties: {
                sendToVisitor: {
                    type: 'boolean',
                },
                requestData: {
                    type: 'object',
                    properties: {
                        email: {
                            type: 'string',
                        },
                        subject: {
                            type: 'string',
                        },
                    },
                    required: ['email', 'subject'],
                    additionalProperties: false,
                },
            },
            required: ['sendToVisitor'],
            additionalProperties: false,
        },
    },
    required: ['rid'],
    additionalProperties: false,
};
exports.isPOSTLivechatRoomCloseByUserParams = Ajv_1.ajv.compile(POSTLivechatRoomCloseByUserParamsSchema);
const POSTLivechatRoomTransferParamsSchema = {
    type: 'object',
    properties: {
        token: {
            type: 'string',
        },
        rid: {
            type: 'string',
        },
        department: {
            type: 'string',
        },
    },
    required: ['token', 'rid', 'department'],
    additionalProperties: false,
};
exports.isPOSTLivechatRoomTransferParams = Ajv_1.ajv.compile(POSTLivechatRoomTransferParamsSchema);
const POSTLivechatRoomSurveyParamsSchema = {
    type: 'object',
    properties: {
        token: {
            type: 'string',
        },
        rid: {
            type: 'string',
        },
        data: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string',
                    },
                    value: {
                        type: 'string',
                    },
                },
                required: ['name', 'value'],
                additionalProperties: false,
            },
            minItems: 1,
        },
    },
    required: ['token', 'rid', 'data'],
    additionalProperties: false,
};
exports.isPOSTLivechatRoomSurveyParams = Ajv_1.ajv.compile(POSTLivechatRoomSurveyParamsSchema);
const POSTCannedResponsesPropsSchema = {
    type: 'object',
    properties: {
        _id: {
            type: 'string',
            nullable: true,
        },
        shortcut: {
            type: 'string',
        },
        text: {
            type: 'string',
        },
        scope: {
            type: 'string',
        },
        departmentId: {
            type: 'string',
            nullable: true,
        },
        tags: {
            type: 'array',
            items: {
                type: 'string',
            },
            nullable: true,
        },
    },
    required: ['shortcut', 'text', 'scope'],
    additionalProperties: false,
};
exports.isPOSTCannedResponsesProps = Ajv_1.ajv.compile(POSTCannedResponsesPropsSchema);
const DELETECannedResponsesPropsSchema = {
    type: 'object',
    properties: {
        _id: {
            type: 'string',
        },
    },
    required: ['_id'],
    additionalProperties: false,
};
exports.isDELETECannedResponsesProps = Ajv_1.ajv.compile(DELETECannedResponsesPropsSchema);
const POSTLivechatUsersTypePropsSchema = {
    type: 'object',
    properties: {
        username: {
            type: 'string',
        },
    },
    required: ['username'],
    additionalProperties: false,
};
exports.isPOSTLivechatUsersTypeProps = Ajv_1.ajv.compile(POSTLivechatUsersTypePropsSchema);
const GETLivechatVisitorsPagesVisitedRoomIdParamsSchema = {
    type: 'object',
    properties: {
        count: {
            type: 'number',
            nullable: true,
        },
        offset: {
            type: 'number',
            nullable: true,
        },
        sort: {
            type: 'string',
            nullable: true,
        },
    },
    additionalProperties: false,
};
exports.isGETLivechatVisitorsPagesVisitedRoomIdParams = Ajv_1.ajv.compile(GETLivechatVisitorsPagesVisitedRoomIdParamsSchema);
const GETLivechatVisitorsChatHistoryRoomRoomIdVisitorVisitorIdParamsSchema = {
    type: 'object',
    properties: {
        count: {
            type: 'number',
            nullable: true,
        },
        offset: {
            type: 'number',
            nullable: true,
        },
        sort: {
            type: 'string',
            nullable: true,
        },
    },
    additionalProperties: false,
};
exports.isGETLivechatVisitorsChatHistoryRoomRoomIdVisitorVisitorIdParams = Ajv_1.ajv.compile(GETLivechatVisitorsChatHistoryRoomRoomIdVisitorVisitorIdParamsSchema);
const GETLivechatVisitorsSearchChatsRoomRoomIdVisitorVisitorIdParamsSchema = {
    type: 'object',
    properties: {
        count: {
            type: 'number',
            nullable: true,
        },
        offset: {
            type: 'number',
            nullable: true,
        },
        sort: {
            type: 'string',
            nullable: true,
        },
        searchText: {
            type: 'string',
            nullable: true,
        },
        closedChatsOnly: {
            type: 'string',
            nullable: true,
        },
        servedChatsOnly: {
            type: 'string',
            nullable: true,
        },
        source: {
            type: 'string',
            nullable: true,
        },
    },
    additionalProperties: false,
};
exports.isGETLivechatVisitorsSearchChatsRoomRoomIdVisitorVisitorIdParams = Ajv_1.ajv.compile(GETLivechatVisitorsSearchChatsRoomRoomIdVisitorVisitorIdParamsSchema);
const GETLivechatVisitorsAutocompleteParamsSchema = {
    type: 'object',
    properties: {
        selector: {
            type: 'string',
        },
    },
    required: ['selector'],
    additionalProperties: false,
};
exports.isGETLivechatVisitorsAutocompleteParams = Ajv_1.ajv.compile(GETLivechatVisitorsAutocompleteParamsSchema);
const GETLivechatVisitorsSearchSchema = {
    type: 'object',
    properties: {
        count: {
            type: 'number',
            nullable: true,
        },
        offset: {
            type: 'number',
            nullable: true,
        },
        sort: {
            type: 'string',
            nullable: true,
        },
        term: {
            type: 'string',
            nullable: true,
        },
    },
    required: ['term'],
    additionalProperties: false,
};
exports.isGETLivechatVisitorsSearch = Ajv_1.ajv.compile(GETLivechatVisitorsSearchSchema);
const GETLivechatAgentsAgentIdDepartmentsParamsSchema = {
    type: 'object',
    properties: {
        enabledDepartmentsOnly: {
            type: 'string',
            nullable: true,
        },
    },
    additionalProperties: false,
};
exports.isGETLivechatAgentsAgentIdDepartmentsParams = Ajv_1.ajv.compile(GETLivechatAgentsAgentIdDepartmentsParamsSchema);
const GETBusinessHourParamsSchema = {
    type: 'object',
    properties: {
        _id: {
            type: 'string',
            nullable: true,
        },
        type: {
            type: 'string',
            nullable: true,
        },
    },
    additionalProperties: false,
};
exports.isGETBusinessHourParams = Ajv_1.ajv.compile(GETBusinessHourParamsSchema);
const GETLivechatTriggersParamsSchema = {
    type: 'object',
    properties: {
        count: {
            type: 'number',
            nullable: true,
        },
        offset: {
            type: 'number',
            nullable: true,
        },
        sort: {
            type: 'string',
            nullable: true,
        },
    },
    additionalProperties: false,
};
exports.isGETLivechatTriggersParams = Ajv_1.ajv.compile(GETLivechatTriggersParamsSchema);
const GETLivechatRoomsParamsSchema = {
    type: 'object',
    properties: {
        count: {
            type: 'number',
            nullable: true,
        },
        offset: {
            type: 'number',
            nullable: true,
        },
        sort: {
            type: 'string',
            nullable: true,
        },
        query: {
            type: 'string',
            nullable: true,
        },
        fields: {
            type: 'string',
            nullable: true,
        },
        createdAt: {
            type: 'string',
            nullable: true,
        },
        customFields: {
            type: 'string',
            nullable: true,
        },
        closedAt: {
            type: 'string',
            nullable: true,
        },
        agents: {
            type: 'array',
            items: {
                type: 'string',
            },
            nullable: true,
        },
        roomName: {
            type: 'string',
            nullable: true,
        },
        departmentId: {
            type: 'string',
            nullable: true,
        },
        open: {
            anyOf: [
                { type: 'string', nullable: true },
                { type: 'boolean', nullable: true },
            ],
        },
        onhold: {
            anyOf: [
                { type: 'string', nullable: true },
                { type: 'boolean', nullable: true },
            ],
        },
        queued: {
            anyOf: [
                { type: 'string', nullable: true },
                { type: 'boolean', nullable: true },
            ],
        },
        tags: {
            type: 'array',
            items: {
                type: 'string',
            },
            nullable: true,
        },
    },
    additionalProperties: false,
};
exports.isGETLivechatRoomsParams = Ajv_1.ajv.compile(GETLivechatRoomsParamsSchema);
const POSTLivechatRoomPriorityParamsSchema = {
    type: 'object',
    properties: {
        priorityId: {
            type: 'string',
        },
    },
    required: ['priorityId'],
    additionalProperties: false,
};
exports.isPOSTLivechatRoomPriorityParams = Ajv_1.ajv.compile(POSTLivechatRoomPriorityParamsSchema);
const GETLivechatQueueParamsSchema = {
    type: 'object',
    properties: {
        count: {
            type: 'number',
            nullable: true,
        },
        offset: {
            type: 'number',
            nullable: true,
        },
        sort: {
            type: 'string',
            nullable: true,
        },
        agentId: {
            type: 'string',
            nullable: true,
        },
        departmentId: {
            type: 'string',
            nullable: true,
        },
        includeOfflineAgents: {
            type: 'string',
            nullable: true,
        },
    },
    additionalProperties: false,
};
exports.isGETLivechatQueueParams = Ajv_1.ajv.compile(GETLivechatQueueParamsSchema);
const GETLivechatPrioritiesParamsSchema = {
    type: 'object',
    properties: {
        count: {
            type: 'number',
            nullable: true,
        },
        offset: {
            type: 'number',
            nullable: true,
        },
        sort: {
            type: 'string',
            nullable: true,
        },
        text: {
            type: 'string',
            nullable: true,
        },
    },
    required: [],
    additionalProperties: false,
};
exports.isGETLivechatPrioritiesParams = Ajv_1.ajv.compile(GETLivechatPrioritiesParamsSchema);
const DELETELivechatPriorityParamsSchema = {
    type: 'object',
    properties: {
        priorityId: {
            type: 'string',
        },
    },
    required: ['priorityId'],
    additionalProperties: false,
};
exports.isDELETELivechatPriorityParams = Ajv_1.ajv.compile(DELETELivechatPriorityParamsSchema);
const POSTLivechatPriorityParamsSchema = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
            nullable: false,
        },
        level: {
            type: 'string',
            nullable: false,
        },
    },
    required: ['name', 'level'],
    additionalProperties: false,
};
exports.isPOSTLivechatPriorityParams = Ajv_1.ajv.compile(POSTLivechatPriorityParamsSchema);
const GETLivechatInquiriesListParamsSchema = {
    type: 'object',
    properties: {
        count: {
            type: 'number',
            nullable: true,
        },
        offset: {
            type: 'number',
            nullable: true,
        },
        sort: {
            type: 'string',
            nullable: true,
        },
        department: {
            type: 'string',
            nullable: true,
        },
    },
    additionalProperties: false,
};
exports.isGETLivechatInquiriesListParams = Ajv_1.ajv.compile(GETLivechatInquiriesListParamsSchema);
const POSTLivechatInquiriesTakeParamsSchema = {
    type: 'object',
    properties: {
        inquiryId: {
            type: 'string',
        },
        userId: {
            type: 'string',
            nullable: true,
        },
    },
    additionalProperties: false,
    required: ['inquiryId'],
};
exports.isPOSTLivechatInquiriesTakeParams = Ajv_1.ajv.compile(POSTLivechatInquiriesTakeParamsSchema);
const GETLivechatInquiriesQueuedForUserParamsSchema = {
    type: 'object',
    properties: {
        count: {
            type: 'number',
            nullable: true,
        },
        offset: {
            type: 'number',
            nullable: true,
        },
        sort: {
            type: 'string',
            nullable: true,
        },
        department: {
            type: 'string',
            nullable: true,
        },
    },
    additionalProperties: false,
};
exports.isGETLivechatInquiriesQueuedForUserParams = Ajv_1.ajv.compile(GETLivechatInquiriesQueuedForUserParamsSchema);
const GETLivechatInquiriesGetOneParamsSchema = {
    type: 'object',
    properties: {
        roomId: {
            type: 'string',
        },
    },
    additionalProperties: false,
    required: ['roomId'],
};
exports.isGETLivechatInquiriesGetOneParams = Ajv_1.ajv.compile(GETLivechatInquiriesGetOneParamsSchema);
const GETLivechatAnalyticsDashboardsConversationTotalizersParamsSchema = {
    type: 'object',
    properties: {
        start: {
            type: 'string',
        },
        end: {
            type: 'string',
        },
        departmentId: {
            type: 'string',
            nullable: true,
        },
    },
    additionalProperties: false,
    required: ['start', 'end'],
};
exports.isGETDashboardTotalizerParams = Ajv_1.ajv.compile(GETLivechatAnalyticsDashboardsConversationTotalizersParamsSchema);
const GETLivechatAnalyticsDashboardsAgentStatusParamsSchema = {
    type: 'object',
    properties: {
        departmentId: {
            type: 'string',
            nullable: true,
        },
    },
    // FE is sending start/end params, since they use the same container for doing all calls.
    // This will prevent FE breaking, but's a TODO for an upcoming engday
    additionalProperties: true,
};
exports.isGETDashboardsAgentStatusParams = Ajv_1.ajv.compile(GETLivechatAnalyticsDashboardsAgentStatusParamsSchema);
const PUTLivechatPrioritySchema = {
    oneOf: [
        {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                },
                required: true,
            },
            additionalProperties: false,
        },
        {
            type: 'object',
            properties: {
                reset: {
                    type: 'boolean',
                },
                required: true,
            },
            additionalProperties: false,
        },
    ],
};
exports.isPUTLivechatPriority = Ajv_1.ajv.compile(PUTLivechatPrioritySchema);
const POSTomnichannelIntegrationsSchema = {
    type: 'object',
    properties: {
        LivechatWebhookUrl: {
            type: 'string',
            nullable: true,
        },
        LivechatSecretToken: {
            type: 'string',
            nullable: true,
        },
        LivechatHttpTimeout: {
            type: 'number',
            nullable: true,
        },
        LivechatWebhookOnStart: {
            type: 'boolean',
            nullable: true,
        },
        LivechatWebhookOnClose: {
            type: 'boolean',
            nullable: true,
        },
        LivechatWebhookOnChatTaken: {
            type: 'boolean',
            nullable: true,
        },
        LivechatWebhookOnChatQueued: {
            type: 'boolean',
            nullable: true,
        },
        LivechatWebhookOnForward: {
            type: 'boolean',
            nullable: true,
        },
        LivechatWebhookOnOfflineMsg: {
            type: 'boolean',
            nullable: true,
        },
        LivechatWebhookOnVisitorMessage: {
            type: 'boolean',
            nullable: true,
        },
        LivechatWebhookOnAgentMessage: {
            type: 'boolean',
            nullable: true,
        },
    },
    required: [],
    additionalProperties: false,
};
exports.isPOSTomnichannelIntegrations = Ajv_1.ajv.compile(POSTomnichannelIntegrationsSchema);
const POSTLivechatTranscriptRequestParamsSchema = {
    type: 'object',
    properties: {
        email: {
            type: 'string',
        },
        subject: {
            type: 'string',
        },
    },
    required: ['email', 'subject'],
    additionalProperties: false,
};
exports.isPOSTLivechatTranscriptRequestParams = Ajv_1.ajv.compile(POSTLivechatTranscriptRequestParamsSchema);
const POSTLivechatTriggersParamsSchema = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
        },
        description: {
            type: 'string',
        },
        enabled: {
            type: 'boolean',
        },
        runOnce: {
            type: 'boolean',
        },
        conditions: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string',
                        enum: ['time-on-site', 'page-url', 'chat-opened-by-visitor', 'after-guest-registration'],
                    },
                    value: {
                        type: 'string',
                        nullable: true,
                    },
                },
                required: ['name', 'value'],
                additionalProperties: false,
            },
            minItems: 1,
        },
        actions: {
            type: 'array',
            items: {
                oneOf: [
                    {
                        type: 'object',
                        properties: {
                            name: {
                                type: 'string',
                                enum: ['send-message'],
                            },
                            params: {
                                type: 'object',
                                nullable: true,
                                properties: {
                                    sender: {
                                        type: 'string',
                                        enum: ['queue', 'custom'],
                                    },
                                    msg: {
                                        type: 'string',
                                    },
                                    name: {
                                        type: 'string',
                                        nullable: true,
                                    },
                                },
                                required: ['sender', 'msg'],
                                additionalProperties: false,
                            },
                        },
                        required: ['name'],
                        additionalProperties: false,
                    },
                    {
                        type: 'object',
                        properties: {
                            name: {
                                type: 'string',
                                enum: ['use-external-service'],
                            },
                            params: {
                                type: 'object',
                                nullable: true,
                                properties: {
                                    sender: {
                                        type: 'string',
                                        enum: ['queue', 'custom'],
                                    },
                                    name: {
                                        type: 'string',
                                        nullable: true,
                                    },
                                    serviceUrl: {
                                        type: 'string',
                                    },
                                    serviceTimeout: {
                                        type: 'number',
                                    },
                                    serviceFallbackMessage: {
                                        type: 'string',
                                    },
                                },
                                required: ['serviceUrl', 'serviceTimeout', 'serviceFallbackMessage'],
                                additionalProperties: false,
                            },
                        },
                        required: ['name'],
                        additionalProperties: false,
                    },
                ],
            },
            minItems: 1,
        },
        _id: {
            type: 'string',
            nullable: true,
        },
    },
    required: ['name', 'description', 'enabled', 'runOnce', 'conditions', 'actions'],
    additionalProperties: false,
};
exports.isPOSTLivechatTriggersParams = Ajv_1.ajv.compile(POSTLivechatTriggersParamsSchema);
const POSTLivechatAppearanceParamsSchema = {
    type: 'array',
    items: {
        type: 'object',
        properties: {
            _id: {
                type: 'string',
            },
            value: {
                // Be careful with anyOf - https://github.com/ajv-validator/ajv/issues/1140
                type: ['string', 'boolean', 'number', 'array'],
            },
        },
        required: ['_id', 'value'],
        additionalProperties: false,
    },
    minItems: 1,
};
exports.isPOSTLivechatAppearanceParams = Ajv_1.ajv.compile(POSTLivechatAppearanceParamsSchema);
const GETDashboardConversationsByTypeSchema = {
    type: 'object',
    properties: {
        start: {
            type: 'string',
        },
        end: {
            type: 'string',
        },
        sort: {
            type: 'string',
        },
    },
    required: ['start', 'end'],
    additionalProperties: false,
};
exports.isGETDashboardConversationsByType = Ajv_1.ajv.compile(GETDashboardConversationsByTypeSchema);
const LivechatAnalyticsAgentOverviewPropsSchema = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
        },
        from: {
            type: 'string',
        },
        to: {
            type: 'string',
        },
        departmentId: {
            type: 'string',
            nullable: true,
        },
    },
    required: ['name', 'from', 'to'],
    additionalProperties: false,
};
exports.isLivechatAnalyticsAgentOverviewProps = Ajv_1.ajv.compile(LivechatAnalyticsAgentOverviewPropsSchema);
const LivechatAnalyticsOverviewPropsSchema = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
        },
        from: {
            type: 'string',
        },
        to: {
            type: 'string',
        },
        departmentId: {
            type: 'string',
            nullable: true,
        },
    },
    required: ['name', 'from', 'to'],
    additionalProperties: false,
};
exports.isLivechatAnalyticsOverviewProps = Ajv_1.ajv.compile(LivechatAnalyticsOverviewPropsSchema);
const LivechatTriggerWebhookTestParamsSchema = {
    type: 'object',
    properties: {
        webhookUrl: {
            type: 'string',
        },
        timeout: {
            type: 'number',
        },
        fallbackMessage: {
            type: 'string',
        },
        extraData: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    key: {
                        type: 'string',
                    },
                    value: {
                        type: 'string',
                    },
                },
                required: ['key', 'value'],
                additionalProperties: false,
            },
            nullable: true,
        },
    },
    required: ['webhookUrl', 'timeout', 'fallbackMessage'],
    additionalProperties: false,
};
exports.isLivechatTriggerWebhookTestParams = Ajv_1.ajv.compile(LivechatTriggerWebhookTestParamsSchema);
const LivechatTriggerWebhookCallParamsSchema = {
    type: 'object',
    properties: {
        token: {
            type: 'string',
        },
        extraData: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    key: {
                        type: 'string',
                    },
                    value: {
                        type: 'string',
                    },
                },
                required: ['key', 'value'],
                additionalProperties: false,
            },
            nullable: true,
        },
    },
    required: ['token'],
    additionalProperties: false,
};
exports.isLivechatTriggerWebhookCallParams = Ajv_1.ajv.compile(LivechatTriggerWebhookCallParamsSchema);
