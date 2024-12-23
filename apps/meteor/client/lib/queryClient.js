"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryClient = void 0;
const react_query_1 = require("@tanstack/react-query");
exports.queryClient = new react_query_1.QueryClient({
    defaultOptions: {
        queries: {
            onError: console.warn,
            refetchOnWindowFocus: false,
            retry: process.env.TEST_MODE === 'true',
        },
        mutations: {
            onError: console.warn,
        },
    },
});
