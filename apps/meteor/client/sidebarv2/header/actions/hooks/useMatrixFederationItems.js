"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMatrixFederationItems = void 0;
const react_i18next_1 = require("react-i18next");
const MatrixFederationSearch_1 = __importDefault(require("../../MatrixFederationSearch"));
const useCreateRoomModal_1 = require("../../hooks/useCreateRoomModal");
const useMatrixFederationItems = ({ isMatrixEnabled, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const searchFederatedRooms = (0, useCreateRoomModal_1.useCreateRoomModal)(MatrixFederationSearch_1.default);
    const matrixFederationSearchItem = {
        id: 'matrix-federation-search',
        content: t('Federation_Search_federated_rooms'),
        icon: 'magnifier',
        onClick: () => {
            searchFederatedRooms();
        },
    };
    return [...(isMatrixEnabled ? [matrixFederationSearchItem] : [])];
};
exports.useMatrixFederationItems = useMatrixFederationItems;
