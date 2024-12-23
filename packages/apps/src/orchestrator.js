"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Apps = void 0;
exports.registerOrchestrator = registerOrchestrator;
let app;
exports.Apps = new Proxy({}, {
    get: (_target, nameProp) => {
        if (nameProp === 'self') {
            return app;
        }
        if (!app) {
            throw new Error(`Orchestrator not found`);
        }
        const prop = app[nameProp];
        if (typeof prop === 'function') {
            return prop.bind(app);
        }
        return prop;
    },
});
function registerOrchestrator(orch) {
    app = orch;
}
