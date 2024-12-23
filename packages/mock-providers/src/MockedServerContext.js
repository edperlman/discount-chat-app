"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockedServerContext = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importDefault(require("react"));
const MockedServerContext = ({ handleRequest, handleMethod, children, }) => {
    const [queryClient] = react_1.default.useState(() => new react_query_1.QueryClient());
    return ((0, jsx_runtime_1.jsx)(ui_contexts_1.ServerContext.Provider, { value: {
            absoluteUrl: (path) => `http://localhost:3000/${path}`,
            callMethod: (methodName, ...args) => {
                return handleMethod === null || handleMethod === void 0 ? void 0 : handleMethod(methodName, ...args);
            },
            callEndpoint: (args) => __awaiter(void 0, void 0, void 0, function* () {
                return handleRequest === null || handleRequest === void 0 ? void 0 : handleRequest(args);
            }),
            getStream: () => () => undefined,
        }, children: (0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: children }) }));
};
exports.MockedServerContext = MockedServerContext;
