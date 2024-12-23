"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockedUserContext = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const userContextValue = {
    userId: 'john.doe',
    user: {
        _id: 'john.doe',
        username: 'john.doe',
        name: 'John Doe',
        createdAt: new Date(),
        active: true,
        _updatedAt: new Date(),
        roles: ['admin'],
        type: 'user',
    },
    queryPreference: ((pref, defaultValue) => [
        () => () => undefined,
        () => (typeof pref === 'string' ? undefined : defaultValue),
    ]),
    querySubscriptions: () => [() => () => undefined, () => []],
    querySubscription: () => [() => () => undefined, () => undefined],
    queryRoom: () => [() => () => undefined, () => undefined],
    logout: () => Promise.resolve(),
};
const createUserContextValue = ({ userPreferences }) => {
    return Object.assign(Object.assign({}, userContextValue), (userPreferences && { queryPreference: (id) => [() => () => undefined, () => userPreferences[id]] }));
};
const MockedUserContext = ({ userPreferences, children, }) => {
    return (0, jsx_runtime_1.jsx)(ui_contexts_1.UserContext.Provider, { value: createUserContextValue({ userPreferences }), children: children });
};
exports.MockedUserContext = MockedUserContext;
