"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCreateRoom = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_i18next_1 = require("react-i18next");
const useCreateRoomItems_1 = require("./useCreateRoomItems");
const useMatrixFederationItems_1 = require("./useMatrixFederationItems");
const useIsEnterprise_1 = require("../../../../hooks/useIsEnterprise");
const CREATE_ROOM_PERMISSIONS = ['create-c', 'create-p', 'create-d', 'start-discussion', 'start-discussion-other-user'];
const useCreateRoom = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const showCreate = (0, ui_contexts_1.useAtLeastOnePermission)(CREATE_ROOM_PERMISSIONS);
    const { data } = (0, useIsEnterprise_1.useIsEnterprise)();
    const isMatrixEnabled = (0, ui_contexts_1.useSetting)('Federation_Matrix_enabled') && (data === null || data === void 0 ? void 0 : data.isEnterprise);
    const createRoomItems = (0, useCreateRoomItems_1.useCreateRoomItems)();
    const matrixFederationSearchItems = (0, useMatrixFederationItems_1.useMatrixFederationItems)({ isMatrixEnabled });
    const sections = [
        { title: t('Create_new'), items: createRoomItems, permission: showCreate },
        { title: t('Explore'), items: matrixFederationSearchItems, permission: showCreate && isMatrixEnabled },
    ];
    return sections.filter((section) => section.permission);
};
exports.useCreateRoom = useCreateRoom;
